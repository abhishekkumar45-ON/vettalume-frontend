import AccountSettingsShell, { SettingsSectionHeader } from "@/components/AccountSettingsShell";

export default function SubscriptionPage() {
  return (
    <AccountSettingsShell active="subscription">
      <SettingsSectionHeader title="Subscription" text="Your plan, payment method and billing history." />

      <section className="subscriptionCard">
        <div>
          <h3>Lumen <span>◆ Pro plan</span></h3>
          <p>Full access to CAT learning, sectional mocks and full-length mocks.</p>
          <p>Renews on 14 March 2027.</p>
          <strong>₹4,999<small> / year</small></strong>
        </div>
        <div className="subscriptionActions">
          <button className="button primary" type="button">Upgrade Plan</button>
          <button className="button ghost" type="button">Cancel Plan</button>
        </div>
      </section>

      <div className="settingsDivider" />
      <p className="settingsKicker">Payment Method</p>
      <section className="paymentCard">
        <span className="paymentIcon" />
        <div>
          <b>Card ending 4242</b>
          <p>Expires 08/32</p>
        </div>
      </section>

      <div className="settingsDivider" />
      <p className="settingsKicker">Billing History</p>
      <table className="billingTable">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Invoice</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>14 Mar 2026</td>
            <td>Lumen Plan, 12 months</td>
            <td>₹4,999</td>
            <td><a href="/">Download</a></td>
          </tr>
        </tbody>
      </table>
    </AccountSettingsShell>
  );
}
