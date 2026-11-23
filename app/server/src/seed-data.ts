// TEMPLATE SEED — sample data only, NOT a real person's report.
//
// This module is the ONLY place a specific person's report values live.
// The values below are invented round numbers for a fake one-week window,
// shipped so the app renders a complete report immediately after install
// and so the payload shape is documented by example.
//
// When installing this app for a real person, replace this snapshot with
// their first real one (built from their own Oura pull through
// generate_report.py), or skip seeding and add their snapshots through
// the `addSnapshot` action instead. `seedSnapshot` inserts this snapshot
// only when the snapshots table is empty.
//
// PRIVACY: never commit a real person's seed-data.ts, CSVs, or generated
// reports to a public repository.

import type { ReportPayload } from "./report-schema";

export const SEED_SNAPSHOT: {
  windowStart: string;
  windowEnd: string;
  generatedLabel: string;
  payload: ReportPayload;
} = {
  windowStart: "2026-01-01",
  windowEnd: "2026-01-07",
  generatedLabel: "2026-01-08",
  payload: {
    approach: [
      "Use general healthy standards first, then compare with your own data spread (median and P10-P90).",
      "Sleep, readiness, HR, SpO2 and temperature deviation are useful for early preventive signals.",
      "Single-day spikes are less important than multi-day trends (especially temperature and stress metrics).",
    ],
    comparison: [
      {
        metricEn: "Main sleep duration",
        metricZh: "主要睡眠時數",
        risk: "green",
        riskLabel: "Good / 穩定",
        unit: "hours/night",
        mean: "7.50",
        spread: "Median 7.50 (P10-P90: 7.00-8.00)",
        standard: "Adults commonly need 7-9 h/night; minimum target >=7 h (CDC)",
        guideline: "CDC sleep duration guidance",
        outOfRange: "0.0% nights < 7 h",
        interpretation:
          "Most preventive benefit is when sleep is regularly at or above 7 hours.",
      },
      {
        metricEn: "Sleep score",
        metricZh: "睡眠分數",
        risk: "green",
        riskLabel: "Good / 穩定",
        unit: "0-100",
        mean: "85.0",
        spread: "Median 85.0 (P10-P90: 80.0-90.0)",
        standard: "Consumer wellness score (not a clinical diagnostic scale)",
        guideline: "Oura bands: 85-100 optimal; 70-84 good; 60-69 fair; <60 pay attention",
        outOfRange: "0.0% days <70",
        interpretation: "Use sub-70 days as recovery warning days.",
      },
    ],
    bands: [
      {
        nameEn: "Sleep Score",
        nameZh: "睡眠分數",
        optimal: { count: 4, pct: 57.1 },
        good: { count: 3, pct: 42.9 },
        fair: { count: 0, pct: 0.0 },
        attention: { count: 0, pct: 0.0 },
        total: 7,
        noteEn: "Reflects overnight sleep quality and structure.",
        noteZh: "代表夜間睡眠品質與結構。",
      },
    ],
    bandEvalZh: "Oura 會把多個生理與行為訊號整合成 0-100 分。分數越高通常代表狀態越穩定；長期趨勢比單日波動更有判讀價值。",
    notesEn: [
      "Sample note: this snapshot is template demonstration data.",
    ],
    notesZh: [
      "這份比較先用健康族群的一般參考值，搭配你的數據表現，幫你快速看出目前最需要優先處理的項目。",
    ],
    charts: {
      steps: [
        { day: "2026-01-01", value: 8000 },
        { day: "2026-01-02", value: 9000 },
        { day: "2026-01-03", value: 7000 },
        { day: "2026-01-04", value: 10000 },
        { day: "2026-01-05", value: 8500 },
        { day: "2026-01-06", value: 9500 },
        { day: "2026-01-07", value: 8000 },
      ],
      sleepScore: [
        { day: "2026-01-01", value: 85 },
        { day: "2026-01-02", value: 88 },
        { day: "2026-01-03", value: 82 },
        { day: "2026-01-04", value: 90 },
        { day: "2026-01-05", value: 84 },
        { day: "2026-01-06", value: 86 },
        { day: "2026-01-07", value: 85 },
      ],
      readiness: [
        { day: "2026-01-01", value: 84 },
        { day: "2026-01-02", value: 87 },
        { day: "2026-01-03", value: 81 },
        { day: "2026-01-04", value: 89 },
        { day: "2026-01-05", value: 83 },
        { day: "2026-01-06", value: 85 },
        { day: "2026-01-07", value: 84 },
      ],
      heartRate: [
        { day: "2026-01-01", value: 62 },
        { day: "2026-01-02", value: 61 },
        { day: "2026-01-03", value: 63 },
        { day: "2026-01-04", value: 60 },
        { day: "2026-01-05", value: 62 },
        { day: "2026-01-06", value: 61 },
        { day: "2026-01-07", value: 62 },
      ],
      tempDeviation: [
        { day: "2026-01-01", value: 0.1 },
        { day: "2026-01-02", value: 0.0 },
        { day: "2026-01-03", value: -0.1 },
        { day: "2026-01-04", value: 0.1 },
        { day: "2026-01-05", value: 0.0 },
        { day: "2026-01-06", value: 0.1 },
        { day: "2026-01-07", value: 0.0 },
      ],
      stressRecovery: [
        { day: "2026-01-01", a: 60, b: 120 },
        { day: "2026-01-02", a: 55, b: 125 },
        { day: "2026-01-03", a: 65, b: 115 },
        { day: "2026-01-04", a: 50, b: 130 },
        { day: "2026-01-05", a: 60, b: 120 },
        { day: "2026-01-06", a: 58, b: 122 },
        { day: "2026-01-07", a: 60, b: 120 },
      ],
      deepRem: [
        { day: "2026-01-01", a: 90, b: 100 },
        { day: "2026-01-02", a: 95, b: 105 },
        { day: "2026-01-03", a: 85, b: 95 },
        { day: "2026-01-04", a: 100, b: 110 },
        { day: "2026-01-05", a: 90, b: 100 },
        { day: "2026-01-06", a: 92, b: 102 },
        { day: "2026-01-07", a: 90, b: 100 },
      ],
    },
    recommendations: [
      {
        priority: 1,
        risk: "green",
        riskLabel: "Low / 低",
        domainEn: "Sleep",
        domainZh: "睡眠",
        dataSuggests: "Sample data: sleep duration averages 7.5 h.",
        medicalMeaning: "Sample recommendation card showing the expected shape.",
        action: "Keep your current routine and continue small, repeatable habits that support sleep and recovery.",
        track: "Sleep duration and sleep score trend.",
      },
    ],
    summaryEn: [
      "Sample summary: this is template demonstration data, not a real report.",
    ],
    summaryZh: [
      "你的整體趨勢相對穩定，已經有不錯的健康基礎。",
    ],
    priorityNote:
      "Priority is ranked by: medical importance + feasibility + risk level (High/Moderate/Low). This section is decision-support, not a diagnosis.",
    references: [
      "CDC sleep duration guidance",
      "Oura API V2 documentation (cloud.ouraring.com/v2/docs)",
    ],
    disclaimer:
      "Medical disclaimer: This report is for health education and early screening support only. It is not a medical diagnosis, treatment plan, or emergency assessment. If you have persistent symptoms, abnormal readings, or urgent concerns, please seek care from a qualified clinician promptly.",
  },
};
