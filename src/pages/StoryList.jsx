// src/pages/StoryList.jsx
// Displays all stories — shows auth-aware banner
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { PlusCircle, BookOpen, Trash2, Edit3, Eye, LogIn } from "lucide-react";
import { getStories } from "../services/storyService";
import { useAuth } from "../context/AuthContext";
import styles from "./StoryList.module.css";

// Skeleton placeholder card
function SkeletonStory() {
  return (
    <div className={styles.skeletonCard}>
      <div className="skeleton" style={{ height: 22, width: "70%" }} />
      <div className="skeleton" style={{ height: 14, width: "90%", marginTop: "0.5rem" }} />
      <div className="skeleton" style={{ height: 14, width: "60%", marginTop: "0.3rem" }} />
      <div className="skeleton" style={{ height: 14, width: "30%", marginTop: "0.8rem" }} />
    </div>
  );
}

export default function StoryList() {
  const { isAuthenticated } = useAuth();

  // useQuery — all server state lives in the TanStack Query cache
  const {
    data: stories,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["stories"],
    queryFn: getStories,
    retry: 1,
  });

  return (
    <div className="page">
      <div className="container">
        {/* ── Auth status banner ────────────────── */}
        <div
          className={`${styles.banner} ${
            isAuthenticated ? styles.bannerAuth : styles.bannerGuest
          }`}
        >
          {isAuthenticated ? (
            <span>✅ Welcome back! You are logged in and can manage stories.</span>
          ) : (
            <>
              <span>👋 You are browsing as a guest.</span>
              <Link to="/login" className={styles.bannerLink}>
                <LogIn size={14} /> Sign in
              </Link>
            </>
          )}
        </div>

        {/* ── Page header ───────────────────────── */}
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>
              <BookOpen size={28} />
              All Stories
            </h1>
            {stories && (
              <p className={styles.count}>
                {stories.length} stor{stories.length !== 1 ? "ies" : "y"} available
              </p>
            )}
          </div>
          <Link to="/stories/add" className={`btn btn-primary ${styles.addBtn}`}>
            <PlusCircle size={18} />
            New Story
          </Link>
        </div>

        {/* ── Loading state ─────────────────────── */}
        {isLoading && (
          <div className={styles.grid}>
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonStory key={i} />
            ))}
          </div>
        )}

        {/* ── Error state ───────────────────────── */}
        {isError && (
          <div className={styles.errorState}>
            <span style={{ fontSize: "3rem" }}>⚠️</span>
            <h3>Failed to load stories</h3>
            <p>{error?.response?.data?.message || error?.message}</p>
            <button className="btn btn-primary" onClick={refetch}>
              Try Again
            </button>
          </div>
        )}

        {/* ── Empty state ───────────────────────── */}
        {!isLoading && !isError && stories?.length === 0 && (
          <div className={styles.emptyState}>
            <span style={{ fontSize: "4rem" }}>📖</span>
            <h3>No stories yet</h3>
            <p>Be the first to share a story!</p>
            <Link to="/stories/add" className="btn btn-primary">
              <PlusCircle size={16} />
              Add the First Story
            </Link>
          </div>
        )}

        {/* ── Story grid ────────────────────────── */}
        {!isLoading && !isError && stories?.length > 0 && (
          <div className={`${styles.grid} fade-in`}>
            {stories.map((story) => (
              <article key={story.id} className={styles.card}>
                <div className={styles.cardBody}>
                  <h2 className={styles.cardTitle}>{story.title}</h2>
                  <p className={styles.cardExcerpt}>
                    {story.content?.slice(0, 130)}
                    {story.content?.length > 130 ? "…" : ""}
                  </p>
                  {story.author && (
                    <p className={styles.cardAuthor}>By {story.author}</p>
                  )}
                </div>

                <div className={styles.cardActions}>
                  <Link
                    to={`/stories/${story.id}`}
                    className="btn btn-secondary"
                    aria-label={`View ${story.title}`}
                  >
                    <Eye size={15} />
                    View
                  </Link>

                  {isAuthenticated && (
                    <>
                      <Link
                        to={`/stories/${story.id}/edit`}
                        className="btn btn-ghost"
                        aria-label={`Edit ${story.title}`}
                      >
                        <Edit3 size={15} />
                        Edit
                      </Link>
                      <Link
                        to={`/stories/${story.id}/delete`}
                        className="btn btn-danger"
                        aria-label={`Delete ${story.title}`}
                      >
                        <Trash2 size={15} />
                        Delete
                      </Link>
                    </>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
