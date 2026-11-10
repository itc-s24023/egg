export type CareType = "feed" | "play" | "sleep";
export const careEffects: Record<CareType, { experience: number; hunger: number; energy: number; friendship: number }> = {
  feed: { experience: 10, hunger: 20, energy: 0, friendship: 2 },
  play: { experience: 15, hunger: -5, energy: -10, friendship: 8 },
  sleep: { experience: 8, hunger: -2, energy: 25, friendship: 3 },
};

export function growthStage(experience: number): string {
  if (experience >= 300) return "せいちょう";
  if (experience >= 100) return "こども";
  return "たまご";
}

export function clamp(value: number): number {
  return Math.max(0, Math.min(100, value));
}
