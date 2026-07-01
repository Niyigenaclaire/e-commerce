// src/pages/Register.jsx
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { UserPlus, Eye, EyeOff, BookOpen, AlertCircle, Mail } from "lucide-react";
import { registerUser } from "../services/authService";
import toast from "react-hot-toast";
import styles from "./Login.module.css"; // Reuse login styles

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);

  const navigate = useNavigate();

  const registerMutation = useMutation({
    mutationFn: registerUser,
    onSuccess: () => {
      toast.success("Account created! You can now log in.");
      navigate("/login");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    },
  });

  const validate = () => {
    const e = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 6) e.password = "At least 6 characters";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    registerMutation.mutate({ email, password });
  };

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.logo}>
            <BookOpen size={32} />
          </div>
          <h1 className={styles.title}>Create an account</h1>
          <p className={styles.subtitle}>Sign up to start sharing your stories</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form} noValidate>
          {/* Email */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
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
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
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
                  if (errors.password) setErrors((p) => ({ ...p, password: "" }));
                }}
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                className={styles.eyeBtn}
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="form-error">{errors.password}</span>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`btn btn-primary ${styles.submitBtn}`}
            disabled={registerMutation.isPending}
          >
            {registerMutation.isPending ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Registering…
              </>
            ) : (
              <>
                <UserPlus size={18} />
                Create Account
              </>
            )}
          </button>
        </form>

        <div className={styles.footer}>
          <p>
            Already have an account?{" "}
            <Link to="/login" className={styles.footerLink}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
