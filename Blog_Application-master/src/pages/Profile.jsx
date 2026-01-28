import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../styles/Profile.module.css";

export default function Profile() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:5000/user/posts/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.status === 200) {
          setPosts(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [token]);

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>
          <p>No user logged in</p>
          <Link to="/login" className={styles.createButton}>
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .join("")
        .toUpperCase()
    : "?";

  // Calculate stats
  const totalViews = posts.reduce((sum, post) => sum + (post.views || 0), 0);
  const totalLikes = posts.reduce((sum, post) => sum + (post.likes || 0), 0);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* PROFILE CARD */}
        <div className={styles.profileCard}>
          <div className={styles.avatarContainer}>
            {user.picture ? (
              <img
                src={user.picture}
                alt="Profile"
                className={styles.avatarImage}
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <h2 className={styles.userName}>{user.name}</h2>
          <p className={styles.userEmail}>{user.email}</p>

          {/* STATS */}
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{posts.length}</div>
              <div className={styles.statLabel}>Posts</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalViews}</div>
              <div className={styles.statLabel}>Views</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{totalLikes}</div>
              <div className={styles.statLabel}>Likes</div>
            </div>
          </div>
        </div>

        {/* POSTS SECTION */}
        <h3 className={styles.sectionTitle}>Your Posts</h3>

        {loading ? (
          <div className={styles.emptyState}>
            <p>Loading your posts...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>You haven't written any posts yet.</p>
            <Link to="/editor" className={styles.createButton}>
              Create your first post
            </Link>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {posts.map((post) => (
              <Link
                key={post._id}
                to={`/posts/${post._id}`}
                className={styles.postCard}
              >
                <h3>{post.title}</h3>
                <p className={styles.postExcerpt}>
                  {post.content.slice(0, 150)}
                  {post.content.length > 150 && "..."}
                </p>
                <div className={styles.cardFooter}>
                  <span className={styles.date}>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className={styles.readMore}>Read more →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}