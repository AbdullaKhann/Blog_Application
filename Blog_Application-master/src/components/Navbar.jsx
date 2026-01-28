import { Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";

export default function Navbar() {
  return (
    <>
      <div className={styles.navWrapper}>
        <div className={styles.gradientBg}></div>
        <nav className={styles.nav}>
          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>✦</span>
              <span className={styles.logoText}>Blogging Application</span>
            </Link>
          </div>

          <div className={styles.right}>
            <button className={styles.button24}>
              <Link className={styles.link} to="/login">
                <span className={styles.buttonIcon}>✎</span>
                Create Post
              </Link>
            </button>

            <Link className={styles.loginLink} to="/login">
              <span className={styles.linkIcon}>→</span>
              Login
            </Link>

            <Link className={styles.signup} to="/register">
              <span className={styles.signupGlow}></span>
              Sign Up
            </Link>
          </div>
        </nav>
      </div>

      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Welcome To Our Blogs</h1>
          <div className={styles.heroUnderline}></div>
        </div>
      </section>
    </>
  );
}
