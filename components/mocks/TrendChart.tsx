"use client";

type Point = { label: string; value: number };

// A small, dependency-free line+area trend chart (SVG). Matches the app's hand-rolled chart style.
export default function TrendChart({
  points,
  yMax,
  current,
  accent = "var(--gold)"
}: {
  points: Point[];
  yMax: number;
  current?: string;
  accent?: string;
}) {
  const X0 = 34;
  const X1 = 428;
  const Y0 = 14;
  const Y1 = 192;
  const n = points.length;
  const X = (i: number) => (n <= 1 ? (X0 + X1) / 2 : X0 + ((X1 - X0) * i) / (n - 1));
  const Y = (v: number) => Y1 - (Y1 - Y0) * Math.max(0, Math.min(1, yMax > 0 ? v / yMax : 0));
  const gridY = [Y0, 58.5, 103, 147.5, Y1];

  return (
    <svg className="smChart" viewBox="0 0 440 220" role="img" aria-label="trend chart">
      {gridY.map((y, i) => (
        <line key={i} className="smGrid" x1={X0} y1={y} x2={X1} y2={y} />
      ))}
      {n === 0 ? (
        <text className="smNoData" x={231} y={106} textAnchor="middle">
          No attempts yet
        </text>
      ) : (
        <>
          <path
            className="smArea"
            fill={accent}
            fillOpacity={0.14}
            d={
              "M" +
              points.map((p, i) => `${X(i).toFixed(1)},${Y(p.value).toFixed(1)}`).join(" L") +
              ` L${X(n - 1).toFixed(1)},${Y1} L${X(0).toFixed(1)},${Y1} Z`
            }
          />
          <polyline
            className="smLine"
            stroke={accent}
            points={points.map((p, i) => `${X(i).toFixed(1)},${Y(p.value).toFixed(1)}`).join(" ")}
          />
          {points.map((p, i) => (
            <g key={i}>
              <circle
                className={i === n - 1 ? "smDotLast" : "smDot"}
                style={i === n - 1 ? { stroke: accent } : { fill: accent }}
                cx={X(i)}
                cy={Y(p.value)}
                r={i === n - 1 ? 4.4 : 2.6}
              />
              <text className="smXlab" x={X(i)} y={208} textAnchor="middle">
                {p.label}
              </text>
            </g>
          ))}
          {current ? (
            <text
              className="smCur"
              x={Math.min(424, X(n - 1))}
              y={Y(points[n - 1].value) - 10}
              textAnchor="end"
            >
              {current}
            </text>
          ) : null}
        </>
      )}
    </svg>
  );
}
