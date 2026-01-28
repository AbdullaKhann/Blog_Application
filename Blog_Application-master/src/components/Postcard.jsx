import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/PostCard.module.css";

const Postcard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/user/posts/${id}`
        );
        setPost(res.data);
      } catch (err) {
        console.error("Failed to fetch post", err);
      }
    };

    fetchPost();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this story?")) return;

    try {
      await axios.delete(
        `http://localhost:5000/user/posts/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      navigate("/dashboard");
    } catch (err) {
      alert("Delete failed");
    }
  };

  const handleUpdate = () => {
    navigate(`/posts/${id}/edit`);
  };

  if (!post) return <div className={styles.loading}>Loading story...</div>;

  return (
    <div className={styles.page}>
      <article className={styles.articleContainer}>
        <div className={styles.header}>
          <h1 className={styles.title}>{post.title}</h1>
          <div className={styles.meta}>
            <span className={styles.date}>
              {new Date(post.createdAt).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>

        <div className={styles.content}>
          <p>{post.content}</p>
        </div>

        <div className={styles.actions}>
          <button onClick={() => navigate(-1)} className={styles.backBtn}>
            ← Back
          </button>

          <button onClick={handleUpdate} className={styles.editBtn}>
            Edit Story
          </button>

          <button onClick={handleDelete} className={styles.deleteBtn}>
            Delete
          </button>
        </div>
      </article>
    </div>
  );
};

export default Postcard;
