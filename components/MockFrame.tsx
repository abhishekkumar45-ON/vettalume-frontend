"use client";

import { useEffect, useRef, useState } from "react";

export default function MockFrame({
  src,
  title,
  fill = false
}: {
  src: string;
  title: string;
  fill?: boolean;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    if (fill) return;
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (data && data.type === "mockFrameHeight" && typeof data.height === "number") {
        setHeight(Math.max(600, Math.ceil(data.height)));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [fill]);

  // Exam mode: fill the viewport under the site header and let the frame scroll internally
  // (keeps the exam's own timer/submit bar sticky). Non-exam pages auto-grow to content.
  const style = fill
    ? { width: "100%", height: "calc(100vh - 69px)", border: "none", display: "block", background: "transparent" }
    : { width: "100%", height, border: "none", display: "block", background: "transparent" };

  return <iframe ref={ref} src={src} title={title} scrolling={fill ? "yes" : "no"} style={style} />;
}
