// src/pages/DeleteStory.jsx
// Confirm + delete a story — protected
import { useParams, useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Trash2, ArrowLeft, AlertTriangle, LogIn } from "lucide-react";
import { getStoryById, deleteStory } from "../services/storyService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./DeleteStory.module.css";

export default function DeleteStory() {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Auth gate
  if (!isAuthenticated) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.authGate}>
            <span style={{ fontSize: "4rem" }}>🔒</span>
            <h2>Authentication Required</h2>
            <p>You must be signed in to delete a story.</p>
            <div className={styles.gateActions}>
              <Link to="/login" className="btn btn-primary">
                <LogIn size={16} /> Sign In
              </Link>
              <Link to="/" className="btn btn-ghost">
                <ArrowLeft size={16} /> Go Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const { data: story, isLoading } = useQuery({
    queryKey: ["story", id],
    queryFn: () => getStoryById(id),
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteStory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stories"] });
      queryClient.removeQueries({ queryKey: ["story", id] });
      toast.success("Story deleted successfully");
      navigate("/");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete story");
    },
  });

  if (isLoading) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.card}>
            <div className="skeleton" style={{ height: 100 }} />
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

        <div className={`${styles.card} fade-in`}>
          <div className={styles.iconWrap}>
            <AlertTriangle size={40} />
          </div>

          <h1 className={styles.title}>Delete Story</h1>

          <p className={styles.warning}>
            Are you sure you want to delete{" "}
            <strong>"{story?.title}"</strong>?
            <br />
            This action <span className={styles.irreversible}>cannot be undone</span>.
          </p>

          <div className={styles.actions}>
            <button
              id="confirm-delete-btn"
              className="btn btn-danger"
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <span className="spinner spinner-dark" style={{ borderTopColor: "var(--error)" }} />
                  Deleting…
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  Yes, Delete
                </>
              )}
            </button>
            <Link to={`/stories/${id}`} className="btn btn-ghost">
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
