import styles from "./addresses.module.css";

export default function AddressesPage() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Addresses</h1>
        <p className={styles.subtitle}>Manage your shipping and billing addresses here.</p>
      </div>
    </section>
  );
}
