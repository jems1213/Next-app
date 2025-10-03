import React from "react";
import styles from "../app/layout.module.css";

export default function AnnouncementBar() {
  return (
    <div className={styles.announcementBar} role="note" aria-label="Promotional announcement">
      <p className={styles.announcementText}>✨ Free shipping on all orders over $50 | Use code: SNEAKER10</p>
    </div>
  );
}
