const japanTimeZoneOffsetMs = 9 * 60 * 60 * 1000;

export function getJapanDayStart(date = new Date()): Date {
  const japanDate = new Date(date.getTime() + japanTimeZoneOffsetMs);
  const year = japanDate.getUTCFullYear();
  const month = japanDate.getUTCMonth();
  const day = japanDate.getUTCDate();
  return new Date(Date.UTC(year, month, day) - japanTimeZoneOffsetMs);
}
