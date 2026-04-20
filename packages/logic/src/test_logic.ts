import { getClothingAdvice } from './clothing';

const test = () => {
  const cases = [
    { temp: 5, code: 0, expected: 'ダウンジャケット / コート', umbrella: false },
    { temp: 15, code: 0, expected: 'セーター / ジャケット', umbrella: false },
    { temp: 22, code: 61, expected: '長そでシャツ', umbrella: true },
    { temp: 28, code: 0, expected: 'Tシャツ', umbrella: false },
  ];

  cases.forEach(c => {
    const result = getClothingAdvice(c.temp, c.code);
    const pass = result.clothing === c.expected && result.needsUmbrella === c.umbrella;
    console.log(`Temp: ${c.temp}, Code: ${c.code} -> ${result.clothing} (Umbrella: ${result.needsUmbrella}) [${pass ? 'PASS' : 'FAIL'}]`);
  });
};

test();
