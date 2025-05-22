"use client";

import { useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  TextField,
  IconButton,
  Paper,
  InputAdornment,
  Divider,
} from "@mui/material";
import { Send, MoreVert, InsertEmoticon } from "@mui/icons-material";
import { fetchWithAuth } from "../api/fetchWithAuth";
import { config } from "../config";

const Chat = ({ agentName, agentSettings }) => {  const { id: agentId } = useParams();
  const { businessName } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState(() => {
    if (agentSettings?.welcome_message) {
      return [
        {
          id: {agentId},
          content: `${agentSettings.welcome_message} ${
            businessName
              ? `saya akan membantu anda untuk berbelanja di ${businessName}`
              : ""
          }`,
          role: "assistant",
          timestamp: new Date(),
        },
      ];
    }
    // Fallback if no welcome message
    return [];
  });
  const [input, setInput] = useState("");
  const [chatId] = useState("chat_12345"); // static or generate as needed

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await fetchWithAuth(
        // "http://localhost:8080/api/v1/tenant/ai/chat",
        `http://${config.HOST}:${config.PORT}/api/v1/tenant/ai/chat`,
        {
          method: "POST",
          body: JSON.stringify({
            agent_id: agentId,
            message: userMessage.content,
            chat_id: chatId,
          }),
        }
      );
      if (!response.ok) throw new Error("Gagal mengirim pesan");
      const data = await response.json();
      console.log("Response data:", data);    
        const aiResponse = {
        id: (Date.now() + 1).toString(),
        content: data.message || "Pesan berhasil dikirim.",
        role: "assistant",
        timestamp: new Date(),
        token_usage: data.token_usage,
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 2).toString(),
          content: "Gagal mengirim pesan ke server.",
          role: "assistant",
          timestamp: new Date(),
        },
      ]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Card
      sx={{
        maxWidth: 400,
        // height: 800,
        mx: "auto",
        boxShadow: 1,
        borderRadius: 2,
      }}
    >
      {/* Chat header */}
      <CardHeader
        avatar={
          <Avatar
            sx={{ width: 30, height: 30, bgcolor: "#f0f0f0", color: "#333" }}
          >
            👤
          </Avatar>
        }
        action={
          <IconButton aria-label="settings" size="small">
            <MoreVert fontSize="small" />
          </IconButton>
        }
        title={
          <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
            {agentName || "AI Agent"}
          </Typography>
        }
        sx={{
          py: 1.5,
          px: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      />

      {/* Chat messages */}
      <CardContent
        sx={{
          height: 400,
          overflowY: "auto",
          p: 2,
          "&::-webkit-scrollbar": {
            width: "0.4em",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
            webkitBoxShadow: "inset 0 0 6px rgba(0,0,0,0.00)",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0,0,0,.1)",
            borderRadius: 10,
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
          {messages.map((message) => (
            <Box
              key={message.id}
              sx={{
                display: "flex",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
              }}
            >
              <Paper
                elevation={0}
                sx={{
                  maxWidth: "85%",
                  px: 2,
                  py: 1.5,
                  borderRadius: 4,
                  bgcolor: message.role === "user" ? "#1976d2" : "#f5f5f5",
                  color: message.role === "user" ? "#fff" : "inherit",
                }}
              >                <Typography variant="body2">{message.content}</Typography>
                {message.role === "assistant" && message.token_usage && (
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{ display: "block", mt: 0.5 }}
                    >
                      Sisa Credit User: {message.token_usage}
                    </Typography>
                  )}
              </Paper>
            </Box>
          ))}
        </Box>
      </CardContent>

      <Divider />

      {/* Chat input */}
      <CardActions sx={{ p: 2, bgcolor: "#fff" }}>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            gap: 1,
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          {/* <TextField
            fullWidth
            placeholder="Nomor tujuan (cth: 628123456789)"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            size="small"
            sx={{ mb: 1 }}
          /> */}
          <Box
            sx={{
              display: "flex",
              width: "100%",
              gap: 1,
              alignItems: "center",
            }}
          >
            <TextField
              fullWidth
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton edge="end" size="small">
                      <InsertEmoticon
                        fontSize="small"
                        sx={{ color: "#9e9e9e" }}
                      />
                    </IconButton>
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 5,
                  pr: 0.5,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#bdbdbd",
                  },
                },
              }}
            />
            <IconButton
              onClick={handleSendMessage}
              sx={{
                bgcolor: "#1976d2",
                color: "#fff",
                width: 40,
                height: 40,
                "&:hover": {
                  bgcolor: "#1565c0",
                },
              }}
            >
              <Send fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </CardActions>
    </Card>
  );
};

export default Chat;
