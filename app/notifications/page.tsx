import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function NotificationsPage() {
  return (
    <>
      <SiteHeader />
      <main className="notificationsPage">
        <section className="notificationsPanel">
          <h1>Notifications</h1>
          <div className="notificationEmpty">
            <p>No new notifications yet.</p>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
