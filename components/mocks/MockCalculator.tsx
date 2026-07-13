"use client";

import { useState } from "react";
import { X } from "lucide-react";

// A basic on-screen calculator (CAT allows a simple calculator), styled in the platform theme.
export default function MockCalculator({ onClose }: { onClose: () => void }) {
  const [display, setDisplay] = useState("0");
  const [acc, setAcc] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true); // next digit starts a new number
  const [mem, setMem] = useState(0);

  const cur = () => parseFloat(display) || 0;
  const show = (n: number) => {
    const s = Number.isFinite(n) ? String(Math.round(n * 1e10) / 1e10) : "Error";
    setDisplay(s);
  };

  function inputDigit(d: string) {
    if (fresh) {
      setDisplay(d === "." ? "0." : d);
      setFresh(false);
    } else if (d === "." ) {
      if (!display.includes(".")) setDisplay(display + ".");
    } else {
      setDisplay(display === "0" ? d : display + d);
    }
  }

  function apply(a: number, b: number, o: string): number {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  }

  function chooseOp(o: string) {
    if (op && !fresh && acc != null) {
      const r = apply(acc, cur(), op);
      setAcc(r);
      show(r);
    } else {
      setAcc(cur());
    }
    setOp(o);
    setFresh(true);
  }

  function equals() {
    if (op != null && acc != null) {
      const r = apply(acc, cur(), op);
      show(r);
      setAcc(null);
      setOp(null);
      setFresh(true);
    }
  }

  function unary(fn: (n: number) => number) {
    show(fn(cur()));
    setFresh(true);
  }

  const KEYS: { label: string; act: () => void; kind?: string }[] = [
    { label: "MC", act: () => setMem(0), kind: "mem" },
    { label: "MR", act: () => { show(mem); setFresh(true); }, kind: "mem" },
    { label: "MS", act: () => setMem(cur()), kind: "mem" },
    { label: "M+", act: () => setMem(mem + cur()), kind: "mem" },
    { label: "M-", act: () => setMem(mem - cur()), kind: "mem" },
    { label: "←", act: () => setDisplay(display.length > 1 ? display.slice(0, -1) : "0"), kind: "fn" },
    { label: "C", act: () => { setDisplay("0"); setAcc(null); setOp(null); setFresh(true); }, kind: "fn" },
    { label: "±", act: () => unary((n) => -n), kind: "fn" },
    { label: "√", act: () => unary((n) => Math.sqrt(n)), kind: "fn" },
    { label: "7", act: () => inputDigit("7") },
    { label: "8", act: () => inputDigit("8") },
    { label: "9", act: () => inputDigit("9") },
    { label: "/", act: () => chooseOp("/"), kind: "op" },
    { label: "%", act: () => unary((n) => n / 100), kind: "fn" },
    { label: "4", act: () => inputDigit("4") },
    { label: "5", act: () => inputDigit("5") },
    { label: "6", act: () => inputDigit("6") },
    { label: "*", act: () => chooseOp("*"), kind: "op" },
    { label: "1/x", act: () => unary((n) => (n === 0 ? NaN : 1 / n)), kind: "fn" },
    { label: "1", act: () => inputDigit("1") },
    { label: "2", act: () => inputDigit("2") },
    { label: "3", act: () => inputDigit("3") },
    { label: "-", act: () => chooseOp("-"), kind: "op" },
    { label: "=", act: equals, kind: "eq", span: true } as never,
    { label: "0", act: () => inputDigit("0") },
    { label: ".", act: () => inputDigit(".") },
    { label: "+", act: () => chooseOp("+"), kind: "op" }
  ];

  return (
    <div className="mrCalc" role="dialog" aria-label="Calculator">
      <div className="mrCalcHead">
        <span>Calculator</span>
        <button type="button" onClick={onClose} aria-label="Close calculator">
          <X size={16} />
        </button>
      </div>
      <div className="mrCalcDisplay">{display}</div>
      <div className="mrCalcKeys">
        {KEYS.map((k) => (
          <button
            type="button"
            key={k.label}
            className={`mrCalcKey${k.kind ? " k-" + k.kind : ""}${(k as { span?: boolean }).span ? " span2" : ""}`}
            onClick={k.act}
          >
            {k.label}
          </button>
        ))}
      </div>
    </div>
  );
}
