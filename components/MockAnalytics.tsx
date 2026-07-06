import Link from "next/link";
import { ArrowRight } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { getExam } from "@/app/learn/sectionData";
import type { MockView } from "@/app/mocks/mockData";

const EXAM_TABS = [
  { slug: "cat", label: "CAT" },
  { slug: "gmat", label: "GMAT" },
  { slug: "gre", label: "GRE" }
];

function AreaChart({ data, tone }: { data: number[]; tone: "gold" | "teal" | "amber" }) {
  const w = 600;
  const h = 210;
  const pad = 12;
  const max = Math.max(...data) + 6;
  const min = Math.min(...data) - 6;
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (w - 2 * pad);
    const y = h - pad - ((v - min) / range) * (h - 2 * pad);
    return [x, y] as const;
  });
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const last = pts[pts.length - 1];
  const first = pts[0];
  const area = `${line} L${last[0].toFixed(1)} ${h} L${first[0].toFixed(1)} ${h} Z`;
  return (
    <svg className={`areaChart ${tone}`} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      <path className="area" d={area} />
      <path className="line" d={line} vectorEffect="non-scaling-stroke" />
      <circle className="dot" cx={last[0]} cy={last[1]} r="6" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

export default function MockAnalytics({ view }: { view: MockView }) {
  const examData = getExam(view.exam);

  const startHref =
    view.kind === "full"
      ? `/mock-attempt.html?exam=${view.exam}`
      : `/mock-attempt.html?exam=${view.exam}&section=${view.section}`;

  const sectionHref = (name: string) => {
    const s = examData?.sections.find((x) => x.name === name);
    return s ? `/learn/${view.exam}/${s.slug}` : "/dashboard";
  };

  return (
    <>
      <SiteHeader />
      <main className="mockPage">
        <div className="sectionInner">
          <div className="mockTabs" role="tablist" aria-label="Exam">
            {EXAM_TABS.map((tab) => (
              <Link
                key={tab.slug}
                href={`/mocks/${tab.slug}/full`}
                className={tab.slug === view.exam ? "active" : ""}
              >
                {tab.label}
              </Link>
            ))}
          </div>

          <p className="mockEyebrow">{view.eyebrow}</p>
          <h1 className="mockTitle">{view.title}</h1>
          <p className="mockSubtitle">{view.subtitle}</p>

          <div className="mockStats">
            {view.stats.map((stat, i) => (
              <div className={i === view.stats.length - 1 ? "mockStat wide" : "mockStat"} key={stat.label}>
                <strong>
                  {stat.value}
                  {stat.unit ? <em>{stat.unit}</em> : null}
                </strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>

          <div className="mockCharts">
            <div className="mockPanel">
              <span className="panelLabel">Score progression</span>
              <AreaChart data={view.scoreProgression} tone="gold" />
            </div>
            <div className="mockPanel">
              <span className="panelLabel">Accuracy trend</span>
              <AreaChart data={view.accuracyTrend} tone="teal" />
            </div>
            <div className="mockPanel">
              <span className="panelLabel">Time management (avg sec / question)</span>
              <AreaChart data={view.timeManagement} tone="amber" />
            </div>
            <div className="mockPanel">
              <span className="panelLabel">
                {view.kind === "full" ? "Section-wise (latest mock)" : "Topic-wise (latest mock)"}
              </span>
              <div className="swList">
                {view.sectionWise.map((row) => (
                  <div className="swRow" key={row.name}>
                    <span>{row.name}</span>
                    <b>{row.pct}%</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mockTopics">
            <div className="mockPanel">
              <span className="panelLabel">Strongest topics</span>
              <div className="topicList">
                {view.strongest.map((t) => (
                  <div className="topicRow" key={t.name}>
                    <i className="dotGreen" aria-hidden="true" />
                    <span>{t.name}</span>
                    <b>{t.pct}%</b>
                  </div>
                ))}
              </div>
            </div>
            <div className="mockPanel">
              <span className="panelLabel">Weakest topics</span>
              <div className="topicList">
                {view.weakest.map((t) => (
                  <div className="topicRow" key={t.name}>
                    <i className="dotAmber" aria-hidden="true" />
                    <span>{t.name}</span>
                    <b>{t.pct}%</b>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mockPanel mockPath">
            <span className="panelLabel">Recommended learning path — priority order</span>
            <div className="pathHead">
              <p>Ordered by impact across all mocks, connecting mocks → learning.</p>
              <button type="button" className="refreshBtn">↻ Refresh</button>
            </div>
            {view.path.map((p, i) => (
              <div className="pathRow" key={p.name}>
                <span className="pathNum">{i + 1}</span>
                <p className="pathText">
                  {p.name} <em>({p.section})</em> — {p.pct}% across mocks
                </p>
                <Link className="goPractice" href={sectionHref(p.section)}>
                  Go practice <ArrowRight size={15} aria-hidden="true" />
                </Link>
              </div>
            ))}
          </div>

          <div className="mockList">
            <div className="mockListHead">
              <span aria-hidden="true">—</span> Mocks
            </div>
            {view.mocks.map((m) =>
              m.next ? (
                <div className="mockRow next" key={m.name}>
                  <span className="mockDot" aria-hidden="true" />
                  <b>{m.name}</b>
                  <span className="startNext">START NEXT</span>
                  <a className="startFull" href={startHref}>
                    {view.kind === "full" ? "Start full mock" : "Start section"}
                  </a>
                </div>
              ) : (
                <div className="mockRow" key={m.name}>
                  <span className="mockDot done" aria-hidden="true" />
                  <b>{m.name}</b>
                  <span className="mockBadge">
                    {m.ile}ILE · {m.pct}%
                  </span>
                  <Link className="viewAnalysis" href="#analysis">View analysis</Link>
                </div>
              )
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
