import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import "../styles/blog.css";
import { Link } from "react-router-dom";
import axios from "axios";

const BlogFeed = ({ search }) => {
  const [activeTab, setActiveTab] = useState("foryou");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      console.log("NO TOKEN FOUND");
      setLoading(false);
      return;
    }

    // Only fetch posts when "For you" tab is active
    if (activeTab !== "foryou") {
      setLoading(false);
      return;
    }

    const fetchpost = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          "http://localhost:5000/user/posts/me",
          {
            params: { search },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status == 200) {
          setPosts(res.data);
        }
      } catch (err) {
        console.error("FETCH POSTS ERROR:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchpost();
  }, [search, token, activeTab]);

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <header className="header">
          <div className="header-content">
            <h1 className="feed-title">
              <span className="feed-icon">✨</span>
              Discover Stories
            </h1>
            <div className="tabs">
              <div
                className={`tab ${activeTab === "foryou" ? "active" : ""}`}
                onClick={() => setActiveTab("foryou")}
              >
                <span className="tab-icon">🔥</span>
                For you
              </div>
              <div
                className={`tab ${activeTab === "featured" ? "active" : ""}`}
                onClick={() => setActiveTab("featured")}
              >
                <span className="tab-icon">⭐</span>
                Featured
              </div>
            </div>
          </div>
        </header>

        <div className="blog-container">
          {/* For You Tab Content */}
          {activeTab === "foryou" && (
            <>
              <div className="posts-header">
                <h2 className="section-title">Your Posts</h2>
                <div className="posts-count">{posts.length} {posts.length === 1 ? 'post' : 'posts'}</div>
              </div>

              {loading && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>Loading your posts...</p>
                </div>
              )}

              {!loading && posts.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📝</div>
                  <h3>No posts yet</h3>
                  <p>Start creating amazing content to see it here!</p>
                  <Link to="/editor" className="create-first-post">
                    Create your first post
                  </Link>
                </div>
              )}

              {!loading && posts.map((post) => (
                <div key={post._id} className="blog-card">
                  <div className="card-glow"></div>
                  <div className="blog-content">
                    <div className="post-meta">
                      <span className="post-date">
                        <span className="date-icon">📅</span>
                        {new Date(post.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      {post.tags && post.tags.length > 0 && (
                        <div className="post-tags">
                          {post.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="tag">#{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>

                    <h3 className="blog-title">
                      <Link to={`/posts/${post._id}`}>
                        {post.title}
                      </Link>
                    </h3>

                    <p className="blog-excerpt">
                      {post.content.slice(0, 180)}
                      {post.content.length > 180 && '...'}
                    </p>

                    <div className="card-footer">
                      <Link to={`/posts/${post._id}`} className="read-more">
                        Read more
                        <span className="arrow">→</span>
                      </Link>
                      <div className="post-stats">
                        <span className="stat">
                          <span className="stat-icon">👁️</span>
                          {Math.floor(Math.random() * 100) + 10}
                        </span>
                        <span className="stat">
                          <span className="stat-icon">❤️</span>
                          {Math.floor(Math.random() * 50)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {/* Featured Tab Content */}
          {activeTab === "featured" && (
            <div className="empty-state">
              <div className="empty-icon">⭐</div>
              <h3>No featured stories</h3>
              <p>Featured stories from the publications you follow will appear here.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogFeed;