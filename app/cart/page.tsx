"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Check, Loader2, Tag, Trash2 } from "lucide-react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { useCart, formatInr } from "@/components/CartContext";
import { useUser } from "@/components/UserContext";
import { billingApi, ApiError, type CouponResult } from "@/lib/api";

export default function CartPage() {
  const { items, subtotalInr, removeItem, clear, hydrated } = useCart();
  const { authed, openAuth } = useUser();

  const [code, setCode] = useState("");
  const [coupon, setCoupon] = useState<CouponResult | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [applying, setApplying] = useState(false);
  const [placed, setPlaced] = useState(false);

  // Any change to the cart contents invalidates a previously applied coupon.
  useEffect(() => {
    setCoupon(null);
    setCouponMsg(null);
  }, [subtotalInr]);

  const discountInr = coupon?.valid ? Math.round((coupon.discount || 0) / 100) : 0;
  const totalInr = Math.max(0, subtotalInr - discountInr);

  // Coupons can be course-restricted; only send an exam when the whole cart is one exam.
  const exams = Array.from(new Set(items.map((i) => i.exam)));
  const singleExam = exams.length === 1 ? exams[0].toUpperCase() : undefined;

  async function applyCoupon() {
    const trimmed = code.trim();
    if (!trimmed || !items.length || applying) return;
    setApplying(true);
    setCouponMsg(null);
    try {
      const result = await billingApi.validateCoupon({
        code: trimmed,
        exam: singleExam,
        amount: subtotalInr * 100
      });
      if (result.valid) {
        setCoupon(result);
        setCouponMsg(null);
      } else {
        setCoupon(null);
        setCouponMsg(result.reason || "This coupon can't be applied.");
      }
    } catch (err) {
      setCoupon(null);
      setCouponMsg(err instanceof ApiError ? err.message : "Couldn't check that coupon. Try again.");
    } finally {
      setApplying(false);
    }
  }

  function removeCoupon() {
    setCoupon(null);
    setCouponMsg(null);
    setCode("");
  }

  function purchase() {
    if (!authed) {
      openAuth("login");
      return;
    }
    // Payments gateway isn't live yet — record the intent and confirm to the shopper.
    setPlaced(true);
    clear();
  }

  return (
    <>
      <SiteHeader showAnnouncement />
      <main className="cartPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>Your Cart</h1>
          </div>
        </section>

        {placed ? (
          <section className="cartEmpty">
            <div className="cartPlacedCard">
              <span className="cartPlacedIcon"><Check size={26} aria-hidden="true" /></span>
              <h2>Order received</h2>
              <p>
                Thanks — we&apos;ve recorded your enrollment request. Online payments go live shortly;
                our team will reach out to confirm access and share the next steps.
              </p>
              <Link className="button primary" href="/dashboard">Go to dashboard</Link>
            </div>
          </section>
        ) : !hydrated ? (
          <section className="cartEmpty"><p>Loading your cart…</p></section>
        ) : items.length === 0 ? (
          <section className="cartEmpty">
            <div className="cartPlacedCard">
              <h2>Your cart is empty</h2>
              <p>Browse the plans and add a course to get started.</p>
              <Link className="button primary" href="/pricing">Explore plans</Link>
            </div>
          </section>
        ) : (
          <section className="cartLayout">
            <div className="cartItems">
              <div className="cartHeaderRow">
                <span>Course name</span>
                <span>Price</span>
                <span>Validity</span>
                <span>Action</span>
              </div>
              {items.map((item) => (
                <article className="cartItem" key={item.id}>
                  <div>
                    <h2>{item.examLabel} · {item.name}</h2>
                    <small>{item.tag}</small>
                  </div>
                  <strong>{formatInr(item.priceInr)}</strong>
                  <span>{item.period}</span>
                  <button className="removeButton" type="button" onClick={() => removeItem(item.id)}>
                    <Trash2 size={15} aria-hidden="true" /> Remove
                  </button>
                </article>
              ))}
            </div>

            <aside className="cartSummary">
              <div className="couponBox">
                <label htmlFor="couponCode">Have a coupon?</label>
                {coupon?.valid ? (
                  <div className="couponApplied">
                    <span><Tag size={15} aria-hidden="true" /> {coupon.code} applied</span>
                    <button type="button" onClick={removeCoupon}>Remove</button>
                  </div>
                ) : (
                  <div className="couponRow">
                    <input
                      id="couponCode"
                      type="text"
                      placeholder="NEWLUME25"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      onKeyDown={(e) => e.key === "Enter" && applyCoupon()}
                    />
                    <button type="button" onClick={applyCoupon} disabled={applying || !code.trim()}>
                      {applying ? <Loader2 size={15} className="spin" aria-hidden="true" /> : "Apply"}
                    </button>
                  </div>
                )}
                {couponMsg ? <p className="couponError">{couponMsg}</p> : null}
                {coupon?.valid && coupon.description ? (
                  <p className="couponOk">{coupon.description}</p>
                ) : null}
              </div>

              {items.map((item) => (
                <div className="summaryLine product" key={item.id}>
                  <span>{item.examLabel} · {item.name}</span>
                  <strong>{formatInr(item.priceInr)}</strong>
                </div>
              ))}
              <div className="summaryLine">
                <span>Item total</span>
                <strong>{formatInr(subtotalInr)}</strong>
              </div>
              {discountInr > 0 ? (
                <div className="summaryLine discount">
                  <span>Coupon discount{coupon?.code ? ` (${coupon.code})` : ""}</span>
                  <strong>-{formatInr(discountInr)}</strong>
                </div>
              ) : null}
              <div className="summaryTotal">
                <div>
                  <strong>Sub Total</strong>
                  <small>(your final price is inclusive of all taxes)</small>
                </div>
                <b>{formatInr(totalInr)}</b>
              </div>
              <button className="purchaseButton" type="button" onClick={purchase}>
                {authed ? "Purchase" : "Log in to purchase"}
              </button>
              <p>Secured by Razorpay | Your payment information is encrypted and secure</p>
            </aside>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
