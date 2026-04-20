import React, { useEffect, useState, useRef } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ActivityIndicator, TouchableOpacity, Alert, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import * as ExpoLocation from 'expo-location';
import { 
  fetchWeather, 
  ClothingIndexEngine, 
  CIResult, 
  Location, 
  DEFAULT_LOCATIONS, 
  createDefaultSchedule,
  WeeklySchedule
} from '../../packages/logic/src/index';

const engine = new ClothingIndexEngine();

export default function App() {
  const [loading, setLoading] = useState(true);
  const [gpsWeather, setGpsWeather] = useState<CIResult | null>(null);
  const [commuteAdvice, setCommuteAdvice] = useState<string | null>(null);
  const [scheduledResults, setScheduledResults] = useState<{name: string, result: CIResult}[]>([]);
  const [error, setError] = useState<string | null>(null);

  // ユーザー設定 (所沢・大崎の初期値)
  const [locations] = useState<Location[]>(DEFAULT_LOCATIONS);
  const [schedule] = useState<WeeklySchedule>(createDefaultSchedule('tokorozawa', 'osaki'));

  const loadAllData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. GPS現在地の取得
      let { status } = await ExpoLocation.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        const loc = await ExpoLocation.getCurrentPositionAsync({});
        const w = await fetchWeather(loc.coords.latitude, loc.coords.longitude);
        // CIInputの形式に変換 (一部簡略化)
        const result = engine.calculate({
          maxTemp: w.temperature + 2, minTemp: w.temperature - 2,
          maxApparentTemp: w.temperature + 1, minApparentTemp: w.temperature - 3,
          maxWindSpeed: 3, precipitationProbability: w.precipitationProbability, humidityMean: 50
        });
        setGpsWeather(result);
      }

      // 2. 本日のスケジュールの判定
      const today = new Date().getDay();
      const todaySchedule = schedule[today];
      const locationIds = Array.from(new Set([
        todaySchedule.morningLocationId,
        todaySchedule.daytimeLocationId,
        todaySchedule.eveningLocationId
      ]));

      const results: {name: string, result: CIResult}[] = [];
      for (const id of locationIds) {
        const loc = locations.find(l => l.id === id);
        if (loc) {
          const w = await fetchWeather(loc.lat, loc.lon);
          const res = engine.calculate({
            maxTemp: w.temperature + 2, minTemp: w.temperature - 2,
            maxApparentTemp: w.temperature + 1, minApparentTemp: w.temperature - 3,
            maxWindSpeed: 3, precipitationProbability: w.precipitationProbability, humidityMean: 50
          });
          results.push({ name: loc.name, result: res });
        }
      }
      setScheduledResults(results);

      // 3. 安全第一の統合アドバイス生成
      const anyRain = results.some(r => r.result.needsUmbrella);
      const minLevel = Math.min(...results.map(r => r.result.level));
      const worstClothing = results.find(r => r.result.level === minLevel)?.result.clothing;

      let adviceText = `今日は${results.map(r => r.name).join('と')}を移動する予定ですね。`;
      adviceText += `一番寒い場所に合わせると「${worstClothing}」がおすすめです。`;
      if (anyRain) adviceText += " どこかで雨が降る可能性があるので、傘を忘れずに！";
      
      setCommuteAdvice(adviceText);

    } catch (err) {
      console.error(err);
      setError('データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.loadingText}>移動ルートの天気をチェック中...</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Weather-Wear</Text>

      {/* 統合アドバイス */}
      <View style={styles.adviceCard}>
        <Text style={styles.adviceTitle}>🏠 本日の通勤アドバイス</Text>
        <Text style={styles.adviceBody}>{commuteAdvice}</Text>
      </View>

      {/* GPS現在地 */}
      {gpsWeather && (
        <View style={styles.gpsCard}>
          <Text style={styles.cardLabel}>📍 現在地の天気</Text>
          <Text style={styles.clothingName}>{gpsWeather.clothing}</Text>
          <Text style={styles.adviceDetail}>{gpsWeather.advice}</Text>
        </View>
      )}

      {/* スケジュール拠点一覧 */}
      <Text style={styles.sectionTitle}>予定ルートの天気</Text>
      {scheduledResults.map((item, index) => (
        <View key={index} style={styles.locationCard}>
          <View style={styles.locationHeader}>
            <Text style={styles.locationName}>{item.name}</Text>
            {item.result.needsUmbrella && <Text style={styles.umbrellaIcon}>☔</Text>}
          </View>
          <Text style={styles.locationClothing}>{item.result.clothing}</Text>
        </View>
      ))}

      <TouchableOpacity style={styles.refreshButton} onPress={loadAllData}>
        <Text style={styles.refreshText}>情報を更新する</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    paddingTop: 60,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 15,
    color: '#5f6368',
  },
  header: {
    fontSize: 32,
    fontWeight: '900',
    color: '#1a73e8',
    marginBottom: 25,
  },
  adviceCard: {
    backgroundColor: '#e8f0fe',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#d2e3fc',
  },
  adviceTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1967d2',
    marginBottom: 10,
  },
  adviceBody: {
    fontSize: 16,
    lineHeight: 24,
    color: '#3c4043',
  },
  gpsCard: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  cardLabel: {
    fontSize: 12,
    color: '#70757a',
    marginBottom: 10,
    fontWeight: 'bold',
  },
  clothingName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#202124',
    marginBottom: 5,
  },
  adviceDetail: {
    fontSize: 14,
    color: '#5f6368',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#202124',
  },
  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderLeftWidth: 4,
    borderLeftColor: '#1a73e8',
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationName: {
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
  umbrellaIcon: {
    fontSize: 18,
  },
  locationClothing: {
    fontSize: 14,
    color: '#1a73e8',
    fontWeight: 'bold',
  },
  refreshButton: {
    backgroundColor: '#1a73e8',
    padding: 18,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
  refreshText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
