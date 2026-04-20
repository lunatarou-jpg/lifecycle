import { fetchWeather } from './weather';

const testWeather = async () => {
  try {
    const data = await fetchWeather(35.6895, 139.6917); // Tokyo
    console.log(`Fetched Weather: ${data.temperature}°C, Code: ${data.weatherCode}`);
    if (typeof data.temperature === 'number' && typeof data.weatherCode === 'number') {
      console.log('Fetch SUCCESS');
    }
  } catch (err) {
    console.error('Fetch FAILED', err);
  }
};

testWeather();
