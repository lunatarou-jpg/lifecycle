export interface ClothingAdvice {
  clothing: string;
  advice: string;
  needsUmbrella: boolean;
  precipitationProbability?: number;
}

/**
 * 気温と降水確率に基づいて服装アドバイスを生成する
 * 指標リファレンス: https://tenki.jp/indexes/dress/
 * 
 * @param temp 気温 (Celsius)
 * @param weatherCode WMO Weather interpretation codes
 * @param precipitationProb 降水確率 (%)
 */
export const getClothingAdvice = (
  temp: number, 
  weatherCode: number, 
  precipitationProb: number = 0
): ClothingAdvice => {
  let clothing = "";
  let advice = "";

  if (temp < 5) {
    clothing = "ダウンジャケット";
    advice = "万全の防寒対策を。手袋やマフラーもおすすめ。";
  } else if (temp < 10) {
    clothing = "厚手のコート";
    advice = "冬本番の寒さです。しっかり着込んでください。";
  } else if (temp < 15) {
    clothing = "セーター / トレンチコート";
    advice = "肌寒いです。重ね着で調節しましょう。";
  } else if (temp < 20) {
    clothing = "カーディガン / ジャケット";
    advice = "薄手の上着があると安心な気温です。";
  } else if (temp < 25) {
    clothing = "長そでシャツ";
    advice = "シャツ一枚で快適に過ごせそうです。";
  } else {
    clothing = "半袖 / Tシャツ";
    advice = "夏のような暑さです。風通しの良い服装を。";
  }

  // 傘の要否 (51以上は霧雨・雨・雪) または降水確率が30%以上
  const needsUmbrella = weatherCode >= 51 || precipitationProb >= 30;

  return {
    clothing,
    advice,
    needsUmbrella,
    precipitationProbability: precipitationProb,
  };
};
