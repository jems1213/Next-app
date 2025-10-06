"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../../context/auth";
import styles from "./profile.module.css";

const MENU = [
  { label: "Profile", href: "/profile" },
  { label: "My Orders", href: "/orders" },
  { label: "Wishlist", href: "/wishlist" },
  { label: "Addresses", href: "/addresses" },
  { label: "Payment Methods", href: "/payment-methods" },
  { label: "Account Settings", href: "/account-settings" },
];

export default function ProfilePage() {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const isActive = (href: string) => {
    if (href === "/profile") return pathname === "/profile";
    return pathname?.startsWith(href);
  };

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

          <nav className={styles.menu}>
            {MENU.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                prefetch={false}
                className={`${styles.menuItem} ${isActive(item.href) ? styles.menuItemActive : ""}`}
                aria-current={isActive(item.href) ? "page" : undefined}
              >
                <span className={styles.menuBullet} />
                <span className={styles.menuLabel}>{item.label}</span>
              </Link>
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
          <h1 className={styles.pageTitle}>Profile</h1>
          <div className={styles.card}>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Username</div>
              <div className={styles.infoValue}>javiyajems</div>
            </div>
            <div className={styles.infoRow}>
              <div className={styles.infoLabel}>Email</div>
              <div className={styles.infoValue}>javiyajems@gmail.com</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
