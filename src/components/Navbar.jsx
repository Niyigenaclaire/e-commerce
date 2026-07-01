// src/components/Navbar.jsx
// Global navigation bar — reads auth state from AuthContext
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, PlusCircle, LogIn, LogOut, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // logout() removes token from localStorage and clears context state.
    // Every component using useAuth() automatically re-renders.
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className={styles.nav}>
      <div className={`container ${styles.inner}`}>
        {/* ── Brand ──────────────────────────── */}
        <Link to="/" className={styles.brand}>
          <BookOpen size={22} />
          <span>StoryHub</span>
        </Link>

        {/* ── Nav links ─────────────────────── */}
        <ul className={styles.links}>
          <li>
            <Link
              to="/"
              className={`${styles.link} ${isActive("/") ? styles.active : ""}`}
            >
              Stories
            </Link>
          </li>

          {/* Add Story — visible to everyone, but the page guards access */}
          <li>
            <Link
              to="/stories/add"
              className={`${styles.link} ${isActive("/stories/add") ? styles.active : ""}`}
            >
              <PlusCircle size={15} />
              Add Story
            </Link>
          </li>
        </ul>

        {/* ── Auth area ─────────────────────── */}
        <div className={styles.authArea}>
          {isAuthenticated ? (
            <>
              {/* Welcome message */}
              <div className={styles.userBadge}>
                <User size={16} />
                <span>Logged in</span>
              </div>

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className={`${styles.authBtn} ${styles.logoutBtn}`}
                aria-label="Logout"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Guest indicator */}
              <span className={styles.guestLabel}>Guest User</span>

              {/* Login link */}
              <Link
                to="/login"
                className={`${styles.authBtn} ${styles.loginBtn}`}
              >
                <LogIn size={16} />
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
