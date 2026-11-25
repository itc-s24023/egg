export type CharacterImageStatus = {
  brightness: number;
  logic: number;
  humor: number;
  politeness: number;
};

export type CharacterPersonalityType =
  | "ひだまり型"
  | "はかせ型"
  | "おどけ型"
  | "しんし型";

function hashName(name: string): number {
  let hash = 0;
  for (const character of name) hash = (hash * 31 + character.charCodeAt(0)) >>> 0;
  return hash;
}

export function getPersonalityType(
  name: string,
  status: CharacterImageStatus,
  storedType?: string | null,
): CharacterPersonalityType {
  if (storedType) {
    const normalized = storedType.replace(/好き$/, "型");
    if (normalized === "ひだまり型" || normalized === "はかせ型" || normalized === "おどけ型" || normalized === "しんし型") {
      return normalized;
    }
  }

  const values: Array<[CharacterPersonalityType, number]> = [
    ["ひだまり型", status.brightness],
    ["はかせ型", status.logic],
    ["おどけ型", status.humor],
    ["しんし型", status.politeness],
  ];
  const max = Math.max(...values.map(([, value]) => value));
  const candidates = values.filter(([, value]) => value === max).map(([type]) => type);
  if (candidates.length > 1) return candidates[hashName(name) % candidates.length];
  return candidates[0] ?? "ひだまり型";
}

export function getPersonalitySpeechStyle(personalityType: string | null): string {
  if (personalityType?.replace(/好き$/, "型") === "ひだまり型") {
    return "明るく前向きな口調で、親しみやすく元気よく話してください。";
  }
  if (personalityType?.replace(/好き$/, "型") === "はかせ型") {
    return "知的で落ち着いた口調で、理由や仕組みをわかりやすく説明してください。";
  }
  if (personalityType?.replace(/好き$/, "型") === "おどけ型") {
    return "明るくユーモアを交えた口調で、軽い冗談やひと言を使って親しげに話してください。";
  }
  if (personalityType?.replace(/好き$/, "型") === "しんし型") {
    return "丁寧で礼儀正しい口調で、相手への配慮を示しながら落ち着いて話してください。";
  }
  return "やさしく親しみやすい口調で話してください。";
}

const childImages: Record<CharacterPersonalityType, string[]> = {
  "ひだまり型": ["01_はなまる.png", "06_沖縄シーサー.png"],
  "はかせ型": ["06_どんぐりん.png", "08_めがねん.png"],
  "おどけ型": ["ピザ.png", "09_あめり.png"],
  "しんし型": ["03_ロックン.png", "07_つきの.png", "07_侍ネコ.png"],
};

const adultImages: Record<CharacterPersonalityType, string[]> = {
  "ひだまり型": ["ギャル/はなまるギャル.png", "クール/クールなはなまる.png", "チュウ二/中二病なはなまる.png"],
  "はかせ型": ["ギャル/ウインクするギャルどんぐりん-25.png", "クール/クールなどんぐりん-27.png", "チュウ二/中二病どんぐりん.png"],
  "おどけ型": ["ギャル/ギャル風ピザ.png", "クール/クールなピザキャラクター-7.png", "チュウ二/黒紫の邪気眼ピザキャラ-2.png"],
  "しんし型": ["ギャル/ピンクと金のギャル風ロックン-20.png", "クール/クールなロックン.png", "チュウ二/中二病ロックンの黒紫決めポーズ-12.png"],
};

const eggImages = ["オレンジ卵.png", "ミント色たまご.png", "ピンクい卵.png"];

export function getCharacterImage(
  name: string,
  growthStage: string,
  status: CharacterImageStatus,
  storedType?: string | null,
): { src: string; personalityType: CharacterPersonalityType } {
  const personalityType = getPersonalityType(name, status, storedType);
  const hash = hashName(name);

  if (growthStage === "たまご") {
    return { src: `/characters/egg/${eggImages[hash % eggImages.length]}`, personalityType };
  }

  const folder = {
    "ひだまり型": "hidamari",
    "はかせ型": "hakase",
    "おどけ型": "odoke",
    "しんし型": "shinshi",
  }[personalityType];

  if (growthStage === "せいちょう") {
    const images = adultImages[personalityType];
    return { src: `/characters/${folder}/${images[hash % images.length]}`, personalityType };
  }

  const images = childImages[personalityType];
  return { src: `/characters/${folder}/${images[hash % images.length]}`, personalityType };
}
