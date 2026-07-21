export type PtlStageRef = {
  label: string;
  startggEventId: string;
};

export const ptlStages: PtlStageRef[] = [
  { label: "Stage 1", startggEventId: "tournament/pakistan-tekken-league-stage-1/event/tekken-8" },
  { label: "Stage 2", startggEventId: "tournament/pakistan-tekken-league-stage-2/event/tekken-8" },
  { label: "Stage 3", startggEventId: "tournament/pakistan-tekken-league-stage-3/event/tekken-8" },
  { label: "Stage 4", startggEventId: "tournament/pakistan-tekken-league-stage-4/event/tekken-8" },
];

export type PtlPointsRow = {
  player: string;
  stage1: number | null;
  stage2: number | null;
  stage3: number | null;
  stage4: number | null;
  total: number;
};

// Season points race, updated per Stage 4 results.
// Stage champions (Esharib, Shehram, Usama Abbasi, Zubair) already hold their slots via stage wins and are
// excluded from this ranking.
export const ptlPointsRace: PtlPointsRow[] = [
  { player: "NUMAN CH", stage1: 1, stage2: 10, stage3: 50, stage4: 100, total: 161 },
  { player: "AHSAN ALI", stage1: 1, stage2: 100, stage3: 15, stage4: 1, total: 117 },
  { player: "DAWOOD SIKANDAR", stage1: 100, stage2: 0, stage3: 5, stage4: 10, total: 115 },
  { player: "FOXCE", stage1: 0, stage2: 0, stage3: 100, stage4: 5, total: 105 },
  { player: "ABID RAJPOOT", stage1: 0, stage2: 70, stage3: 10, stage4: 10, total: 90 },
  { player: "KARMA", stage1: 30, stage2: 50, stage3: 5, stage4: 0, total: 85 },
  { player: "FARZEEN", stage1: 30, stage2: 0, stage3: 5, stage4: 50, total: 85 },
  { player: "QASIM MEER", stage1: 70, stage2: 0, stage3: 10, stage4: 1, total: 81 },
  { player: "HAFIZ TANVEER", stage1: 5, stage2: 0, stage3: 70, stage4: 0, total: 75 },
  { player: "THE JON", stage1: 10, stage2: 0, stage3: 30, stage4: 30, total: 70 },
  { player: "HAFEEZ", stage1: 50, stage2: 1, stage3: 0, stage4: 1, total: 52 },
  { player: "KASHI SNAKE", stage1: 0, stage2: 15, stage3: 15, stage4: 15, total: 45 },
  { player: "SOMWRECK", stage1: 1, stage2: 30, stage3: 0, stage4: 5, total: 36 },
  { player: "MOHSIN SHOOTER", stage1: 10, stage2: 5, stage3: 0, stage4: 1, total: 16 },
  { player: "HAFIZ ADEEL", stage1: 15, stage2: 0, stage3: 0, stage4: 0, total: 15 },
  { player: "AWAIS LIAQAT", stage1: 0, stage2: 10, stage3: 1, stage4: 1, total: 12 },
  { player: "WILLIAM", stage1: 0, stage2: 10, stage3: 1, stage4: 0, total: 11 },
  { player: "TAYYAB MUNIR", stage1: 0, stage2: 10, stage3: 0, stage4: 0, total: 10 },
  { player: "ASAD JUTT", stage1: 0, stage2: 0, stage3: 10, stage4: 0, total: 10 },
  { player: "RAMZAN", stage1: 0, stage2: 5, stage3: 1, stage4: 0, total: 6 },
  { player: "FAIZAN BUTT", stage1: 5, stage2: 1, stage3: 0, stage4: 0, total: 6 },
  { player: "MALIK ASH", stage1: 0, stage2: 5, stage3: 0, stage4: 0, total: 5 },
  { player: "UNKNOWN OP", stage1: 0, stage2: 5, stage3: 0, stage4: 0, total: 5 },
  { player: "ATIF", stage1: 5, stage2: 0, stage3: 0, stage4: 0, total: 5 },
  { player: "MUNEEB RAHMAN", stage1: 5, stage2: 0, stage3: 0, stage4: 0, total: 5 },
  { player: "SAJAWAL", stage1: 1, stage2: 1, stage3: 0, stage4: 0, total: 2 },
  { player: "PROFESSOR", stage1: 0, stage2: 1, stage3: 0, stage4: 0, total: 1 },
  { player: "AHMAD ALI", stage1: 0, stage2: 1, stage3: 0, stage4: 0, total: 1 },
  { player: "NUMB", stage1: 0, stage2: 1, stage3: 0, stage4: 0, total: 1 },
  { player: "MOHSIN ALI", stage1: 0, stage2: 1, stage3: 0, stage4: 0, total: 1 },
  { player: "RAFAQAT ALI", stage1: 0, stage2: 1, stage3: 0, stage4: 0, total: 1 },
  { player: "ASAD MUGHAL", stage1: 1, stage2: 0, stage3: 0, stage4: 0, total: 1 },
  { player: "AMAR XR", stage1: 1, stage2: 0, stage3: 0, stage4: 0, total: 1 },
  { player: "ROHAIL", stage1: 1, stage2: 0, stage3: 0, stage4: 0, total: 1 },
  { player: "AHMAD BHATTI", stage1: 1, stage2: 0, stage3: 0, stage4: 0, total: 1 },
  { player: "NOMAN HERO", stage1: 0, stage2: 0, stage3: 1, stage4: 0, total: 1 },
  { player: "KW USMAN", stage1: 0, stage2: 0, stage3: 1, stage4: 0, total: 1 },
  { player: "SILLY YOSHI", stage1: 0, stage2: 0, stage3: 1, stage4: 0, total: 1 },
  { player: "UMAIR KHAN", stage1: 0, stage2: 0, stage3: 1, stage4: 0, total: 1 },
  { player: "HARIS", stage1: 0, stage2: 0, stage3: 1, stage4: 0, total: 1 },
];

export const ptlStageChampions = [
  { stage: "Stage 1", player: "ESHARIB" },
  { stage: "Stage 2", player: "SHEHRAM" },
  { stage: "Stage 3", player: "USAMA ABBASI" },
  { stage: "Stage 4", player: "ZUBAIR" },
];
