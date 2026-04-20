export interface Location {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

export type TimeOfDay = 'Morning' | 'Daytime' | 'Evening';

export interface DaySchedule {
  morningLocationId: string;
  daytimeLocationId: string;
  eveningLocationId: string;
}

export type WeeklySchedule = Record<number, DaySchedule>; // 0 (Sun) to 6 (Sat)

/**
 * 拠点の初期設定 (所沢・大崎の例)
 */
export const DEFAULT_LOCATIONS: Location[] = [
  { id: 'tokorozawa', name: '所沢', lat: 35.7997, lon: 139.4691 },
  { id: 'osaki', name: '大崎', lat: 35.6197, lon: 139.7285 },
];

/**
 * 水・金の通勤スケジュールのデフォルト
 */
export const createDefaultSchedule = (homeId: string, workId: string): WeeklySchedule => {
  const defaultDay: DaySchedule = {
    morningLocationId: homeId,
    daytimeLocationId: homeId,
    eveningLocationId: homeId,
  };

  const workDay: DaySchedule = {
    morningLocationId: homeId,
    daytimeLocationId: workId,
    eveningLocationId: homeId,
  };

  return {
    0: defaultDay,
    1: defaultDay,
    2: defaultDay,
    3: workDay, // Wed
    4: defaultDay,
    5: workDay, // Fri
    6: defaultDay,
  };
};
