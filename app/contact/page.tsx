"use client";

import { useState } from "react";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { contactApi } from "@/lib/api";

export default function ContactPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);

  const send = async () => {
    setError(null);
    if (!message.trim()) {
      setError("Please write a message.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError("Please leave an email or phone so we can reach you.");
      return;
    }
    setStatus("sending");
    try {
      await contactApi.send({ firstName, lastName, phone, email, message });
      setStatus("sent");
      setFirstName("");
      setLastName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus("idle");
      setError(err instanceof Error ? err.message : "Could not send your message. Please try again.");
    }
  };

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
              For any queries reach out to us on <a href="mailto:help@vettalume.com">help@vettalume.com</a>
            </p>
          </div>
          <form className="contactForm" onSubmit={(e) => e.preventDefault()}>
            <div className="fieldGrid">
              <label>
                First name
                <input
                  type="text"
                  placeholder="Abhishek"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </label>
              <label>
                Last name
                <input
                  type="text"
                  placeholder="Kumar"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </label>
            </div>
            <label>
              Phone no.
              <input
                type="tel"
                placeholder="+91 99999XXXXX"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <label>
              Email address
              <input
                type="email"
                placeholder="user45@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label>
              Message
              <textarea
                placeholder="Write your message here"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </label>
            {error ? <p className="authFeedback error" role="alert">{error}</p> : null}
            {status === "sent" ? (
              <p className="authFeedback notice">Thanks — your message has been sent. We&apos;ll get back to you shortly.</p>
            ) : null}
            <button
              className="button primary"
              type="button"
              onClick={send}
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            <p>By contacting us you are agreeing with Vettalume&apos;s Privacy Policy and Terms of Service.</p>
          </form>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
