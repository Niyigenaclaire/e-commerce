// src/pages/EditStory.jsx
// Edit an existing story — protected, redirects guests to login
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit3, ArrowLeft, LogIn } from "lucide-react";
import { getStoryById, updateStory } from "../services/storyService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./StoryForm.module.css";

export default function EditStory() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // UI state — local form values
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [errors, setErrors] = useState({});

  // Auth gate for guests
  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.authGate}>
            <span style={{ fontSize: "4rem" }}>🔒</span>
            <h2>Authentication Required</h2>
            <p>You must be signed in to edit a story.</p>
            <div className={styles.gateActions}>
              <Link to="/login" className="btn btn-primary">
                <LogIn size={16} /> Sign In
              </Link>
              <Link to="/" className="btn btn-ghost">
                <ArrowLeft size={16} /> Browse Stories
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Fetch story to pre-fill form (server state in TanStack cache)
  const { data: story, isLoading } = useQuery({
    queryKey: ["story", id],
    queryFn: () => getStoryById(id),
    enabled: !!id,
  });

  // Pre-fill form when data arrives
  useEffect(() => {
    if (story) {
      setForm({
        title: story.title || "",
        content: story.content || "",
        author: story.author || "",
      });
    }
  }, [story]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: updateStory,
    onSuccess: () => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.invalidateQueries({ queryKey: ["story", id] });
      toast.success("Story updated successfully! ✏️");
      navigate(`/stories/${id}`);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update story");
    },
  });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.content.trim()) e.content = "Content is required";
    if (form.content.trim().length < 20)
      e.content = "Content must be at least 20 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    updateMutation.mutate({ id, ...form });
  };

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.card}>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", padding: "2rem" }}>
              <div className="skeleton" style={{ height: 28, width: "50%" }} />
              <div className="skeleton" style={{ height: 44 }} />
              <div className="skeleton" style={{ height: 44 }} />
              <div className="skeleton" style={{ height: 160 }} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Link to={`/stories/${id}`} className={styles.back}>
          <ArrowLeft size={16} /> Back to Story
        </Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>
              <Edit3 size={24} />
              Edit Story
            </h1>
            <p className={styles.subtitle}>Update your story details below</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Title <span className={styles.required}>*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? styles.inputError : ""}`}
                placeholder="Story title…"
                value={form.title}
                onChange={handleChange}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="author">
                Author <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="author"
                name="author"
                type="text"
                className="form-input"
                placeholder="Author name…"
                value={form.author}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="content">
                Content <span className={styles.required}>*</span>
              </label>
              <textarea
                id="content"
                name="content"
                rows={8}
                className={`form-input ${styles.textarea} ${
                  errors.content ? styles.inputError : ""
                }`}
                placeholder="Story content…"
                value={form.content}
                onChange={handleChange}
              />
              <div className={styles.charCount}>{form.content.length} characters</div>
              {errors.content && (
                <span className="form-error">{errors.content}</span>
              )}
            </div>

            <div className={styles.formActions}>
              <button
                type="submit"
                id="edit-story-btn"
                className="btn btn-primary"
                disabled={updateMutation.isPending}
              >
                {updateMutation.isPending ? (
                  <>
                    <span className="spinner" />
                    Saving…
                  </>
                ) : (
                  <>
                    <Edit3 size={17} />
                    Save Changes
                  </>
                )}
              </button>
              <Link to={`/stories/${id}`} className="btn btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
