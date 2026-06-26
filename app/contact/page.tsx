import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function ContactPage() {
  return (
    <>
      <SiteHeader />
      <main className="contactPage">
        <section className="contactHero">
          <div className="contactCopy">
            <h1>Contact us</h1>
            <p>
              Fill out the form below and our team will contact you shortly.
              <br />
              For any queries reach out to us on <a href="mailto:help@bluenelumbo.com">help@bluenelumbo.com</a>
            </p>
          </div>
          <form className="contactForm">
            <div className="fieldGrid">
              <label>
                First name
                <input type="text" placeholder="Alice" />
              </label>
              <label>
                Last name
                <input type="text" placeholder="Cooper" />
              </label>
            </div>
            <label>
              Phone no.
              <input type="tel" placeholder="+91 99999XXXXX" />
            </label>
            <label>
              Email address
              <input type="email" placeholder="user45@domain.com" />
            </label>
            <label>
              Message
              <textarea placeholder="Write your message here" />
            </label>
            <button className="button primary" type="button">Send message</button>
            <p>By contacting us you are agreeing with Blue Nelumbo&apos;s Privacy Policy and Terms of Service.</p>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
