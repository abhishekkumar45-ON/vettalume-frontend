import AccountSettingsShell, { SettingsSectionHeader } from "@/components/AccountSettingsShell";

export default function PrivacyDataPage() {
  return (
    <AccountSettingsShell active="privacy">
      <SettingsSectionHeader title="Privacy & Data" text="Control exports, retention and personalization settings." />
      <div className="privacyStack">
        {[
          ["Download my data", "Export your profile, score history, mock attempts and notes."],
          ["Personalization", "Allow VettaLume to use performance data to improve recommendations."],
          ["Delete account", "Permanently remove account and learning history."]
        ].map(([title, text], index) => (
          <section className="sessionBox" key={title}>
            <div>
              <b>{title}</b>
              <p>{text}</p>
            </div>
            <button className={index === 2 ? "dangerButton" : "button ghost"} type="button">
              {index === 0 ? "Export" : index === 1 ? "Enabled" : "Delete"}
            </button>
          </section>
        ))}
      </div>
    </AccountSettingsShell>
  );
}
