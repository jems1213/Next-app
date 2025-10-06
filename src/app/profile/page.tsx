"use client";
import React, { useState } from "react";
import { useAuth } from "../../context/auth";
import styles from "./profile.module.css";

const MENU = [
  "Profile",
  "My Orders",
  "Wishlist",
  "Addresses",
  "Payment Methods",
  "Account Settings",
];

export default function ProfilePage() {
  const { signOut } = useAuth();
  const [active, setActive] = useState<string>("Profile");

  return (
    <section className={styles.profileSection}>
      <div className={styles.profileContainer}>
        <aside className={styles.sidebar} aria-label="Profile navigation">
          <div className={styles.userHeader}>
            <div className={styles.userAvatar} aria-hidden>
              <span>J</span>
            </div>
            <div className={styles.userMeta}>
              <div className={styles.userName}>javiyajems</div>
              <div className={styles.userEmail}>javiyajems@gmail.com</div>
            </div>
          </div>

          <nav className={styles.menu} role="tablist" aria-orientation="vertical">
            {MENU.map((label) => (
              <button
                key={label}
                type="button"
                role="tab"
                aria-selected={active === label}
                className={`${styles.menuItem} ${active === label ? styles.menuItemActive : ""}`}
                onClick={() => setActive(label)}
              >
                <span className={styles.menuBullet} />
                <span className={styles.menuLabel}>{label}</span>
              </button>
            ))}

            <button
              type="button"
              className={`${styles.menuItem} ${styles.signOut}`}
              onClick={signOut}
            >
              <span className={styles.menuBullet} />
              <span className={styles.menuLabel}>Sign Out</span>
            </button>
          </nav>

          <div className={styles.sidebarFooter}>
            <span className={styles.memberSinceLabel}>Member since</span>
            <span className={styles.memberSinceDate}>7/1/2025</span>
          </div>
        </aside>

        <div className={styles.content}>
          <h1 className={styles.pageTitle}>{active}</h1>

          <div className={styles.card}>
            {active === "Profile" && (
              <>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Username</div>
                  <div className={styles.infoValue}>javiyajems</div>
                </div>
                <div className={styles.infoRow}>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>javiyajems@gmail.com</div>
                </div>
              </>
            )}

            {active === "My Orders" && (
              <div>
                {/* Reuse OrdersClient to show stored orders */}
                <OrdersClient />
              </div>
            )}

            {active === "Wishlist" && (
              <div>
                <p className="text-muted">Your wishlist items will be shown here.</p>
              </div>
            )}

            {active === "Addresses" && (
              <div>
                <p className="text-muted">Manage your shipping and billing addresses.</p>
              </div>
            )}

            {active === "Payment Methods" && (
              <div>
                <p className="text-muted">Add, remove and manage saved payment cards.</p>
              </div>
            )}

            {active === "Account Settings" && (
              <div>
                <p className="text-muted">Update password, preferences and connected accounts.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
