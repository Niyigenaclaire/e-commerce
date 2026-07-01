// src/pages/Login.jsx
// Authentication page — uses useMutation to send credentials to the backend
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, Eye, EyeOff, BookOpen } from "lucide-react";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "./Login.module.css";

export default function Login() {
  // ── UI state (lives in component state, NOT in query cache) ──────────────
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  // Auth context — we only need login() here
  const { login } = useAuth();
  const navigate = useNavigate();

  // ── TanStack Query mutation — server state write ──────────────────────────
  const loginMutation = useMutation({
    // mutationFn tells React Query which function to call when .mutate() fires
    mutationFn: loginUser,

    onSuccess: (data) => {
      // data = { accessToken: "eyJ..." }
      // login() saves token to localStorage AND updates context state.
      // Every component using useAuth() immediately knows the user is logged in.
      login(data.accessToken);
      toast.success("Welcome back! You are now logged in 🎉");
      navigate("/");
    },

    onError: (err) => {
      // Show a user-friendly message — never expose raw server errors
      const message =
        err.response?.data?.message || "Invalid email or password.";
      toast.error(message);
    },
  });

  // ── Client-side validation (UI state only) ────────────────────────────────
  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // prevent full page reload (SPA behaviour)

    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});

    // React Query calls loginUser({ email, password }) automatically
    loginMutation.mutate({ email, password });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        {/* ── Header ─────────────────────────────── */}
        <div className={styles.header}>
          <div className={styles.logo}>
            <BookOpen size={32} />
          </div>
          <h1 className={styles.title}>Welcome back</h1>
          <p className={styles.subtitle}>Sign in to access your stories</p>
        </div>

        {/* ── Form ───────────────────────────────── */}
        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className={`form-input ${errors.email ? styles.inputError : ""}`}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors((p) => ({ ...p, email: "" }));
              }}
              aria-describedby={errors.email ? "email-err" : undefined}
              aria-invalid={!!errors.email}
              autoComplete="email"
            />
            {errors.email && (
              <span id="email-err" className="form-error">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className={styles.passwordWrap}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`form-input ${styles.passwordInput} ${
                  errors.password ? styles.inputError : ""
                }`}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((p) => ({ ...p, password: "" }));
                }}
                aria-describedby={errors.password ? "pwd-err" : undefined}
                aria-invalid={!!errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <span id="pwd-err" className="form-error">
                {errors.password}
              </span>
            )}
          </div>

          {/* Submit */}
          <button
            id="login-submit-btn"
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Signing in…
              </>
            ) : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* ── Footer ─────────────────────────────── */}
        <div className={styles.footer}>
          <p>
            Don't have an account?{" "}
            <Link to="/register" className={styles.footerLink}>
              Sign up here
            </Link>
          </p>
        </div>

        {/* ── Demo credentials hint ────────────────── */}
        <div className={styles.demoBox}>
          <p className={styles.demoTitle}>Demo credentials</p>
          <p>
            <strong>Email:</strong> user@example.com
          </p>
          <p>
            <strong>Password:</strong> password123
          </p>
        </div>
      </div>
    </div>
  );
}
