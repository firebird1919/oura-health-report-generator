// Oura Health Report — the app version of the generated preventive health
// report. Opens on an Oura-app-style Summary tab (headline score rings,
// vitals at a glance, needs-attention callouts, top actions) with the full
// report sections one tap away in detail tabs: Comparison, Trends, Notes,
// Actions. Renders the newest stored snapshot by default and lets past
// snapshots be browsed from the history strip. All report content comes
// from the snapshot payload (server data); nothing person-specific is
// hard-coded here — the summary is derived from the same payload fields
// the detail tabs render.

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
CartesianGrid,
Line,
LineChart,
ReferenceLine,
ResponsiveContainer,
Tooltip,
XAxis,
YAxis,
} from "recharts";
import { SafeAreaTopScrim } from "@hatch/space-sdk/client";
import { api, type ApiResponse } from "./api";

type SnapshotMeta = ApiResponse<typeof api, "listSnapshots">["snapshots"][number];
type SnapshotFull = NonNullable<ApiResponse<typeof api, "getSnapshot">["snapshot"]>;
type Payload = SnapshotFull["payload"];
type ComparisonRow = Payload["comparison"][number];
type RiskTone = Payload["comparison"][number]["risk"];

type TabId = "summary" | "comparison" | "trends" | "notes" | "actions";

const TABS: { id: TabId; en: string; zh: string }[] = [
  { id: "summary", en: "Summary", zh: "總覽" },
  { id: "comparison", en: "Comparison", zh: "比較" },
  { id: "trends", en: "Trends", zh: "趨勢" },
  { id: "notes", en: "Notes", zh: "筆記" },
  { id: "actions", en: "Actions", zh: "行動" },
];

const RISK_TEXT: Record<RiskTone, string> = {
  red: "text-[var(--risk-red)]",
  yellow: "text-[var(--risk-amber)]",
  green: "text-[var(--risk-green)]",
};
const RISK_BADGE: Record<RiskTone, string> = {
  red: "border-[var(--risk-red)] text-[var(--risk-red)]",
  yellow: "border-[var(--risk-amber)] text-[var(--risk-amber)]",
  green: "border-[var(--risk-green)] text-[var(--risk-green)]",
};
const RISK_DOT: Record<RiskTone, string> = {
  red: "bg-[var(--risk-red)]",
  yellow: "bg-[var(--risk-amber)]",
  green: "bg-[var(--risk-green)]",
};

