import AccountSettingsShell, {
  SettingsField,
  SettingsSectionHeader
} from "@/components/AccountSettingsShell";

export default function SecurityPage() {
  return (
    <AccountSettingsShell active="security">
      <SettingsSectionHeader title="Account Security" text="Password, sign-in and connected accounts." />
      <form className="settingsForm">
        <SettingsField label="Current Password" wide>
          <input type="password" defaultValue="password" />
        </SettingsField>
        <SettingsField label="New Password">
          <input placeholder="At least 8 characters" />
        </SettingsField>
        <SettingsField label="Confirm New Password">
          <input placeholder="Re-enter new password" />
        </SettingsField>
        <div className="settingsActions">
          <button className="button primary" type="button">Update Password</button>
        </div>
      </form>

      <div className="settingsDivider" />
      <p className="settingsKicker">Connected Account</p>
      <section className="connectedAccount">
        <strong className="googleMark">G</strong>
        <div>
          <b>Google</b>
          <span>aarav.sharma@gmail.com</span>
        </div>
        <button className="connectedButton" type="button">Connected</button>
      </section>

      <div className="settingsDivider" />
      <p className="settingsKicker">Sessions</p>
      <section className="sessionBox">
        <div>
          <b>Sign out everywhere</b>
          <p>End every active session on all browsers and devices except this one.</p>
        </div>
        <button className="dangerButton" type="button">Sign out</button>
      </section>
    </AccountSettingsShell>
  );
}
