// src/pages/AddStory.jsx
// Create a new story — redirects to login if not authenticated
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PlusCircle, ArrowLeft, LogIn } from "lucide-react";
import { createStory } from "../services/storyService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./StoryForm.module.css";

export default function AddStory() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // UI state — form fields (not server state)
  const [form, setForm] = useState({ title: "", content: "", author: "" });
  const [errors, setErrors] = useState({});

  // If not logged in, show a friendly gate instead of the form
  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.authGate}>
            <span style={{ fontSize: "4rem" }}>🔒</span>
            <h2>Authentication Required</h2>
            <p>You must be signed in to add a new story.</p>
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

  // TanStack Query mutation for creating a story
  const addMutation = useMutation({
    mutationFn: createStory,
    onSuccess: () => {
      // Invalidate the stories list so it re-fetches and shows the new story
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      toast.success("Story created successfully! 📖");
      navigate("/");
    },
    onError: (err) => {
      const msg = err.response?.data?.message || "Failed to create story";
      toast.error(msg);
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
    addMutation.mutate(form);
  };

  return (
    <div className="page">
      <div className="container">
        <Link to="/" className={styles.back}>
          <ArrowLeft size={16} /> Back to Stories
        </Link>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h1 className={styles.title}>
              <PlusCircle size={24} />
              Add New Story
            </h1>
            <p className={styles.subtitle}>Share your story with the community</p>
          </div>

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="title">
                Title <span className={styles.required}>*</span>
              </label>
              <input
                id="title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? styles.inputError : ""}`}
                placeholder="Enter a compelling title…"
                value={form.title}
                onChange={handleChange}
                aria-invalid={!!errors.title}
              />
              {errors.title && <span className="form-error">{errors.title}</span>}
            </div>

            {/* Author (optional) */}
            <div className="form-group">
              <label className="form-label" htmlFor="author">
                Author <span className={styles.optional}>(optional)</span>
              </label>
              <input
                id="author"
                name="author"
                type="text"
                className="form-input"
                placeholder="Your name…"
                value={form.author}
                onChange={handleChange}
              />
            </div>

            {/* Content */}
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
                placeholder="Tell your story…"
                value={form.content}
                onChange={handleChange}
                aria-invalid={!!errors.content}
              />
              <div className={styles.charCount}>
                {form.content.length} characters
              </div>
              {errors.content && (
                <span className="form-error">{errors.content}</span>
              )}
            </div>

            {/* Buttons */}
            <div className={styles.formActions}>
              <button
                type="submit"
                id="add-story-btn"
                className="btn btn-primary"
                disabled={addMutation.isPending}
              >
                {addMutation.isPending ? (
                  <>
                    <span className="spinner" />
                    Saving…
                  </>
                ) : (
                  <>
                    <PlusCircle size={17} />
                    Add Story
                  </>
                )}
              </button>
              <Link to="/" className="btn btn-ghost">
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
