import {
  SavedIndicator,
  SettingsField,
  SettingsSectionHeader
} from "@/components/AccountSettingsShell";
import AccountSettingsShell from "@/components/AccountSettingsShell";

export default function AccountPage() {
  return (
    <AccountSettingsShell active="account">
      <section className="profileSummary">
        <div className="avatarInitials">AS</div>
        <div>
          <h2>Aarav Sharma</h2>
          <p>aarav.sharma@gmail.com</p>
          <small>Member since March 2026 · CAT track</small>
        </div>
        <span className="planPill">◆ Pro plan</span>
      </section>

      <SettingsSectionHeader title="Account" text="Your personal details and how we reach you." />
      <form className="settingsForm">
        <SettingsField label="Full name">
          <input defaultValue="Aarav Sharma" />
        </SettingsField>
        <SettingsField label="Email">
          <input defaultValue="aarav.sharma@gmail.com" />
        </SettingsField>
        <SettingsField label="Phone">
          <input defaultValue="+91 98xxx 21xxx" />
        </SettingsField>
        <SettingsField label="City">
          <input defaultValue="New Delhi" />
        </SettingsField>
        <SettingsField label="Target exam" wide>
          <input defaultValue="CAT" />
        </SettingsField>
        <SettingsField label="About" wide>
          <textarea defaultValue="Second attempt at CAT. Targeting 99+ overall, strongest in QA, building VARC speed." />
        </SettingsField>
        <div className="settingsActions">
          <button className="button primary" type="button">Save changes</button>
          <button className="button ghost" type="button">Cancel</button>
          <SavedIndicator />
        </div>
      </form>
    </AccountSettingsShell>
  );
}
