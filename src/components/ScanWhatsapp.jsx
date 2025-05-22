"use client"

import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"
import { fetchWithAuth } from "../api/fetchWithAuth"
import {
  Box,
  Paper,
  Typography,
  Button,
  Alert,
  AlertTitle,
  Divider,
  Skeleton,
  // useTheme,
  alpha,
  IconButton,
} from "@mui/material"
import { Refresh, AccessTime, ArrowBack, CheckCircle, ErrorOutline, WhatsApp } from "@mui/icons-material"
import Sidebar from "../scenes/global/Sidebar"
import { useNavigate } from "react-router-dom"

const formatExpiryTime = (expiryTimeString) => {
  if (!expiryTimeString) return ""

  const expiryTime = new Date(expiryTimeString)
  const now = new Date()

  // Calculate time difference in minutes
  const diffMs = expiryTime.getTime() - now.getTime()
  const diffMins = Math.round(diffMs / 60000)

  if (diffMins <= 0) return "Expired"
  if (diffMins === 1) return "Expires in 1 minute"
  return `Expires in ${diffMins} minutes`
}

const ScanWhatsapp = () => {
  const [qrData, setQrData] = useState("")
  const [expiresQr, setExpiresQr] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [connected, setConnected] = useState(false)
  // const theme = useTheme()
  const navigate = useNavigate()

  // Tambahkan fungsi untuk cek status koneksi WhatsApp
  const fetchStatus = async () => {
    try {
      const response = await fetchWithAuth("http://localhost:8080/api/v1/tenant/whatsapp/meow/status")
      if (!response.ok) throw new Error("Failed to fetch status")
      const data = await response.json()
      // Asumsikan data.data.connected adalah boolean status koneksi
      setConnected(!!data.data?.connected)
    } catch {
      // Jika error, anggap belum connect
      setConnected(false)
    }
  }

  const fetchQr = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetchWithAuth("http://localhost:8080/api/v1/tenant/whatsapp/meow/qr")
      if (!response.ok) throw new Error("Failed to fetch QR code")
      const data = await response.json()
      console.log(data)
      setQrData(data.data?.qr_code || "")
      setExpiresQr(data.data?.expires_at || "")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQr()
    fetchStatus()
    // Cek status setiap 5 detik
    const checkConnectionInterval = setInterval(() => {
      fetchStatus()
    }, 5000)
    return () => clearInterval(checkConnectionInterval)
  }, [])

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: "60px" }, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: "#3f51b5",
                bgcolor: alpha("#3f51b5", 0.1),
                "&:hover": { bgcolor: alpha("#3f51b5", 0.2) },
              }}
            >
              <ArrowBack />
            </IconButton>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 0.5 }}>
                Connect WhatsApp
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Link your WhatsApp account to receive messages
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Content */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            py: 4,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: "500px",
              p: 4,
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 3,
              }}
            >
              {/* Header */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 64,
                  height: 64,
                  borderRadius: "16px",
                  bgcolor: alpha("#3f51b5", 0.1),
                  color: "#3f51b5",
                  mb: 1,
                }}
              >
                <WhatsApp sx={{ fontSize: 32 }} />
              </Box>

              {/* Description */}
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" fontWeight="bold" color="#3f51b5" gutterBottom>
                  {connected ? "WhatsApp Connected!" : "Scan QR Code"}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {connected
                    ? "Your WhatsApp account has been successfully connected"
                    : "Scan this QR code with your WhatsApp to connect your account"}
                </Typography>
                {expiresQr && !loading && !error && !connected && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mt: 1,
                      color: "warning.main",
                    }}
                  >
                    <AccessTime sx={{ fontSize: 16, mr: 0.5 }} />
                    <Typography variant="body2" fontWeight="medium">
                      {formatExpiryTime(expiresQr)}
                    </Typography>
                  </Box>
                )}
              </Box>

              {/* Connected State */}
              {connected && (
                <Box sx={{ textAlign: "center", my: 2 }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: "50%",
                      bgcolor: alpha("#4caf50", 0.1),
                      color: "#4caf50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mx: "auto",
                      mb: 2,
                    }}
                  >
                    <CheckCircle sx={{ fontSize: 40 }} />
                  </Box>
                  <Typography variant="body1" fontWeight="medium" gutterBottom>
                    WhatsApp API
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {}
                  </Typography>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{
                      mt: 3,
                      bgcolor: "#3f51b5",
                      "&:hover": { bgcolor: "#303f9f" },
                      borderRadius: "8px",
                    }}
                    onClick={() => navigate("/")}
                  >
                    Go to Dashboard
                  </Button>
                </Box>
              )}

              {/* QR Code */}
              {!connected && (
                <>
                  {loading ? (
                    <Box sx={{ width: "100%", textAlign: "center" }}>
                      <Skeleton variant="rectangular" width={250} height={250} sx={{ mx: "auto", borderRadius: 1 }} />
                      <Skeleton variant="text" width={120} sx={{ mx: "auto", mt: 2 }} />
                    </Box>
                  ) : error ? (
                    <Alert
                      severity="error"
                      sx={{ width: "100%" }}
                      action={
                        <Button color="inherit" size="small" onClick={fetchQr} startIcon={<Refresh />}>
                          Retry
                        </Button>
                      }
                    >
                      <AlertTitle>Error</AlertTitle>
                      {error}
                    </Alert>
                  ) : qrData ? (
                    <Paper
                      elevation={1}
                      sx={{
                        p: 3,
                        bgcolor: "white",
                        border: "1px solid",
                        borderColor: "grey.200",
                        borderRadius: "12px",
                      }}
                    >
                      <QRCodeCanvas
                        value={qrData}
                        size={250}
                        level="H"
                        includeMargin={true}
                        bgColor={"#ffffff"}
                        fgColor={"#3f51b5"}
                      />
                    </Paper>
                  ) : (
                    <Alert severity="info" sx={{ width: "100%" }}>
                      <AlertTitle>No QR Code Available</AlertTitle>
                      Unable to generate QR code. Please try again.
                    </Alert>
                    
                  )}

                  {/* Instructions */}
                  {!loading && !error && qrData && (
                    <Box sx={{ width: "100%", mt: 2 }}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        How to connect:
                      </Typography>

                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                        <Box
                          sx={{
                            bgcolor: alpha("#3f51b5", 0.1),
                            color: "#3f51b5",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1.5,
                            mt: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          1
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Open WhatsApp on your phone
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                        <Box
                          sx={{
                            bgcolor: alpha("#3f51b5", 0.1),
                            color: "#3f51b5",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1.5,
                            mt: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          2
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Tap Menu or Settings and select WhatsApp Web
                        </Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "flex-start", mb: 1.5 }}>
                        <Box
                          sx={{
                            bgcolor: alpha("#3f51b5", 0.1),
                            color: "#3f51b5",
                            borderRadius: "50%",
                            width: 24,
                            height: 24,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            mr: 1.5,
                            mt: 0.5,
                            flexShrink: 0,
                          }}
                        >
                          3
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Point your phone to this screen to capture the QR code
                        </Typography>
                      </Box>

                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Refresh />}
                        onClick={fetchQr}
                        sx={{
                          mt: 3,
                          color: "#3f51b5",
                          borderColor: "#3f51b5",
                          "&:hover": { bgcolor: alpha("#3f51b5", 0.05) },
                          borderRadius: "8px",
                        }}
                      >
                        Refresh QR Code
                      </Button>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </Paper>

          {/* Additional Info Card */}
          {!connected && (
            <Paper
              elevation={1}
              sx={{
                width: "100%",
                maxWidth: "500px",
                p: 3,
                mt: 3,
                borderRadius: "12px",
                bgcolor: alpha("#3f51b5", 0.03),
                border: `1px solid ${alpha("#3f51b5", 0.1)}`,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <ErrorOutline sx={{ color: "#3f51b5", mt: 0.5 }} />
                <Box>
                  <Typography variant="subtitle2" fontWeight="medium" gutterBottom>
                    Having trouble connecting?
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Make sure your phone has an active internet connection. If the QR code expires, click the refresh
                    button to generate a new one.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default ScanWhatsapp
