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
    // Sample Oura day_summary labels (dailystress day_summary). Real
    // snapshots carry one entry per day; "" when Oura gave no label.
    stressDays: [
      { day: "2026-01-01", summary: "normal" },
      { day: "2026-01-02", summary: "relaxed" },
      { day: "2026-01-03", summary: "restored" },
      { day: "2026-01-04", summary: "normal" },
      { day: "2026-01-05", summary: "engaged" },
      { day: "2026-01-06", summary: "relaxed" },
      { day: "2026-01-07", summary: "restored" },
    ],
    // Sample Estimated Resilience — a transparent estimate computed from
    // the snapshot's own ring data (see README, "Estimated Resilience").
    // NOT Oura's official score. All values below are invented round
    // numbers for this fake window, including the sample anchor.
    resilience: {
      window: ["2026-01-01", "2026-01-07"],
      index: 62,
      level: "Solid",
      contributors: {
        nighttime_recovery: { score: 70, rating: "Good" },
        daytime_recovery: { score: 100, rating: "Optimal", avg_min: 120 },
        daytime_stress_load: { score: 20, rating: "Low", avg_min: 60 },
      },
      trend: [
        { day: "2026-01-01", index: 60, level: "Solid" },
        { day: "2026-01-02", index: 61, level: "Solid" },
        { day: "2026-01-03", index: 62, level: "Solid" },
        { day: "2026-01-04", index: 63, level: "Solid" },
        { day: "2026-01-05", index: 62, level: "Solid" },
        { day: "2026-01-06", index: 61, level: "Solid" },
        { day: "2026-01-07", index: 62, level: "Solid" },
      ],
      map: [
        { day: "2026-01-01", stress_min: 60, recovery_min: 120 },
        { day: "2026-01-02", stress_min: 65, recovery_min: 118 },
        { day: "2026-01-03", stress_min: 70, recovery_min: 115 },
        { day: "2026-01-04", stress_min: 62, recovery_min: 122 },
        { day: "2026-01-05", stress_min: 60, recovery_min: 120 },
        { day: "2026-01-06", stress_min: 64, recovery_min: 119 },
        { day: "2026-01-07", stress_min: 63, recovery_min: 121 },
      ],
      official_anchor: {
        date: "2026-01-07",
        level: "Solid",
        nighttime_recovery: "Good",
        daytime_recovery: "Optimal",
        daytime_stress_load: "Low",
        source: "SAMPLE \u2014 invented example anchor, not a real Oura reading",
      },
      method:
        "Transparent estimate (not Oura's proprietary score). Contributors use 14-day windows, as Oura labels them. Nighttime recovery = 70% sleep component (sleep score minus 8 points per hour below 7h) + 30% physiology component (50 + 1.5 per ms of HRV above the prior month's median, minus 3 per bpm of lowest resting HR above the prior month's median, clipped 0-100). Daytime recovery score = average daily recovery minutes / 120 x 100. Daytime stress load score = average daily stress minutes / 300 x 100. Level index = 0.4 x nighttime + 0.3 x daytime recovery + 0.3 x (100 - stress load), blending the 14-day value (40%) with a 28-day value (60%) because Oura's level visibly moves slower than its contributors. Levels: Limited <40, Adequate 40-54, Solid 55-64, Strong 65-79, Exceptional >=80. Contributor bands: Optimal >=80, Good 65-79, Fair 50-64, Pay attention <50; stress load Low <33, Moderate 33-65, High >=66. The Map plots 14-day rolling averages of daily stress and recovery minutes (not raw daily values). A fixed display offset is applied to the recovery axis so the trajectory registers against the level bands, as on Oura's map (whose recovery axis is normalized rather than raw minutes).",
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
      "Medical disclaimer: This report was generated by an unofficial open-source tool for health education and early screening support only. It is not a medical device, and it does not diagnose, treat, cure, or prevent any disease or condition; nothing in it is medical advice, and no doctor-patient relationship is created. Wearable data can be inaccurate or incomplete, and the automated interpretations here may be wrong; they are provided \"as is\" without warranties of any kind, and the developer and contributors accept no liability for reliance on this report. Always seek the advice of a qualified clinician with any questions about a medical condition, and never disregard professional advice or delay seeking it because of this report. If you think you may have a medical emergency, call your local emergency number immediately. This tool is not affiliated with, endorsed by, or sponsored by Oura Health Oy. See DISCLAIMER.md in the project repository for the full disclaimer.",
  },
};
