import React from "react";
import { MessageCircle, Star } from "lucide-react";

const BlogCard = ({ blog }) => {
  return (
    <div className="blog-card">
      <div className="blog-content">
        <div className="author">
          <img src={blog.author.avatar} alt={blog.author.name} />
          <span>{blog.author.name}</span>
          {blog.author.isVerified && <span>✔</span>}
        </div>

        <h2 className="blog-title">{blog.title}</h2>
        <p className="blog-subtitle">{blog.subtitle}</p>

        <div className="blog-meta">
          <div>
            <span>
              <Star size={14} /> {blog.publishedAt}
            </span>{" "}
            · <span>{blog.likes} likes</span>{" "}
            · <span><MessageCircle size={14} /> {blog.comments}</span>
          </div>
        </div>
      </div>

      <div className="thumbnail">
        <img src={blog.thumbnail} alt={blog.title} />
      </div>
    </div>
  );
};

export default BlogCard;
