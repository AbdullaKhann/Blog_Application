import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import styles from "../styles/Navbar.module.css";
import BlogFeed from "./BlogFeed";

const Home = () => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [search, setsearch] = useState(" ")
  const user = JSON.parse(localStorage.getItem("user"));
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const logout = () => {
    //localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleDropdown = (e) => {
    e.stopPropagation();
    setOpen(!open);
  };

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

          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="Search blogs, topics, authors..."
              className={styles.searchInput}
              value={search}
              onChange={(e) => setsearch(e.target.value)}
            />
          </div>

          <div className={styles.right}>
            <button className={styles.button24} role="button">
              <Link className={styles.link} to="/editor">
                <span className={styles.buttonIcon}>✎</span>
                Create Post
              </Link>
            </button>

            {!user ? (
              <>
                <Link className={styles.loginLink} to="/login">
                  <span className={styles.linkIcon}>→</span>
                  Login
                </Link>
                <Link className={styles.signup} to="/register">
                  <span className={styles.signupGlow}></span>
                  Sign Up
                </Link>
              </>
            ) : (
              <div className={styles.profileWrapper} ref={dropdownRef}>
                <img
                  src={user.picture || "/account.png"}
                  alt="profile"
                  className={styles.avatar}
                  onClick={toggleDropdown}
                />

                {open && (
                  <div className={styles.dropdown}>
                    <p className={styles.name}>{user.name}</p>
                    <Link className={styles.dropdownLink} to="/dashboard" onClick={() => setOpen(false)}>
                      <span className={styles.dropdownIcon}></span>
                      Dashboard
                    </Link>
                    <Link className={styles.dropdownLink} to="/editor" onClick={() => setOpen(false)}>
                      <span className={styles.dropdownIcon}></span>
                      Create Post
                    </Link>
                    <button onClick={logout}>
                      <span style={{ marginRight: '8px' }}></span>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </div>
      <BlogFeed search={search} />
    </>
  );
};

export default Home;