function SectionTitle({ children }: { children: string }) {
  return (
    <h2 className="mt-8 mb-3 text-xl font-semibold text-[var(--text)]">
      {children}
    </h2>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[0_6px_20px_rgba(30,43,67,0.06)] ${className}`}
    >
      {children}
    </div>
  );
}

function RiskBadge({ tone, label }: { tone: RiskTone; label: string }) {
  return (
    <span
      className={`inline-block rounded-full border px-2 py-0.5 text-xs font-bold whitespace-nowrap ${RISK_BADGE[tone]}`}
    >
      {label}
    </span>
  );
}

/* ---------------------------------- charts --------------------------------- */

const AXIS_TICK = { fontSize: 11, fill: "var(--dim)" };
const TOOLTIP_STYLE = {
  backgroundColor: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 10,
  color: "var(--text)",
  fontSize: 12,
};

function shortDay(day: string): string {
  return day.slice(5); // MM-DD
}

function SingleChart({
  title,
  data,
  color,
  formatY,
  zeroLine = false,
}: {
  title: string;
  data: Payload["charts"]["steps"];
  color: string;
  formatY?: (v: number) => string;
  zeroLine?: boolean;
}) {
  return (
    <Card>
      <h3 className="mb-2 text-sm font-semibold text-[var(--text)]">{title}</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickFormatter={shortDay}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              minTickGap={24}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={44}
              tickFormatter={formatY}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(label) => String(label)}
              formatter={(value) => [String(value), title.split(" / ")[0] ?? ""]}
            />
            {zeroLine ? <ReferenceLine y={0} stroke="var(--dim)" strokeDasharray="4 4" /> : null}
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              dot={{ r: 2.5, fill: color }}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function DualChart({
  title,
  data,
  colorA,
  colorB,
  labelA,
  labelB,
}: {
  title: string;
  data: Payload["charts"]["stressRecovery"];
  colorA: string;
  colorB: string;
  labelA: string;
  labelB: string;
}) {
  return (
    <Card>
      <h3 className="mb-1 text-sm font-semibold text-[var(--text)]">{title}</h3>
      <div className="mb-1 flex gap-4 text-xs text-[var(--dim)]">
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: colorA }} />
          {labelA}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: colorB }} />
          {labelB}
        </span>
      </div>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tickFormatter={shortDay}
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: "var(--border)" }}
              minTickGap={24}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={44}
              domain={["auto", "auto"]}
            />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              labelFormatter={(label) => String(label)}
              formatter={(value, name) => [String(value), name === "a" ? labelA : labelB]}
            />
            <Line type="monotone" dataKey="a" stroke={colorA} strokeWidth={2.5} dot={{ r: 2.5, fill: colorA }} activeDot={{ r: 4 }} />
            <Line type="monotone" dataKey="b" stroke={colorB} strokeWidth={2.5} dot={{ r: 2.5, fill: colorB }} activeDot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/* ------------------------------ summary pieces ----------------------------- */

// Oura's own score bands, as stated in the payload's guideline text:
// 85-100 optimal, 70-84 good, 60-69 fair, below 60 pay attention. Colors
// match the band-distribution bars in the Comparison tab.
function scoreBand(value: number): { en: string; zh: string; color: string } {
  if (value >= 85) return { en: "Optimal", zh: "最佳", color: "#2a9d50" };
  if (value >= 70) return { en: "Good", zh: "良好", color: "#74c69d" };
  if (value >= 60) return { en: "Fair", zh: "尚可", color: "#e9c46a" };
  return { en: "Pay Attention", zh: "需注意", color: "#e63946" };
}

function ScoreRing({ row }: { row: ComparisonRow }) {
  const value = Number.parseFloat(row.mean);
  const size = 136;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const known = Number.isFinite(value);
  const fraction = known ? Math.min(Math.max(value, 0), 100) / 100 : 0;
  const band = known ? scoreBand(value) : null;
  return (
    <div className="flex flex-col items-center text-center">
      <div
        className="relative"
        role="img"
        aria-label={`${row.metricEn}: ${row.mean} out of 100${band ? `, ${band.en}` : ""}`}
      >
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--border)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={band?.color ?? "var(--dim)"}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - fraction)}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold [font-variant-numeric:tabular-nums] text-[var(--text)]">
            {row.mean}
          </span>
          <span className="text-xs text-[var(--dim)]">/ 100</span>
        </div>
      </div>
      <p className="mt-2 font-semibold text-[var(--text)]">
        {row.metricEn} <span className="text-[var(--dim)]">/ {row.metricZh}</span>
      </p>
      {band ? (
        <p className="text-sm font-semibold" style={{ color: band.color }}>
          {band.en} · {band.zh}
        </p>
      ) : null}
      <p className="text-xs text-[var(--dim)]">window average / 本期平均</p>
    </div>
  );
}

// The vitals strip picks these comparison rows, in this order, when present.
const VITAL_METRICS = [
  "Main sleep duration",
  "Night average heart rate",
  "Blood oxygen (SpO2)",
  "Temperature deviation",
  "Daily steps",
];

function SummaryView({
  snapshot,
  onGoTab,
}: {
  snapshot: SnapshotFull;
  onGoTab: (tab: TabId) => void;
}) {
  const p = snapshot.payload;
  const scoreRows = p.comparison.filter((r) => r.unit === "0-100");
  const vitals = VITAL_METRICS.map((name) =>
    p.comparison.find((r) => r.metricEn === name),
  ).filter((r): r is ComparisonRow => r != null);
  const attention = p.comparison.filter((r) => r.risk !== "green");
  const topActions = p.recommendations.slice(0, 2);

  return (
    <div>
      <p className="mt-5 text-sm text-[var(--dim)]">
        This window at a glance / 本期總覽 · {snapshot.windowStart} → {snapshot.windowEnd}
      </p>

      {/* Headline scores, Oura style */}
      {scoreRows.length > 0 ? (
        <Card className="mt-3">
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-6 py-2">
            {scoreRows.map((row) => (
              <ScoreRing key={row.metricEn} row={row} />
            ))}
          </div>
        </Card>
      ) : null}

      {/* Vitals strip */}
      {vitals.length > 0 ? (
        <>
          <SectionTitle>Vitals / 關鍵數據</SectionTitle>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {vitals.map((row) => (
              <Card key={row.metricEn} className="p-3.5">
                <p className="flex items-start justify-between gap-1 text-xs text-[var(--dim)]">
                  <span>
                    {row.metricEn}
                    <br />
                    {row.metricZh}
                  </span>
                  <span className={`mt-1 inline-block h-2.5 w-2.5 shrink-0 rounded-full ${RISK_DOT[row.risk]}`} />
                </p>
                <p className="mt-1.5 text-2xl font-bold [font-variant-numeric:tabular-nums] text-[var(--text)]">
                  {row.mean}
                </p>
                <p className="text-xs text-[var(--dim)]">{row.unit} · avg / 平均</p>
              </Card>
            ))}
          </div>
        </>
      ) : null}

      {/* Needs attention — tap through to the Comparison tab */}
      {attention.length > 0 ? (
        <>
          <SectionTitle>Needs Attention / 需要注意</SectionTitle>
          <div className="grid gap-3">
            {attention.map((row) => (
              <button
                key={row.metricEn}
                type="button"
                onClick={() => onGoTab("comparison")}
                className="flex w-full items-center gap-3 rounded-[var(--radius)] border border-[var(--border)] bg-[var(--surface)] p-4 text-left shadow-[0_6px_20px_rgba(30,43,67,0.06)]"
              >
                <span className={`inline-block h-3 w-3 shrink-0 rounded-full ${RISK_DOT[row.risk]}`} />
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold text-[var(--text)]">
                    {row.metricEn} <span className="text-[var(--dim)]">/ {row.metricZh}</span>
                  </span>
                  <span className="block truncate text-sm text-[var(--dim)]">
                    {row.interpretation}
                  </span>
                </span>
                <RiskBadge tone={row.risk} label={row.riskLabel} />
              </button>
            ))}
          </div>
        </>
      ) : null}

      {/* Top priority actions */}
      {topActions.length > 0 ? (
        <>
          <SectionTitle>Top Priorities / 首要行動</SectionTitle>
          <div className="grid gap-3">
            {topActions.map((rec) => (
              <Card key={rec.priority}>
                <div className="flex items-center justify-between gap-2">
                  <span className="rounded-full border border-[#9ad6b3] bg-[#e6f6ec] px-2 py-0.5 text-xs font-bold text-[#15693f] dark:border-[#2c5c40] dark:bg-[#173325] dark:text-[#7fe0a8]">
                    Priority {rec.priority}
                  </span>
                  <RiskBadge tone={rec.risk} label={rec.riskLabel} />
                </div>
                <h3 className="mt-2 text-base font-semibold text-[var(--text)]">
                  {rec.domainEn} <span className="text-[var(--dim)]">/ {rec.domainZh}</span>
                </h3>
                <p className="mt-1 text-sm">
                  <b>Action 2-4 Weeks / 行動建議：</b>{" "}
                  <span className={rec.risk === "green" ? "" : `font-semibold ${RISK_TEXT[rec.risk]}`}>
                    {rec.action}
                  </span>
                </p>
              </Card>
            ))}
          </div>
          <button
            type="button"
            onClick={() => onGoTab("actions")}
            className="mt-3 min-h-11 w-full rounded-full border border-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--accent)]"
          >
            See all actions / 查看全部行動建議 →
          </button>
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------ detail sections ---------------------------- */

function ComparisonSection({ payload }: { payload: Payload }) {
  return (
    <>
      <SectionTitle>Preventive Comparison Table / 預防醫學比較表（含健康族群標準）</SectionTitle>

      {/* Phone: one card per metric */}
      <div className="grid gap-3 md:hidden">
        {payload.comparison.map((row) => (
          <Card key={row.metricEn}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-[var(--text)]">
                  {row.metricEn} <span className="text-[var(--dim)]">/ {row.metricZh}</span>
                </p>
                <p className="text-xs text-[var(--dim)]">{row.unit}</p>
              </div>
              <RiskBadge tone={row.risk} label={row.riskLabel} />
            </div>
            <p className="mt-2 text-sm">
              <span className="text-[var(--dim)]">Your mean: </span>
              <span className={`text-lg font-bold [font-variant-numeric:tabular-nums] ${RISK_TEXT[row.risk]}`}>
                {row.mean}
              </span>{" "}
              <span className="text-[var(--dim)]">{row.unit}</span>
            </p>
            <dl className="mt-2 space-y-1.5 text-sm">
              <div>
                <dt className="text-xs text-[var(--dim)]">Your data spread</dt>
                <dd>{row.spread}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--dim)]">Healthy population standard</dt>
                <dd>{row.standard}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--dim)]">Guideline / target</dt>
                <dd>{row.guideline}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--dim)]">Out-of-range rate</dt>
                <dd className={`font-semibold ${RISK_TEXT[row.risk]}`}>{row.outOfRange}</dd>
              </div>
              <div>
                <dt className="text-xs text-[var(--dim)]">Easy interpretation</dt>
                <dd>{row.interpretation}</dd>
              </div>
            </dl>
          </Card>
        ))}
      </div>

      {/* Desktop: the report's table */}
      <Card className="hidden overflow-x-auto p-0 md:block">
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="bg-[var(--bg)] text-left">
              {["Metric / 指標", "Risk level", "Unit", "Your mean", "Your data spread", "Healthy population standard", "Guideline / target", "Out-of-range rate", "Easy interpretation"].map(
                (h) => (
                  <th key={h} className="border-b border-[var(--border)] px-2.5 py-2 font-semibold">
                    {h}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {payload.comparison.map((row) => (
              <tr key={row.metricEn} className="align-top">
                <td className="border-b border-[var(--border)] px-2.5 py-2 font-medium whitespace-nowrap">
                  {row.metricEn}
                  <br />
                  <span className="text-[var(--dim)]">{row.metricZh}</span>
                </td>
                <td className="border-b border-[var(--border)] px-2.5 py-2">
                  <RiskBadge tone={row.risk} label={row.riskLabel} />
                </td>
                <td className="border-b border-[var(--border)] px-2.5 py-2 whitespace-nowrap">{row.unit}</td>
                <td className={`border-b border-[var(--border)] px-2.5 py-2 font-bold [font-variant-numeric:tabular-nums] ${RISK_TEXT[row.risk]}`}>
                  {row.mean}
                </td>
                <td className="border-b border-[var(--border)] px-2.5 py-2">{row.spread}</td>
                <td className="border-b border-[var(--border)] px-2.5 py-2">{row.standard}</td>
                <td className="border-b border-[var(--border)] px-2.5 py-2">{row.guideline}</td>
                <td className={`border-b border-[var(--border)] px-2.5 py-2 font-semibold ${RISK_TEXT[row.risk]}`}>
                  {row.outOfRange}
                </td>
                <td className="border-b border-[var(--border)] px-2.5 py-2">{row.interpretation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
      <p className="mt-2 text-sm text-[var(--dim)]">
        Color rule: <span className="font-bold text-[var(--risk-red)]">Red</span> = high risk,{" "}
        <span className="font-bold text-[var(--risk-amber)]">Yellow</span> = mild caution,{" "}
        <span className="font-bold text-[var(--risk-green)]">Green</span> = relatively stable.
      </p>
    </>
  );
}

const BAND_SEGMENTS = [
  { key: "optimal", label: "Optimal (85-100)", color: "#2a9d50" },
  { key: "good", label: "Good (70-84)", color: "#74c69d" },
  { key: "fair", label: "Fair (60-69)", color: "#e9c46a" },
  { key: "attention", label: "Pay attention (0-59)", color: "#e63946" },
] as const;

function BandsSection({ payload }: { payload: Payload }) {
  return (
    <>
      <SectionTitle>Oura Score Band Distribution / 分數區間分佈</SectionTitle>
      <div className="grid gap-3">
        {payload.bands.map((band) => (
          <Card key={band.nameEn}>
            <div className="flex items-baseline justify-between gap-2">
              <p className="font-semibold text-[var(--text)]">
                {band.nameEn} <span className="text-[var(--dim)]">/ {band.nameZh}</span>
              </p>
              <p className="text-xs text-[var(--dim)]">{band.total} days total</p>
            </div>
            <div
              className="mt-3 flex h-6 w-full overflow-hidden rounded-full border border-[var(--border)]"
              role="img"
              aria-label={`${band.nameEn} band distribution: ${BAND_SEGMENTS.map(
                (s) => `${s.label} ${band[s.key].count} days (${band[s.key].pct}%)`,
              ).join(", ")}`}
            >
              {BAND_SEGMENTS.map((s) =>
                band[s.key].pct > 0 ? (
                  <div
                    key={s.key}
                    style={{ width: `${band[s.key].pct}%`, background: s.color }}
                    className="h-full"
                  />
                ) : null,
              )}
            </div>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--dim)]">
              {BAND_SEGMENTS.map((s) => (
                <span key={s.key} className="inline-flex items-center gap-1.5">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: s.color }} />
                  {s.label}:{" "}
                  <span className="font-semibold text-[var(--text)] [font-variant-numeric:tabular-nums]">
                    {band[s.key].count} ({band[s.key].pct}%)
                  </span>
                </span>
              ))}
            </div>
            <p className="mt-2 text-sm text-[var(--dim)]">
              {band.noteEn}
              <br />
              {band.noteZh}
            </p>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-sm text-[var(--dim)]">
        <span className="font-semibold text-[var(--text)]">How this is evaluated / 怎麼評估：</span>{" "}
        {payload.bandEvalZh}
      </p>
    </>
  );
}

function NotesSection({ payload }: { payload: Payload }) {
  return (
    <>
      <SectionTitle>Data-Driven Clinical Notes / 醫學解讀筆記</SectionTitle>
      <Card>
        <ul className="list-disc space-y-1.5 pl-5 text-sm">
          {payload.notesEn.map((n) => (
            <li key={n}>{n}</li>
          ))}
        </ul>
        <div className="mt-4 space-y-2 border-t border-[var(--border)] pt-3 text-sm">
          {payload.notesZh.map((n) => (
            <p key={n}>{n}</p>
          ))}
        </div>
      </Card>
    </>
  );
}

function ChartsSection({ payload }: { payload: Payload }) {
  const c = payload.charts;
  return (
    <>
      <SectionTitle>Trend Graphs / 趨勢圖</SectionTitle>
      <div className="grid gap-3 lg:grid-cols-2">
        <SingleChart title="Daily Steps / 每日步數" data={c.steps} color="#ff6b8b" formatY={(v) => (v >= 1000 ? `${Math.round(v / 1000)}k` : String(v))} />
        <SingleChart title="Sleep Score / 睡眠分數" data={c.sleepScore} color="#5e60ce" />
        <SingleChart title="Readiness Score / 準備度分數" data={c.readiness} color="#2a9d8f" />
        <SingleChart title="Heart Rate (Daily Avg) / 心率（日均）" data={c.heartRate} color="#e63946" />
        <SingleChart title="Temperature Deviation / 體溫偏差（每日）" data={c.tempDeviation} color="#e07a5f" zeroLine />
        <DualChart title="Stress vs Recovery (Daily) / 壓力與恢復（每日）" data={c.stressRecovery} colorA="#e07a5f" colorB="#2a9d8f" labelA="Stress (min)" labelB="Recovery (min)" />
        <DualChart title="Deep vs REM Sleep (minutes) / 深睡與 REM（分鐘）" data={c.deepRem} colorA="#5e60ce" colorB="#ff6b8b" labelA="Deep" labelB="REM" />
      </div>
    </>
  );
}

function RecommendationsSection({ payload }: { payload: Payload }) {
  return (
    <>
      <SectionTitle>Medical Inference, Prediction, and Action Plan / 醫學推測、預測與行動建議</SectionTitle>
      <div className="grid gap-3">
        {payload.recommendations.map((rec) => (
          <Card key={rec.priority}>
            <div className="flex items-center justify-between gap-2">
              <span className="rounded-full border border-[#9ad6b3] bg-[#e6f6ec] px-2 py-0.5 text-xs font-bold text-[#15693f] dark:border-[#2c5c40] dark:bg-[#173325] dark:text-[#7fe0a8]">
                Priority {rec.priority}
              </span>
              <RiskBadge tone={rec.risk} label={rec.riskLabel} />
            </div>
            <h3 className="mt-2 text-base font-semibold text-[var(--text)]">
              {rec.domainEn} <span className="text-[var(--dim)]">/ {rec.domainZh}</span>
            </h3>
            <div className="mt-1 space-y-1.5 text-sm">
              <p>
                <b>Data Suggests / 資料推測：</b> {rec.dataSuggests}
              </p>
              <p>
                <b>Medical Meaning / 醫學意義：</b> {rec.medicalMeaning}
              </p>
              <p>
                <b>Action 2-4 Weeks / 行動建議：</b>{" "}
                <span className={rec.risk === "green" ? "" : `font-semibold ${RISK_TEXT[rec.risk]}`}>
                  {rec.action}
                </span>
              </p>
              <p>
                <b>Track / 追蹤：</b> {rec.track}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-4">
        <h3 className="text-base font-semibold text-[var(--text)]">Summary / 總結</h3>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
          {payload.summaryEn.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm">
          {payload.summaryZh.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-[var(--dim)]">{payload.priorityNote}</p>
      </Card>
    </>
  );
}

function ReferencesSection({ payload }: { payload: Payload }) {
  return (
    <>
      <SectionTitle>References / 參考來源</SectionTitle>
      <Card>
        <ul className="list-disc space-y-1 pl-5 text-sm">
          {payload.references.map((r) => (
            <li key={r}>{r}</li>
          ))}
        </ul>
        <p className="mt-4 border-t border-[var(--border)] pt-3 text-xs leading-relaxed text-[var(--dim)]">
          <b className="text-[var(--text)]">Medical disclaimer:</b> {payload.disclaimer}
        </p>
      </Card>
    </>
  );
}

/* ----------------------------------- app ----------------------------------- */

function ReportView({
  snapshot,
  snapshots,
  selectedId,
  onSelect,
}: {
  snapshot: SnapshotFull;
  snapshots: SnapshotMeta[];
  selectedId: number;
  onSelect: (id: number) => void;
}) {
  const p = snapshot.payload;
  const [tab, setTab] = useState<TabId>("summary");

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-10">
      {/* Hero — mirrors the generated report's header band */}
      <header className="mt-4 rounded-[20px] border border-[var(--border)] bg-[linear-gradient(135deg,var(--wash-pink),var(--wash-blue))] p-6 shadow-[0_10px_26px_rgba(30,43,67,0.08)]">
        <h1 className="text-[26px] leading-tight font-bold text-[var(--text)] sm:text-3xl">
          Preventive Health Deep-Dive / 預防醫學深度報告
        </h1>
        <p className="mt-2 text-[var(--dim)]">
          Your Oura data with healthy-population standards, practical ranges, and easy interpretation.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5">
            Data window: {snapshot.windowStart} to {snapshot.windowEnd}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5">
            Generated: {snapshot.generatedLabel}
          </span>
          <span className="rounded-full border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5">
            Approach: long-term trends + healthy-population standards + your own data distribution
          </span>
        </div>
      </header>

      {/* Snapshot history */}
      {snapshots.length > 1 ? (
        <nav aria-label="Report history" className="mt-4">
          <p className="mb-2 text-sm font-semibold text-[var(--text)]">
            Report History / 歷史報告
          </p>
          <div className="flex flex-wrap gap-2">
            {snapshots.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onSelect(s.id)}
                aria-pressed={s.id === selectedId}
                className={`min-h-9 rounded-full border px-3 py-1.5 text-sm ${
                  s.id === selectedId
                    ? "border-[var(--accent)] bg-[var(--accent)] font-semibold text-white"
                    : "border-[var(--border)] bg-[var(--surface)] text-[var(--text)]"
                }`}
              >
                {s.windowStart} → {s.windowEnd}
              </button>
            ))}
          </div>
        </nav>
      ) : null}

      {/* Tab bar — sticky so the detail sections stay one tap away */}
      <div className="sticky top-0 z-20 -mx-4 mt-4 bg-[var(--bg)] px-4 py-2">
        <div
          role="tablist"
          aria-label="Report sections"
          className="flex gap-1 rounded-full border border-[var(--border)] bg-[var(--surface)] p-1 shadow-[0_6px_20px_rgba(30,43,67,0.06)]"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`min-h-11 flex-1 rounded-full px-1 py-1.5 text-center leading-tight ${
                tab === t.id
                  ? "bg-[var(--accent)] font-semibold text-white"
                  : "text-[var(--dim)]"
              }`}
            >
              <span className="block text-[13px]">{t.en}</span>
              <span className="block text-[11px]">{t.zh}</span>
            </button>
          ))}
        </div>
      </div>

      {tab === "summary" ? (
        <div role="tabpanel">
          <SummaryView snapshot={snapshot} onGoTab={setTab} />
        </div>
      ) : null}

      {tab === "comparison" ? (
        <div role="tabpanel">
          <SectionTitle>Analysis Approach / 分析方法</SectionTitle>
          <Card>
            <ul className="list-disc space-y-1.5 pl-5 text-sm">
              {p.approach.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </Card>
          <ComparisonSection payload={p} />
          <BandsSection payload={p} />
        </div>
      ) : null}

      {tab === "trends" ? (
        <div role="tabpanel">
          <ChartsSection payload={p} />
        </div>
      ) : null}

      {tab === "notes" ? (
        <div role="tabpanel">
          <NotesSection payload={p} />
        </div>
      ) : null}

      {tab === "actions" ? (
        <div role="tabpanel">
          <RecommendationsSection payload={p} />
          <ReferencesSection payload={p} />
        </div>
      ) : null}
    </main>
  );
}

export function App() {
  const list = useQuery({
    queryKey: ["snapshots"],
    queryFn: () => api.listSnapshots({}),
  });
  const [pickedId, setPickedId] = useState<number | null>(null);

  const snapshots = list.data?.snapshots ?? [];
  const selectedId = pickedId ?? snapshots[0]?.id ?? null;

  const detail = useQuery({
    queryKey: ["snapshot", selectedId],
    queryFn: () => api.getSnapshot({ id: selectedId ?? 0 }),
    enabled: selectedId != null,
  });

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <SafeAreaTopScrim backgroundColor="var(--bg)" />

      {list.isPending ? (
        <main className="px-4 py-16 text-center text-sm text-[var(--dim)]">
          Loading your report… 載入中…
        </main>
      ) : list.error ? (
        <main className="px-4 py-16 text-center text-sm text-[var(--dim)]">
          Couldn't load the report. Please reopen the app.
        </main>
      ) : snapshots.length === 0 ? (
        <main className="mx-auto max-w-xl px-4 py-16 text-center">
          <h1 className="text-xl font-semibold">No report yet / 尚無報告</h1>
          <p className="mt-3 text-sm text-[var(--dim)]">
            Ask Muse to run your Oura report — it will pull your latest ring
            data, generate the preventive health report, and add it here as a
            snapshot.
          </p>
        </main>
      ) : detail.isPending || !detail.data?.snapshot ? (
        <main className="px-4 py-16 text-center text-sm text-[var(--dim)]">
          Loading your report… 載入中…
        </main>
      ) : (
        <ReportView
          // Keyed by snapshot so switching reports lands back on Summary.
          key={detail.data.snapshot.id}
          snapshot={detail.data.snapshot}
          snapshots={snapshots}
          selectedId={detail.data.snapshot.id}
          onSelect={setPickedId}
        />
      )}
    </div>
  );
}
