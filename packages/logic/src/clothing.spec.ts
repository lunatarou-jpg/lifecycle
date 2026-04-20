import { describe, it, expect } from 'vitest';
import { getClothingAdvice } from './clothing';

describe('clothingLogic', () => {
  it('10℃未満なら厚手のコートやダウンを提案する', () => {
    const advice = getClothingAdvice(5, 0);
    expect(advice.clothing).toMatch(/ダウン|コート/);
  });

  it('15℃前後ならカーディガンやジャケットを提案する', () => {
    const advice = getClothingAdvice(15, 0);
    expect(advice.clothing).toMatch(/カーディガン|ジャケット/);
  });

  it('25℃以上ならTシャツを提案する', () => {
    const advice = getClothingAdvice(28, 0);
    expect(advice.clothing).toMatch(/Tシャツ/);
  });

  it('天候コードが51以上（雨など）の場合、傘が必要と判定する', () => {
    const rainAdvice = getClothingAdvice(20, 61);
    expect(rainAdvice.needsUmbrella).toBe(true);

    const clearAdvice = getClothingAdvice(20, 0);
    expect(clearAdvice.needsUmbrella).toBe(false);
  });
});
