// src/pages/StoryDetails.jsx
// View a single story
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Trash2, BookOpen } from "lucide-react";
import { getStoryById } from "../services/storyService";
import { useAuth } from "../context/AuthContext";
import styles from "./StoryDetails.module.css";

export default function StoryDetails() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const {
    data: story,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["story", id],
    queryFn: () => getStoryById(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.skeletonWrap}>
            <div className="skeleton" style={{ height: 20, width: "20%" }} />
            <div className="skeleton" style={{ height: 36, width: "75%", marginTop: "1.5rem" }} />
            <div className="skeleton" style={{ height: 20, width: "30%", marginTop: "0.75rem" }} />
            <div className="skeleton" style={{ height: 14, marginTop: "2rem" }} />
            <div className="skeleton" style={{ height: 14, marginTop: "0.5rem" }} />
            <div className="skeleton" style={{ height: 14, width: "85%", marginTop: "0.5rem" }} />
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.errorState}>
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <h3>Story not found</h3>
            <p>{error?.response?.data?.message || error?.message}</p>
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button className="btn btn-primary" onClick={refetch}>
                Retry
              </button>
              <button className="btn btn-ghost" onClick={() => navigate("/")}>
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        {/* Back link */}
        <Link to="/" className={styles.back}>
          <ArrowLeft size={16} /> All Stories
        </Link>

        <article className={`${styles.article} fade-in`}>
          {/* Header */}
          <header className={styles.articleHeader}>
            <div className={styles.icon}>
              <BookOpen size={28} />
            </div>
            <h1 className={styles.title}>{story?.title}</h1>
            {story?.author && (
              <p className={styles.author}>By {story.author}</p>
            )}
            {story?.createdAt && (
              <p className={styles.date}>
                {new Date(story.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
          </header>

          {/* Content */}
          <div className={styles.content}>
            {story?.content?.split("\n").map((para, i) =>
              para.trim() ? <p key={i}>{para}</p> : <br key={i} />
            )}
          </div>

          {/* Actions — only for authenticated users */}
          {isAuthenticated && (
            <div className={styles.actions}>
              <Link to={`/stories/${id}/edit`} className="btn btn-ghost">
                <Edit3 size={16} /> Edit Story
              </Link>
              <Link to={`/stories/${id}/delete`} className="btn btn-danger">
                <Trash2 size={16} /> Delete Story
              </Link>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
