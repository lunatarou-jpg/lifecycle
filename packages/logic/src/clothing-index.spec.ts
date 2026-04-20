import { describe, it, expect } from 'vitest';
import { ClothingIndexEngine, CIInput } from './clothing-index';

describe('ClothingIndexEngine', () => {
  const engine = new ClothingIndexEngine();

  it('極寒のケース: スコアが低く、ダウンジャケットを推奨すること', () => {
    const input: CIInput = {
      maxTemp: 2,
      minTemp: -5,
      maxApparentTemp: -2,
      minApparentTemp: -10,
      maxWindSpeed: 5,
      precipitationProbability: 10,
      humidityMean: 40
    };
    const result = engine.calculate(input);
    expect(result.level).toBeLessThanOrEqual(3);
    expect(result.clothing).toBe('ダウンジャケット');
  });

  it('真夏のケース: スコアが高く、Tシャツを推奨すること', () => {
    const input: CIInput = {
      maxTemp: 33,
      minTemp: 25,
      maxApparentTemp: 36,
      minApparentTemp: 28,
      maxWindSpeed: 2,
      precipitationProbability: 0,
      humidityMean: 70
    };
    const result = engine.calculate(input);
    expect(result.score).toBeGreaterThanOrEqual(90);
    expect(result.clothing).toBe('Tシャツ');
    expect(result.advice).toContain('熱中症対策');
  });

  it('寒暖差が激しいケース: layeringRequired が true になり、アドバイスが含まれること', () => {
    const input: CIInput = {
      maxTemp: 22,
      minTemp: 8,
      maxApparentTemp: 20,
      minApparentTemp: 5,
      maxWindSpeed: 3,
      precipitationProbability: 0,
      humidityMean: 50
    };
    const result = engine.calculate(input);
    expect(result.layeringRequired).toBe(true);
    expect(result.advice).toContain('寒暖差');
  });

  it('強風のケース: 風冷え補正によりスコアが下がり、防風のアドバイスが出ること', () => {
    const input: CIInput = {
      maxTemp: 10,
      minTemp: 5,
      maxApparentTemp: 5,
      minApparentTemp: 0,
      maxWindSpeed: 12, // 強風
      precipitationProbability: 0,
      humidityMean: 40
    };
    const result = engine.calculate(input);
    expect(result.advice).toContain('風が強い');
  });

  it('雨のケース: needsUmbrella が true になること', () => {
    const input: CIInput = {
      maxTemp: 15,
      minTemp: 10,
      maxApparentTemp: 13,
      minApparentTemp: 8,
      maxWindSpeed: 2,
      precipitationProbability: 70, // 高い降水確率
      humidityMean: 90
    };
    const result = engine.calculate(input);
    expect(result.needsUmbrella).toBe(true);
    expect(result.advice).toContain('傘が必要です');
  });
});
