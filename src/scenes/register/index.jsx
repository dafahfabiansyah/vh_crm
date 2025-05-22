import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { Mail, Lock, Eye, EyeOff, User, Loader } from "lucide-react";
import ParkIcon from '@mui/icons-material/Park';

const Register = () => {
  // State untuk form
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Navigate untuk redirect
  const navigate = useNavigate();

  // Handle register
  const handleRegister = async () => {
    setError("");
    if (
      !fullName ||
      !businessName ||
      !phoneNumber ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      setError("Please fill all fields.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://localhost:8080/api/v1/auth/register",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            name: fullName,
            business_name: businessName,
            phone_number: phoneNumber,
          }),
        }
      );
      if (!response.ok) {
        const data = await response.json();
        setError(data.message || "Registration failed");
        setIsLoading(false);
        return;
      }
      setIsLoading(false);
      navigate("/login");
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Network error");
      setIsLoading(false);
    }
  };

  // Redirect ke halaman login
  const redirectToLogin = () => {
    navigate("/login");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleRegister();
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
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Register a new account
            </Typography>
          </Box>

          {/* Register Form */}
          <Stack spacing={2}>
            {/* Full Name Input */}
            <TextField
              fullWidth
              placeholder="Full Name"
              variant="outlined"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <User size={20} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            />

            {/* Business Name Input */}
            <TextField
              fullWidth
              placeholder="Business Name"
              variant="outlined"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            />

            {/* Phone Number Input */}
            <TextField
              fullWidth
              placeholder="Phone Number"
              variant="outlined"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              sx={{
                "& .MuiOutlinedInput-root": {
                  backgroundColor: "#f8f9fa",
                },
              }}
            />

            {/* Email Input */}
            <TextField
              fullWidth
              placeholder="Email"
              variant="outlined"
              autoComplete="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
              autoComplete="password"
              variant="outlined"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

            {/* Confirm Password Input */}
            <TextField
              fullWidth
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              autoComplete="confirm-password"
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock size={20} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      edge="end"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
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

            {/* Register Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              onClick={handleRegister}
              disabled={isLoading}
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
              {isLoading ? (
                <>
                  <Loader
                    className="animate-spin"
                    size={20}
                    style={{ marginRight: 8 }}
                  />
                  Registering...
                </>
              ) : (
                "Create Account"
              )}
            </Button>
          </Stack>

          {/* Divider */}
          <Divider sx={{ my: 3 }} />

          {/* Login redirect */}
          <Box sx={{ textAlign: "center" }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
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
                onClick={redirectToLogin}
              >
                <a
                  href="/login"
                  style={{
                    textDecoration: "none",
                    color: "#70d8bd",
                    hover: "#4cceac",
                  }}
                >
                  Sign in
                </a>
              </Typography>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </form>
  );
};

export default Register;
