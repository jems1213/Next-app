import styles from "./settings.module.css";

export default function AccountSettingsPage() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Account Settings</h1>
        <p className={styles.subtitle}>Update your profile details, password, and preferences.</p>
      </div>
    </section>
  );
}
