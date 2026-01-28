import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import styles from "../styles/Editor.module.css";

import {
  Bold,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Heading,
  Quote,
  Code,
  Image as ImageIcon,
  Send
} from "lucide-react";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");
  const [content, setContent] = useState("");
  const textareaRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  // ✅ robust markdown insert helper
  const insertAtCursor = (before, after = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.slice(start, end) || "text";

    const newText =
      content.slice(0, start) +
      before +
      selectedText +
      after +
      content.slice(end);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length;
      textarea.selectionEnd = start + before.length + selectedText.length;
    }, 0);
  };

  // ✅ insert block markdown at new line
  const insertBlock = (block) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const prefix = content.slice(0, start);
    const needsNewLine = prefix && !prefix.endsWith("\n");

    const newText =
      content.slice(0, start) +
      (needsNewLine ? "\n" : "") +
      block +
      content.slice(start);

    setContent(newText);

    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd =
        start + block.length + (needsNewLine ? 1 : 0);
    }, 0);
  };

  const publishPost = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/user/posts",
        {
          title,
          content,
          tags: tags.split(",").map((t) => t.trim()),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      if (response.status == 200 || response.status == 201) {
        navigate("/blog.com");
      }
    } catch (err) {
      console.error(err.response?.data?.message);
    }
  };

  return (
    <div className={styles.page}>
      {/* <Navbar /> */}

      <div className={styles.mainContent}>
        <div className={styles.editorContainer}>
          {/* Header */}
          <div className={styles.header}>
            <h2 className={styles.pageTitle}>Create New Story</h2>
            <div className={styles.modeSwitch}>
              <div className={`${styles.modeBtn} ${styles.activeMode}`}>Editor</div>
              <div className={styles.modeBtn}>Preview</div>
            </div>
          </div>

          {/* Title Input */}
          <input
            type="text"
            placeholder="Title..."
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          {/* Tags Input */}
          <input
            type="text"
            placeholder="Add tags (e.g. #programming, #life)..."
            className={styles.tagsInput}
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />

          {/* Toolbar */}
          <div className={styles.toolbar}>
            <button className={styles.toolBtn} onClick={() => insertAtCursor("**", "**")} title="Bold">
              <Bold size={18} />
            </button>
            <button className={styles.toolBtn} onClick={() => insertAtCursor("*", "*")} title="Italic">
              <Italic size={18} />
            </button>
            <button className={styles.toolBtn} onClick={() => insertAtCursor("[", "](url)")} title="Link">
              <LinkIcon size={18} />
            </button>
            <button className={styles.toolBtn} onClick={() => insertBlock("- list item")} title="Bullet list">
              <List size={18} />
            </button>
            <button className={styles.toolBtn} onClick={() => insertBlock("1. list item")} title="Numbered list">
              <ListOrdered size={18} />
            </button>
            <button className={styles.toolBtn} onClick={() => insertBlock("## Heading")} title="Heading">
              <Heading size={18} />
            </button>
            <button className={styles.toolBtn} onClick={() => insertBlock("> Quote")} title="Quote">
              <Quote size={18} />
            </button>
            <button className={styles.toolBtn} onClick={() => insertAtCursor("`", "`")} title="Inline code">
              <Code size={18} />
            </button>
            <button className={styles.toolBtn} onClick={() => insertAtCursor("![alt text](", ")")} title="Image">
              <ImageIcon size={18} />
            </button>
          </div>

          {/* Main Editor */}
          <textarea
            ref={textareaRef}
            className={styles.editorArea}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tell your story..."
          />

          {/* Footer */}
          <div className={styles.footer}>
            <button className={styles.publishBtn} onClick={publishPost}>
              <Send size={18} />
              Publish Story
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
