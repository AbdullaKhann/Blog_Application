import { useEffect, useState } from "react";
import axios from "axios";
import styles from "../styles/Dashboard.module.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCreated: 0,
    totalUpdated: 0,
    totalDeleted: 0,
  });
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) setUser(userData);

    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/user/posts/dashboard",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };

    fetchStats();
  }, [token]);

  return (
    <div className={styles.dashboardPage}>

      <div className={styles.dashboardContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>Analytic Overview</h1>
          <p className={styles.subtitle}>Track your content performance and writing journey</p>
        </div>

        <div className={styles.welcomeSection}>
          <div className={styles.welcomeContent}>
            <h2 className={styles.welcomeTitle}>Welcome back, {user?.name || 'Creator'}! 👋</h2>
            <p className={styles.welcomeText}>
              Here is what's happening with your blog posts today.
              You have been quite active recently. Keep up the great work creating amazing content!
            </p>
          </div>
          <div className={styles.welcomeDecoration}></div>
        </div>

        <div className={styles.statsGrid}>
          <StatCard
            title="Total Created"
            value={stats.totalCreated}
            icon="✍️"
            type="created" // passed for potential specific styling hooks if needed
            className={styles.createdCard}
          />
          <StatCard
            title="Total Updated"
            value={stats.totalUpdated}
            icon="🔄"
            type="updated" // Maps to CSS class via logic below
            customClass={styles.updatedCard}
          />
          <StatCard
            title="Total Deleted"
            value={stats.totalDeleted}
            icon="🗑️"
            type="deleted"
            customClass={styles.deletedCard}
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, customClass }) => (
  <div className={`${styles.statCard} ${customClass || ''}`}>
    <div className={styles.decorationCircle + " " + styles.circle1}></div>
    <div className={styles.statIcon}>
      {icon}
    </div>
    <div className={styles.statValue}>
      {/* Animated counter effect could be added here */}
      {value}
    </div>
    <div className={styles.statLabel}>{title}</div>
    <div className={styles.decorationCircle + " " + styles.circle2}></div>
  </div>
);

export default Dashboard;
