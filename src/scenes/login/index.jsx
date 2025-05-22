import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, clearError } from "../../redux/authSlice";
import {
  Card,
  CardContent,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import ParkIcon from '@mui/icons-material/Park';
import { Mail, Lock, Eye, EyeOff, Loader } from "lucide-react";

const Login = () => {
  // State untuk form
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  // Validasi email sederhana
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Handle login
  const handleSignIn = async () => {
    dispatch(clearError());
    setEmailError("");
    setPasswordError("");

    let valid = true;

    if (!email) {
      setEmailError("Email wajib diisi.");
      valid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Format email tidak valid.");
      valid = false;
    }

    if (!password) {
      setPasswordError("Password wajib diisi.");
      valid = false;
    } else if (password.length < 6) {
      setPasswordError("Password minimal 6 karakter.");
      valid = false;
    }

    if (!valid) return;

    try {
      // Dispatch login action and await its result
      const resultAction = await dispatch(login({ email, password }));

      // Check if the login was successful
      if (login.fulfilled.match(resultAction)) {
        console.log("Login successful, redirecting to dashboard");
        navigate("/", { replace: true }); // Ensure redirect to home
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  // Redirect ke register
  const redirectToRegister = () => {
    navigate("/register");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSignIn();
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(180deg, #42a5f5 0%, #4cceac 100%)",
      }}
    >
      <Card
        sx={{
          width: "100%",
          maxWidth: 400,
          borderRadius: 2,
          boxShadow: 6,
        }}
      >
        <CardContent sx={{ padding: 4 }}>
          {/* Logo */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <ParkIcon height={32} width={32}/>
              {/* <svg
                width="40"
                height="40"
                viewBox="0 0 40 40"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="18"
                  stroke="#70d8bd"
                  strokeWidth="4"
                  fill="none"
                />
                <circle cx="20" cy="20" r="8" fill="#33BBFF" />
                <path
                  d="M32 14L26 20"
                  stroke="#70d8bd"
                  strokeWidth="4"
                  strokeLinecap="round"
                />
              </svg> */}
              <Typography
                variant="h4"
                component="span"
                sx={{ ml: 1, fontWeight: "bold", color: "#70d8bd" }}
              >
                Tumbuhin
              </Typography>
            </Box>
          </Box>

          {/* Welcome Text */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{ fontWeight: "bold", mb: 1 }}
            >
              Welcome Back
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Login to your account
            </Typography>
          </Box>

          {/* Login Form */}
          <Stack spacing={2}>
            {/* Email Input */}
            <TextField
              fullWidth
              placeholder="Email"
              variant="outlined"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={!!emailError}
              helperText={emailError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            />

            {/* Password Input */}
            <TextField
              fullWidth
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              variant="outlined"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            />

            {/* Error Message */}
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {/* Sign In Button */}
            <Button
              variant="contained"
              fullWidth
              type="submit"
              onClick={handleSignIn}
              disabled={loading}
              sx={{
                padding: "10px",
                textTransform: "none",
                fontSize: "1rem",
                backgroundColor: "#70d8bd",
                "&:hover": {
                  backgroundColor: "#4cceac",
                },
              }}
            >
              {loading ? (
                <>
                  <Loader
                    className="animate-spin"
                    size={20}
                    style={{ marginRight: 8 }}
                  />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </Stack>

          {/* Forgot Password */}
          <Box sx={{ textAlign: "center", mt: 3 }}>
            <Typography
              variant="body2"
              sx={{
                color: "#70d8bd",
                cursor: "pointer",
                "&:hover": {
                  color: "#4cceac",
                },
              }}
            >
              Forgot your password?
            </Typography>
          </Box>

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* Register */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account yet?{" "}
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: "#70d8bd",
                  fontWeight: "medium",
                  cursor: "pointer",
                  "&:hover": {
                    color: "#4cceac",
                  },
                }}
                onClick={redirectToRegister}
              >
                Sign Up
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default Login;
