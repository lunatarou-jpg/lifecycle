/**
 * 服装指数 (Clothing Index: CI) 算出エンジン
 */

export interface CIInput {
  maxTemp: number;
  minTemp: number;
  maxApparentTemp: number;
  minApparentTemp: number;
  maxWindSpeed: number;
  precipitationProbability: number;
  humidityMean: number;
}

export interface CIResult {
  score: number;      // 10 (極寒) 〜 100 (酷暑)
  level: number;      // 1 〜 10 の段階
  clothing: string;   // 代表的な服装
  advice: string;     // インテリジェントな助言
  layeringRequired: boolean; // 重ね着が必要か
  needsUmbrella: boolean;    // 傘が必要か
}

export class ClothingIndexEngine {
  /**
   * メイン算出メソッド
   */
  public calculate(input: CIInput): CIResult {
    const baseTemp = this.calculateWeightedApparentTemp(input);
    const windEffect = this.calculateWindChillDelta(input.maxTemp, input.maxWindSpeed);
    const humidityEffect = this.calculateHumidityBoost(input.maxTemp, input.humidityMean);
    
    // 基本スコアの算出 (10-100にスケーリング)
    let score = this.normalizeScore(baseTemp + humidityEffect - windEffect);
    
    // 寒暖差ペナルティ
    const tempDiff = input.maxTemp - input.minTemp;
    const layeringRequired = tempDiff > 10;
    if (layeringRequired) {
      // 寒暖差が激しい場合は、より低温（朝晩）に備えるようスコアを少し下方修正
      score -= 5;
    }

    const finalScore = Math.max(10, Math.min(100, Math.round(score)));
    const level = Math.ceil(finalScore / 10);
    
    const config = this.getCIConfig(finalScore);
    const advice = this.generateIntelligentAdvice(input, config, layeringRequired);

    return {
      score: finalScore,
      level,
      clothing: config.clothing,
      advice,
      layeringRequired,
      needsUmbrella: input.precipitationProbability >= 30,
    };
  }

  /**
   * 1. 基礎体感温度の算出 (ユーザー案: 7:3 重み付け)
   */
  private calculateWeightedApparentTemp(input: CIInput): number {
    return (input.maxApparentTemp * 0.7) + (input.minApparentTemp * 0.3);
  }

  /**
   * 2. 非線形な風冷え補正 (ミスナールの式を簡略化・調整)
   * 風速 1m/s につき体感温度が下がるが、強風ほどその影響は飽和しつつも不快感が増す
   */
  private calculateWindChillDelta(temp: number, wind: number): number {
    if (wind < 2) return 0;
    // ミスナールの式のエッセンス: 風速の0.5乗程度に比例する冷却
    const chill = 0.5 * Math.sqrt(wind) * (37 - temp) / 5;
    return Math.max(0, chill);
  }

  /**
   * 3. 不快指数に基づく暑さブースト
   */
  private calculateHumidityBoost(temp: number, humidity: number): number {
    if (temp < 24) return 0;
    // 不快指数 (DI) 算出
    const di = 0.81 * temp + 0.01 * humidity * (0.99 * temp - 14.3) + 46.3;
    if (di > 75) return (di - 75) * 1.5; // 75を超えると暑さ感が増幅
    return 0;
  }

  /**
   * 4. スコアの正規化 (温度から10-100のCIスコアへ)
   * 0度以下 -> 10, 30度以上 -> 100 となるような線形マッピング
   */
  private normalizeScore(temp: number): number {
    const minTempBoundary = 0;
    const maxTempBoundary = 32;
    const raw = ((temp - minTempBoundary) / (maxTempBoundary - minTempBoundary)) * 90 + 10;
    return raw;
  }

  /**
   * インテリジェントなメッセージ生成
   */
  private generateIntelligentAdvice(input: CIInput, config: any, layering: boolean): string {
    let parts: string[] = [config.baseAdvice];

    if (layering) {
      parts.push(`日中と朝晩の寒暖差が${Math.round(input.maxTemp - input.minTemp)}℃と非常に大きいため、着脱しやすい上着を。`);
    }

    if (input.maxWindSpeed > 7) {
      parts.push("風が強いため、数字よりもかなり寒く感じられそうです。防風性のある服を選びましょう。");
    }

    if (input.precipitationProbability >= 30 && input.precipitationProbability < 60) {
      parts.push("にわか雨の可能性があるため、折りたたみ傘があると安心です。");
    } else if (input.precipitationProbability >= 60) {
      parts.push("雨が降る可能性が高いため、しっかりとした傘が必要です。");
    }

    if (input.humidityMean > 80 && input.maxTemp > 25) {
      parts.push("湿度が高く蒸し暑いため、通気性の良い素材がおすすめです。");
    }

    return parts.join(" ");
  }

  private getCIConfig(score: number) {
    if (score <= 20) return { clothing: "ダウンジャケット", baseAdvice: "極寒の一日。最大級の防寒を。" };
    if (score <= 40) return { clothing: "厚手のコート", baseAdvice: "しっかりとした冬の装いでお出かけください。" };
    if (score <= 50) return { clothing: "トレンチコート", baseAdvice: "冬の気配を感じる寒さです。セーター等での調節を。" };
    if (score <= 60) return { clothing: "ジャケット", baseAdvice: "少し肌寒い陽気です。羽織るものが必要です。" };
    if (score <= 70) return { clothing: "カーディガン", baseAdvice: "長袖シャツに薄手の上着がちょうど良いでしょう。" };
    if (score <= 80) return { clothing: "長袖シャツ", baseAdvice: "シャツ一枚で快適に過ごせる、穏やかな一日です。" };
    if (score <= 90) return { clothing: "半袖シャツ", baseAdvice: "日差しが出ると暑さを感じる陽気です。" };
    return { clothing: "Tシャツ", baseAdvice: "厳しい暑さです。風通しの良い服装で熱中症対策を。" };
  }
}
