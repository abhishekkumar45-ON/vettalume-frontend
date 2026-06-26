import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function CartPage() {
  return (
    <>
      <SiteHeader showAnnouncement />
      <main className="cartPage">
        <section className="pageHero darkHero">
          <div className="pageHeroInner">
            <h1>Your Cart</h1>
          </div>
        </section>
        <section className="cartLayout">
          <div className="cartItems">
            <div className="cartHeaderRow">
              <span>Course name</span>
              <span>Price</span>
              <span>Valid till</span>
              <span>Action</span>
            </div>
            <article className="cartItem">
              <div>
                <h2>CAT Prep - Lumen</h2>
                <small>Includes:</small>
              </div>
              <strong>₹5,999</strong>
              <span>29th august 2026</span>
              <button className="removeButton" type="button">Remove</button>
            </article>
          </div>

          <aside className="cartSummary">
            <label>
              Enter coupon code
              <input type="text" placeholder="MOONSHOT30" />
            </label>
            <div className="summaryLine product">
              <span>CAT Prep - Lumen</span>
              <strong>₹5,999</strong>
            </div>
            <div className="summaryLine">
              <span>Item total</span>
              <strong>₹5,999</strong>
            </div>
            <div className="summaryLine discount">
              <span>Coupon discount (30%)</span>
              <strong>-₹1,799.7</strong>
            </div>
            <div className="summaryTotal">
              <div>
                <strong>Sub Total</strong>
                <small>(your final price is inclusive of all taxes)</small>
              </div>
              <b>₹4,199.3</b>
            </div>
            <button className="purchaseButton" type="button">Purchase</button>
            <p>Secured by Razorpay | Your payment information is encrypted and secure</p>
          </aside>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
