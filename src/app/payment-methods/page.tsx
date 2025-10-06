import styles from "./paymentMethods.module.css";

export default function PaymentMethodsPage() {
  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <h1 className={styles.title}>Payment Methods</h1>
        <p className={styles.subtitle}>Add, remove, and manage your saved cards.</p>
      </div>
    </section>
  );
}
