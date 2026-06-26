import AccountSettingsShell, {
  SettingsField,
  SettingsSectionHeader
} from "@/components/AccountSettingsShell";

export default function PreferencesPage() {
  return (
    <AccountSettingsShell active="preferences">
      <SettingsSectionHeader title="Exam Preferences" text="Tune the dashboard and recommendations to your target." />
      <form className="settingsForm">
        <SettingsField label="Primary exam">
          <select defaultValue="CAT">
            <option>CAT</option>
            <option>GMAT</option>
            <option>GRE</option>
          </select>
        </SettingsField>
        <SettingsField label="Target date">
          <input defaultValue="August 2026" />
        </SettingsField>
        <SettingsField label="Weekly study hours">
          <input defaultValue="14 hours" />
        </SettingsField>
        <SettingsField label="Weakest section">
          <input defaultValue="DILR" />
        </SettingsField>
        <SettingsField label="Study notes" wide>
          <textarea defaultValue="Prefer evening study blocks and one full-length mock every Sunday." />
        </SettingsField>
        <div className="settingsActions">
          <button className="button primary" type="button">Save preferences</button>
        </div>
      </form>
    </AccountSettingsShell>
  );
}
