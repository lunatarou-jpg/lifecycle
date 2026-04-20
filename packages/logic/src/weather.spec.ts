import { describe, it, expect, vi } from 'vitest';
import { fetchWeather } from './weather';

describe('fetchWeather', () => {
  it('東京の座標で天気データが取得できる', async () => {
    // 実際のAPIを叩くテスト（ネットワーク環境が必要）
    const TOKYO_LAT = 35.6895;
    const TOKYO_LON = 139.6917;
    
    const data = await fetchWeather(TOKYO_LAT, TOKYO_LON);
    
    expect(data).toHaveProperty('temperature');
    expect(data).toHaveProperty('weatherCode');
    expect(typeof data.temperature).toBe('number');
    expect(typeof data.weatherCode).toBe('number');
  });

  it('fetchが失敗した場合にエラーを投げる（モックテスト例）', async () => {
    // fetchをグローバルにモック化
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    vi.stubGlobal('fetch', mockFetch);

    await expect(fetchWeather(0, 0)).rejects.toThrow('Network error');

    vi.unstubAllGlobals();
  });
});
