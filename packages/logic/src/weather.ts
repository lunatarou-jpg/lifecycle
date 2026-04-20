export interface WeatherData {
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export const fetchWeather = async (lat: number, lon: number): Promise<WeatherData> => {
  // hourly=precipitation_probability を追加して今日の降水確率を取得
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=precipitation_probability`;
  const response = await fetch(url);
  const data = await response.json();

  // 現在の時刻に最も近い降水確率を抽出
  const currentHourIndex = new Date().getHours();
  const precipitationProb = data.hourly?.precipitation_probability?.[currentHourIndex] ?? 0;

  return {
    temperature: data.current_weather.temperature,
    weatherCode: data.current_weather.weathercode,
    precipitationProbability: precipitationProb,
  };
};
