"use client"

import { useState, useEffect, useRef } from "react"
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  CircularProgress,
  alpha,
  InputAdornment,
} from "@mui/material"
import {
  Send as SendIcon,
  Close as CloseIcon,
  WhatsApp as WhatsAppIcon,
  AttachFile as AttachFileIcon,
  EmojiEmotions as EmojiIcon,
} from "@mui/icons-material"
import { useSelector } from "react-redux"
import { fetchWithAuth } from "../api/fetchWithAuth"

const ChatModal = ({ open, onClose, to }) => {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [phone, setPhone] = useState(to || "")
  const [sending, setSending] = useState(false)
  const [error, setError] = useState("")
  const token = useSelector((state) => state.auth.token)
  const messagesEndRef = useRef(null)

  // Scroll to bottom of messages when new messages are added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Format timestamp
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const handleSendMessage = async () => {
    if (!input.trim() || !phone.trim()) return

    // Clear any previous errors
    setError("")

    // Create user message
    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    // Add user message to chat
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSending(true)

    try {
      // Send message to API
      const response = await fetchWithAuth("http://localhost:8080/api/v1/tenant/whatsapp/ai/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ to: phone, message: userMessage.content }),
      })

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()

      // Add AI response to chat
      const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: data.reply || "Message sent successfully.",
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
    } catch (err) {
      setError(err.message || "Failed to send message")

      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Failed to send message to server.",
          role: "error",
          timestamp: new Date(),
        },
      ])
    } finally {
      setSending(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Format phone number for display
  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return ""

    // Remove any non-digit characters
    const cleaned = phoneNumber.replace(/\D/g, "")

    // Check if it starts with country code
    if (cleaned.startsWith("62")) {
      return `+${cleaned}`
    }

    return cleaned
  }

  if (!open) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          overflow: "hidden",
        },
      }}
    >
      {/* Chat Header */}
      <DialogTitle
        sx={{
          bgcolor: alpha("#25D366", 0.1),
          display: "flex",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid",
          borderColor: alpha("#000", 0.1),
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#25D366",
            mr: 2,
          }}
        >
          <WhatsAppIcon />
        </Avatar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {to || "WhatsApp Chat"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {formatPhoneNumber(phone)}
          </Typography>
        </Box>
        <IconButton
          edge="end"
          color="inherit"
          onClick={onClose}
          aria-label="close"
          sx={{
            bgcolor: alpha("#000", 0.05),
            "&:hover": { bgcolor: alpha("#000", 0.1) },
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* Phone Number Input */}
      <Box sx={{ px: 3, py: 2, borderBottom: "1px solid", borderColor: alpha("#000", 0.1) }}>
        <TextField
          fullWidth
          label="Destination Phone Number"
          placeholder="e.g., 628123456789"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <WhatsAppIcon sx={{ color: "#25D366" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
            },
          }}
        />
      </Box>

      {/* Chat Messages */}
      <DialogContent
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          height: 350,
          bgcolor: alpha("#f5f7fa", 0.5),
          backgroundImage: `radial-gradient(${alpha("#000", 0.05)} 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "6px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha("#000", 0.1),
            borderRadius: "3px",
          },
        }}
      >
        {messages.length === 0 ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            <Avatar
              sx={{
                bgcolor: alpha("#25D366", 0.1),
                color: "#25D366",
                width: 60,
                height: 60,
                mb: 2,
              }}
            >
              <WhatsAppIcon sx={{ fontSize: 30 }} />
            </Avatar>
            <Typography variant="body1" sx={{ fontWeight: "medium", mb: 1 }}>
              Start a conversation
            </Typography>
            <Typography variant="body2" sx={{ maxWidth: 300 }}>
              Enter a phone number and send a message to begin chatting
            </Typography>
          </Box>
        ) : (
          messages.map((msg) => (
            <Box
              key={msg.id}
              sx={{
                mb: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "80%",
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  borderRadius: "12px",
                  bgcolor:
                    msg.role === "user"
                      ? alpha("#3f51b5", 0.1)
                      : msg.role === "error"
                        ? alpha("#f44336", 0.1)
                        : "white",
                  color: msg.role === "user" ? "text.primary" : msg.role === "error" ? "#f44336" : "text.primary",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                  position: "relative",
                  "&::after": {
                    content: '""',
                    position: "absolute",
                    width: 0,
                    height: 0,
                    borderTop: "8px solid transparent",
                    borderBottom: "8px solid transparent",
                    borderRight:
                      msg.role !== "user"
                        ? `8px solid ${msg.role === "error" ? alpha("#f44336", 0.1) : "white"}`
                        : "none",
                    borderLeft: msg.role === "user" ? `8px solid ${alpha("#3f51b5", 0.1)}` : "none",
                    top: "12px",
                    left: msg.role !== "user" ? "-8px" : "auto",
                    right: msg.role === "user" ? "-8px" : "auto",
                  },
                }}
              >
                <Typography variant="body1">{msg.content}</Typography>
              </Paper>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, mx: 1 }}>
                {formatTime(msg.timestamp)}
              </Typography>
            </Box>
          ))
        )}
        {sending && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              alignSelf: "flex-start",
              mb: 2,
            }}
          >
            <CircularProgress size={20} sx={{ color: "#25D366", mr: 1 }} />
            <Typography variant="body2" color="text.secondary">
              Sending...
            </Typography>
          </Box>
        )}
        {error && (
          <Chip
            label={error}
            color="error"
            size="small"
            sx={{
              alignSelf: "center",
              mb: 2,
            }}
          />
        )}
        <div ref={messagesEndRef} />
      </DialogContent>

      {/* Message Input */}
      <DialogActions
        sx={{
          p: 2,
          display: "flex",
          alignItems: "center",
          borderTop: "1px solid",
          borderColor: alpha("#000", 0.1),
        }}
      >
        <IconButton
          color="primary"
          sx={{
            color: "#3f51b5",
          }}
        >
          <EmojiIcon />
        </IconButton>
        <IconButton
          color="primary"
          sx={{
            color: "#3f51b5",
          }}
        >
          <AttachFileIcon />
        </IconButton>
        <TextField
          fullWidth
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          multiline
          maxRows={3}
          size="small"
          sx={{
            mx: 1,
            "& .MuiOutlinedInput-root": {
              borderRadius: "20px",
              bgcolor: alpha("#000", 0.03),
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
        <IconButton
          onClick={handleSendMessage}
          disabled={!input.trim() || !phone.trim() || sending}
          sx={{
            bgcolor: "#25D366",
            color: "white",
            "&:hover": { bgcolor: "#128C7E" },
            "&.Mui-disabled": {
              bgcolor: alpha("#25D366", 0.5),
              color: "white",
            },
          }}
        >
          <SendIcon />
        </IconButton>
      </DialogActions>
    </Dialog>
  )
}

export default ChatModal