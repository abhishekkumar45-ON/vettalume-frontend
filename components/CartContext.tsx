"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import type { ExamSlug } from "@/app/examCatalog";

// A cart item is one plan for one exam. `priceInr` is the whole-rupee price
// (parsed from the catalog's "₹5,999" label) — coupon math on the backend works
// in paise, so we send priceInr * 100 at validation time.
export type CartItem = {
  id: string; // `${exam}:${plan}`
  exam: ExamSlug;
  examLabel: string;
  name: string;
  tag?: string;
  period: string;
  priceLabel: string;
  priceInr: number;
};

const STORAGE_KEY = "vetta:cart:v1";

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalInr: number;
  hydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const CartContext = createContext<CartContextValue | null>(null);

// Turn a "₹5,999" / "₹499" label into a whole-rupee integer. Non-digits are dropped.
export function priceLabelToInr(label: string): number {
  const digits = (label || "").replace(/[^0-9]/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

export function formatInr(amount: number): string {
  return `₹${Math.round(amount).toLocaleString("en-IN")}`;
}

function sanitize(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((item): item is CartItem => {
    if (!item || typeof item !== "object") return false;
    const it = item as Partial<CartItem>;
    return typeof it.id === "string" && typeof it.name === "string" && typeof it.priceInr === "number";
  });
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(sanitize(JSON.parse(raw)));
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // ignore write failures
    }
  }, [items, hydrated]);

  const value = useMemo<CartContextValue>(() => {
    const subtotalInr = items.reduce((sum, item) => sum + item.priceInr, 0);
    return {
      items,
      count: items.length,
      subtotalInr,
      hydrated,
      addItem: (item: CartItem) =>
        setItems((prev) => (prev.some((p) => p.id === item.id) ? prev : [...prev, item])),
      removeItem: (id: string) => setItems((prev) => prev.filter((p) => p.id !== id)),
      clear: () => setItems([]),
      has: (id: string) => items.some((p) => p.id === id)
    };
  }, [items, hydrated]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
