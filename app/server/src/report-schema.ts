// The report payload contract, shared by the actions (request/response
// validation), the seed module, and — through the Actions types — the client.
//
// This mirrors the sections of the generated Oura preventive health report:
// approach bullets, the preventive comparison table, the score band
// distribution, clinical notes, trend chart series, prioritized
// recommendations with a bilingual summary, references, and the disclaimer.
// All display strings are bilingual where the report is (English first,
// Traditional Chinese second), and are carried as data — never hard-coded
// in components — so a refreshed snapshot renders identically in structure.

import { z } from "@hatch/space-sdk";

export const riskTone = z.enum(["red", "yellow", "green"]);
export type RiskTone = z.infer<typeof riskTone>;

export const comparisonRowSchema = z.object({
  metricEn: z.string(),
  metricZh: z.string(),
  risk: riskTone,
  riskLabel: z.string(), // e.g. "High Risk / 高風險"
  unit: z.string(),
  mean: z.string(), // your mean, as displayed (e.g. "7.50")
  spread: z.string(), // e.g. "Median 5.24 (P10-P90: 4.06-6.89)"
  standard: z.string(), // healthy-population standard
  guideline: z.string(), // guideline / target source
  outOfRange: z.string(), // e.g. "0.0% nights < 7 h"
  interpretation: z.string(),
});
export type ComparisonRow = z.infer<typeof comparisonRowSchema>;

export const bandCellSchema = z.object({
  count: z.number(),
  pct: z.number(), // 0-100, one decimal as generated
});
export type BandCell = z.infer<typeof bandCellSchema>;

export const bandRowSchema = z.object({
  nameEn: z.string(),
  nameZh: z.string(),
  optimal: bandCellSchema, // 85-100
  good: bandCellSchema, // 70-84
  fair: bandCellSchema, // 60-69
  attention: bandCellSchema, // 0-59
  total: z.number(),
  noteEn: z.string(),
  noteZh: z.string(),
});
export type BandRow = z.infer<typeof bandRowSchema>;

export const seriesPointSchema = z.object({
  day: z.string(), // YYYY-MM-DD
  value: z.number(),
});
export type SeriesPoint = z.infer<typeof seriesPointSchema>;

export const dualPointSchema = z.object({
  day: z.string(), // YYYY-MM-DD
  a: z.number(),
  b: z.number(),
});
export type DualPoint = z.infer<typeof dualPointSchema>;

export const recommendationSchema = z.object({
  priority: z.number().int().positive(),
  risk: riskTone,
  riskLabel: z.string(), // e.g. "High / 高"
  domainEn: z.string(),
  domainZh: z.string(),
  dataSuggests: z.string(),
  medicalMeaning: z.string(),
  action: z.string(),
  track: z.string(),
});
export type Recommendation = z.infer<typeof recommendationSchema>;

export const reportPayloadSchema = z.object({
  approach: z.array(z.string()),
  comparison: z.array(comparisonRowSchema),
  bands: z.array(bandRowSchema),
  bandEvalZh: z.string(),
  notesEn: z.array(z.string()),
  notesZh: z.array(z.string()),
  charts: z.object({
    steps: z.array(seriesPointSchema),
    sleepScore: z.array(seriesPointSchema),
    readiness: z.array(seriesPointSchema),
    heartRate: z.array(seriesPointSchema),
    tempDeviation: z.array(seriesPointSchema),
    stressRecovery: z.array(dualPointSchema), // a = stress minutes, b = recovery minutes
    deepRem: z.array(dualPointSchema), // a = deep minutes, b = REM minutes
  }),
  recommendations: z.array(recommendationSchema),
  summaryEn: z.array(z.string()),
  summaryZh: z.array(z.string()),
  priorityNote: z.string(),
  references: z.array(z.string()),
  disclaimer: z.string(),
});
export type ReportPayload = z.infer<typeof reportPayloadSchema>;
