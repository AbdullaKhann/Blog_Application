import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/EditPost.module.css";

const EditPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    title: "",
    content: "",
    tags: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/user/posts/${id}`
        );

        setForm({
          title: res.data.title,
          content: res.data.content,
          tags: res.data.tags?.join(", ") || "",
        });
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.put(
        `http://localhost:5000/user/posts/${id}`,
        {
          ...form,
          tags: form.tags.split(",").map(t => t.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // navigate(`/posts/${id}`);
      navigate("/blog.com")
    } catch (err) {
      console.error("Failed to update post", err);
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.editorContainer}>
        <div className={styles.header}>
          <h2 className={styles.pageTitle}>Edit Your Story</h2>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Title</label>
            <input
              className={styles.input}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Enter a captivating title..."
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Content</label>
            <textarea
              className={styles.textarea}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              rows={12}
              placeholder="Tell your story..."
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Tags</label>
            <input
              className={`${styles.input} ${styles.tagsInput}`}
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
              placeholder="technology, life, programming (comma separated)"
            />
          </div>

          <div className={styles.actionButtons}>
            <button
              type="button"
              className={styles.cancelBtn}
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.updateBtn}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPost;
