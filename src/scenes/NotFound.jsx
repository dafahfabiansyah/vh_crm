"use client"

import { Box, Typography, Button, Paper, alpha } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Home as HomeIcon, Search as SearchIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material"

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          maxWidth: 480,
          width: "100%",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Top decorative bar */}
        <Box
          sx={{
            height: 8,
            width: "100%",
            bgcolor: "#1976d2",
            position: "absolute",
            top: 0,
          }}
        />

        <Box sx={{ p: 6, textAlign: "center" }}>
          {/* 404 Number */}
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: 100, sm: 140 },
              fontWeight: 700,
              color: alpha("#1976d2", 0.15),
              lineHeight: 1.1,
              letterSpacing: "-4px",
              mb: 2,
            }}
          >
            404
          </Typography>

          {/* Title */}
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              color: "#1976d2",
              mb: 2,
            }}
          >
            Page Not Found
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              mb: 4,
              maxWidth: 320,
              mx: "auto",
            }}
          >
            Halaman yang kamu cari tidak ditemukan. Mungkin halaman telah dipindahkan atau dihapus.
          </Typography>

          {/* Illustration */}
          <Box
            sx={{
              mb: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: "50%",
                bgcolor: alpha("#1976d2", 0.1),
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <SearchIcon
                sx={{
                  fontSize: 60,
                  color: "#1976d2",
                }}
              />
            </Box>
            <Box
              sx={{
                position: "absolute",
                width: "100%",
                height: 2,
                bgcolor: alpha("#1976d2", 0.2),
                bottom: 20,
                zIndex: -1,
              }}
            />
          </Box>

          {/* Action Buttons */}
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              variant="contained"
              startIcon={<HomeIcon />}
              onClick={() => navigate("/")}
              sx={{
                bgcolor: "#1976d2",
                "&:hover": { bgcolor: "#303f9f" },
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: "medium",
                textTransform: "none",
                boxShadow: "0 4px 12px rgba(63, 81, 181, 0.2)",
              }}
            >
              Kembali ke Dashboard
            </Button>
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                borderColor: alpha("#1976d2", 0.5),
                color: "#1976d2",
                "&:hover": {
                  borderColor: "#1976d2",
                  bgcolor: alpha("#1976d2", 0.05),
                },
                borderRadius: "8px",
                px: 3,
                py: 1,
                fontWeight: "medium",
                textTransform: "none",
              }}
            >
              Kembali
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  )
}

export default NotFound
