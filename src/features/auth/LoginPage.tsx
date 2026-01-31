import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../assets/css/login-page.css";
import logo from "../../assets/image.png";

import { loginApi } from "../../api/auth.api";
import { toast } from "react-toastify";

/* ================= COMPONENT ================= */

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= SUBMIT ================= */

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      toast.error("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = await loginApi({
        email,
        password,
      });

      localStorage.setItem("authToken", res.token);
      localStorage.setItem("userEmail", email);

      toast.success("Login successful");

      navigate("/orders");
    } catch (error) {
      console.error("Login failed", error);
      toast.error("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="login-bg">
      <div className="login-box">
        <div className="login-header">
          <img src={logo} alt="Vasara Logo" />
        </div>

        <form onSubmit={handleSubmit}>
          <label>User Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <span className="forgot">
            Forgot password?
          </span>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
