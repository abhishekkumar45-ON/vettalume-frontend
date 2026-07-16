"use client";

import { ChevronUp } from "lucide-react";
import TrendChart from "@/components/mocks/TrendChart";

// Static (dummy-data) "mock analysis dashboard" preview for the landing page.
// No required props; purely presentational.

const STATS = [
  { value: "4", denom: "/8", label: "Mocks attempted" },
  { value: "142", denom: "/198", label: "Latest score" },
  { value: "156", denom: "/198", label: "Best score" },
  { value: "64%", denom: null, label: "Avg accuracy" }
];

const SECTION_BARS = [
  { name: "VARC", pct: 68, color: "#b2847a" },
  { name: "DILR", pct: 52, color: "#7d9a84" },
  { name: "QA", pct: 79, color: "#797ea4" }
];

const TOPICS = [
  { name: "Reading Comprehension", pct: 75 },
  { name: "Critical Reasoning", pct: 58 },
  { name: "Vocabulary & Usage", pct: 50 }
];

export default function AnalysisPreview() {
  return (
    <div className="apPreview">
      {/* Stat cards */}
      <div className="apStats">
        {STATS.map((s) => (
          <div className="apStat" key={s.label}>
            <div className="apStatNum">
              {s.value}
              {s.denom ? <span className="apStatDenom">{s.denom}</span> : null}
            </div>
            <div className="apStatLabel">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Toggle bar */}
      <div className="apToggle">
        <span className="apToggleText">Hide analysis</span>
        <ChevronUp size={20} aria-hidden="true" />
      </div>

      {/* Analysis grid */}
      <div className="apGrid">
        {/* A: Section Performance (div bar chart) */}
        <div className="apBox">
          <div className="apBoxH">
            <div>
              <h3>Section Performance</h3>
              <span>Accuracy by section</span>
            </div>
          </div>
          <div className="apBars">
            {SECTION_BARS.map((b) => (
              <div className="apBarCol" key={b.name}>
                <div className="apBarTrack">
                  <div
                    className="apBarFill"
                    style={{ height: `${b.pct}%`, background: b.color }}
                  >
                    <span className="apBarPct">{b.pct}%</span>
                  </div>
                </div>
                <div className="apBarName">{b.name}</div>
              </div>
            ))}
          </div>
        </div>

        {/* B: Score Trend */}
        <div className="apBox">
          <div className="apBoxH">
            <div>
              <h3>Score Trend</h3>
              <span>Score across mocks</span>
            </div>
            <span className="apDelta up">&#9650; +16 since M1</span>
          </div>
          <TrendChart
            yMax={70}
            current="58/70"
            points={[
              { label: "M1", value: 41 },
              { label: "M2", value: 47 },
              { label: "M3", value: 30 },
              { label: "M4", value: 58 }
            ]}
          />
        </div>

        {/* C: Accuracy Trend */}
        <div className="apBox">
          <div className="apBoxH">
            <div>
              <h3>Accuracy Trend</h3>
              <span>Correct rate by mock</span>
            </div>
            <span className="apDelta up">&#9650; +23 since M1</span>
          </div>
          <TrendChart
            yMax={100}
            current="83%"
            points={[
              { label: "M1", value: 60 },
              { label: "M2", value: 65 },
              { label: "M3", value: 42 },
              { label: "M4", value: 83 }
            ]}
          />
        </div>

        {/* D: Time Management */}
        <div className="apBox">
          <div className="apBoxH">
            <div>
              <h3>Time Management</h3>
              <span>Avg sec per question</span>
            </div>
            <span className="apDelta good">&#9660; 18s faster</span>
          </div>
          <TrendChart
            yMax={100}
            current="70s"
            accent="var(--green)"
            points={[
              { label: "M1", value: 89 },
              { label: "M2", value: 79 },
              { label: "M3", value: 76 },
              { label: "M4", value: 70 }
            ]}
          />
        </div>
      </div>

      {/* Topic-wise Performance */}
      <div className="apBox apTopics">
        <div className="apBoxH">
          <div>
            <h3>Topic-wise Performance</h3>
          </div>
        </div>
        <div className="apTopicList">
          {TOPICS.map((t) => (
            <div className="apTopicRow" key={t.name}>
              <div className="apTopicName">{t.name}</div>
              <div className="apTopicTrack">
                <div className="apTopicFill" style={{ width: `${t.pct}%` }} />
              </div>
              <div className="apTopicVal">{t.pct}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
