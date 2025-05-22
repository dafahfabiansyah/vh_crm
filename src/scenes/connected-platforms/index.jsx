"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  IconButton,
  Avatar,
  Modal,
  Paper,
  Chip,
  TextField,
  InputAdornment,
  Button,
  alpha,
  Card,
  CardContent,
  Divider,
  Grid,
  useMediaQuery,
  Drawer,
  Fab,
} from "@mui/material"
import AddIcon from "@mui/icons-material/Add"
import SearchIcon from "@mui/icons-material/Search"
import CloseIcon from "@mui/icons-material/Close"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import InstagramIcon from "@mui/icons-material/Instagram"
import FacebookIcon from "@mui/icons-material/Facebook"
import TelegramIcon from "@mui/icons-material/Telegram"
import TwitterIcon from "@mui/icons-material/Twitter"
import EmailIcon from "@mui/icons-material/Email"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import PhoneIcon from "@mui/icons-material/Phone"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import LockIcon from "@mui/icons-material/Lock"
import ListIcon from "@mui/icons-material/List"
import Sidebar from "../global/Sidebar"
// import { inboxes, premiumPlatforms, platforms } from "../../data/mockData"
import { inboxes } from "../../data/mockData"
import { useNavigate } from "react-router-dom"

// Mock data if not available in the imported files
const mockInboxes = [
  {
    id: 1,
    name: "WhatsApp Business",
    phone: "+62 812 3456 7890",
    badge: "Connected",
    ai: "AI Enabled",
    icon: <WhatsAppIcon sx={{ fontSize: 40, color: "#25D366" }} />,
    messages: [
      {
        sender: "Customer",
        text: "Halo, saya ingin menanyakan tentang produk Anda",
        time: "10:30 AM",
      },
      {
        sender: "You",
        text: "Selamat pagi! Tentu, ada yang bisa saya bantu?",
        time: "10:32 AM",
      },
      {
        sender: "Customer",
        text: "Apakah produk X tersedia dalam warna biru?",
        time: "10:33 AM",
      },
    ],
  },
  {
    id: 2,
    name: "Instagram DM",
    badge: "Connected",
    icon: <InstagramIcon sx={{ fontSize: 40, color: "#E1306C" }} />,
    messages: [],
  },
  {
    id: 3,
    name: "Facebook Messenger",
    badge: "Connected",
    icon: <FacebookIcon sx={{ fontSize: 40, color: "#4267B2" }} />,
    messages: [
      {
        sender: "Customer",
        text: "Hi, do you ship internationally?",
        time: "Yesterday",
      },
    ],
  },
]

const mockPlatforms = [
  {
    name: "WhatsApp",
    // icon: "/images/whatsapp.png",
    icon: <WhatsAppIcon sx={{ fontSize: 40, color: "#25D366" }} />,
    iconComponent: <WhatsAppIcon sx={{ fontSize: 40, color: "#25D366" }} />,
  },
  {
    name: "Instagram",
    // icon: "/images/instagram.png",
    icon: <InstagramIcon sx={{ fontSize: 40, color: "#E1306C" }} />,
    iconComponent: <InstagramIcon sx={{ fontSize: 40, color: "#E1306C" }} />,
  },
  {
    name: "Facebook",
    // icon: "/images/facebook.png",
    icon: <FacebookIcon sx={{ fontSize: 40, color: "#4267B2" }} />,
    iconComponent: <FacebookIcon sx={{ fontSize: 40, color: "#4267B2" }} />,
  },
  // {
  //   name: "Telegram",
  //   // icon: "/images/telegram.png",
  //   icon: <TelegramIcon sx={{ fontSize: 40, color: "#0088cc" }} />,
  //   iconComponent: <TelegramIcon sx={{ fontSize: 40, color: "#0088cc" }} />,
  // },
  {
    name: "Email",
    // icon: "/images/telegram.png",
    icon: <EmailIcon sx={{ fontSize: 40, color: "#DB4437" }} />,
    iconComponent: <EmailIcon sx={{ fontSize: 40, color: "#DB4437" }} />,
  },
]

const mockPremiumPlatforms = [
  {
    name: "Twitter",
    // icon: "/images/twitter.png",
    icon: <TwitterIcon sx={{ fontSize: 40, color: "#1DA1F2" }} />,
    desc: "Premium",
    iconComponent: <TwitterIcon sx={{ fontSize: 40, color: "#1DA1F2" }} />,
  },
  {
    name: "Telegram",
    // icon: "/images/email.png",
    icon: <TelegramIcon sx={{ fontSize: 40, color: "#0088cc" }} />,
    desc: "Premium",
    iconComponent: <TelegramIcon sx={{ fontSize: 40, color: "#0088cc" }} />,
  },
]

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "90%", sm: "80%", md: 700 },
  maxHeight: { xs: "90vh", sm: "80vh" },
  overflow: "auto",
  bgcolor: "#fff",
  borderRadius: "12px",
  boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
  p: { xs: 2, sm: 3, md: 4 },
  outline: "none",
}

const ConnectedPlatform = () => {
  const [openModal, setOpenModal] = useState(false)
  const [selectedInbox, setSelectedInbox] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()

  const isMobile = useMediaQuery("(max-width:900px)")
  const isSmallScreen = useMediaQuery("(max-width:600px)")

  // Use the imported data or fallback to mock data
  const actualInboxes = inboxes || mockInboxes
  // const actualPlatforms = platforms || mockPlatforms
  const actualPlatforms = mockPlatforms
  // const actualPremiumPlatforms = premiumPlatforms || mockPremiumPlatforms
  const actualPremiumPlatforms = mockPremiumPlatforms

  // Filter inboxes based on search term
  const filteredInboxes = actualInboxes.filter((inbox) => inbox.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen)
  }

  // Get platform icon component based on name
  const getPlatformIcon = (name) => {
    if (name.includes("WhatsApp")) return <WhatsAppIcon sx={{ fontSize: 24, color: "#25D366" }} />
    if (name.includes("Instagram")) return <InstagramIcon sx={{ fontSize: 24, color: "#E1306C" }} />
    if (name.includes("Facebook")) return <FacebookIcon sx={{ fontSize: 24, color: "#4267B2" }} />
    if (name.includes("Telegram")) return <TelegramIcon sx={{ fontSize: 24, color: "#0088cc" }} />
    if (name.includes("Twitter")) return <TwitterIcon sx={{ fontSize: 24, color: "#1DA1F2" }} />
    if (name.includes("Email")) return <EmailIcon sx={{ fontSize: 24, color: "#DB4437" }} />
    return null
  }

  // Get platform color based on name
  const getPlatformColor = (name) => {
    if (name.includes("WhatsApp")) return "#25D366"
    if (name.includes("Instagram")) return "#E1306C"
    if (name.includes("Facebook")) return "#4267B2"
    if (name.includes("Telegram")) return "#0088cc"
    if (name.includes("Twitter")) return "#1DA1F2"
    if (name.includes("Email")) return "#DB4437"
    return "#3f51b5" // Default color
  }

  // Render inbox list content
  const inboxListContent = (
    <>
      {/* Header */}
      <Box
        sx={{
          p: 3,
          borderBottom: "1px solid",
          borderColor: alpha("#000", 0.08),
          bgcolor: "white",
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
            Inboxes
          </Typography>
          <IconButton
            size="small"
            sx={{
              bgcolor: alpha("#3f51b5", 0.1),
              color: "#3f51b5",
              "&:hover": { bgcolor: alpha("#3f51b5", 0.2) },
            }}
            onClick={() => setOpenModal(true)}
          >
            <AddIcon fontSize="small" />
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Connect and manage all your messaging platforms
        </Typography>
      </Box>

      {/* Search */}
      <Box sx={{ p: 2, bgcolor: "white" }}>
        <TextField
          placeholder="Search inboxes..."
          variant="outlined"
          size="small"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              bgcolor: alpha("#000", 0.03),
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
      </Box>

      {/* Inboxes List */}
      <Box sx={{ p: 2 }}>
        {filteredInboxes.map((inbox) => (
          <Card
            key={inbox.id}
            sx={{
              mb: 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              transition: "box-shadow 0.3s ease, transform 0.2s ease",
              "&:hover": {
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transform: "translateY(-2px)",
              },
              borderLeft: `4px solid ${getPlatformColor(inbox.name)}`,
              cursor: "pointer",
              bgcolor: selectedInbox?.id === inbox.id ? alpha(getPlatformColor(inbox.name), 0.05) : "white",
            }}
            onClick={() => {
              setSelectedInbox(inbox)
              if (isMobile) {
                setDrawerOpen(false)
              }
            }}
          >
            <CardContent sx={{ p: "16px !important" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Avatar
                  src={inbox.icon}
                  sx={{
                    width: 48,
                    height: 48,
                    mr: 2,
                    bgcolor: alpha(getPlatformColor(inbox.name), 0.1),
                    color: getPlatformColor(inbox.name),
                  }}
                >
                  {getPlatformIcon(inbox.name) || inbox.name[0]}
                </Avatar>

                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 0.5 }}>
                    {inbox.name}
                  </Typography>

                  {inbox.phone && (
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <PhoneIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {inbox.phone}
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box sx={{ textAlign: "right" }}>
                  {inbox.ai && (
                    <Chip
                      icon={<SmartToyIcon sx={{ fontSize: "0.8rem" }} />}
                      label="AI Enabled"
                      size="small"
                      sx={{
                        mb: 1,
                        height: 24,
                        bgcolor: alpha("#3f51b5", 0.1),
                        color: "#3f51b5",
                        fontWeight: "medium",
                        fontSize: "0.7rem",
                      }}
                    />
                  )}
                  <Chip
                    label={inbox.badge}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: "0.7rem",
                      bgcolor:
                        inbox.badge === "Connected"
                          ? alpha("#4caf50", 0.1)
                          : inbox.badge === "Pending"
                            ? alpha("#ff9800", 0.1)
                            : alpha("#9e9e9e", 0.1),
                      color:
                        inbox.badge === "Connected" ? "#4caf50" : inbox.badge === "Pending" ? "#ff9800" : "#9e9e9e",
                      fontWeight: "bold",
                    }}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        ))}

        {/* Add new inbox */}
        <Card
          sx={{
            mb: 2,
            boxShadow: "none",
            border: `2px dashed ${alpha("#3f51b5", 0.3)}`,
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#3f51b5",
              bgcolor: alpha("#3f51b5", 0.05),
            },
            cursor: "pointer",
            bgcolor: alpha("#3f51b5", 0.02),
            borderRadius: "8px",
          }}
          onClick={() => setOpenModal(true)}
        >
          <CardContent sx={{ p: "16px !important" }}>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  mr: 2,
                  bgcolor: alpha("#3f51b5", 0.1),
                  color: "#3f51b5",
                }}
              >
                <AddIcon />
              </Avatar>

              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 0.5 }}>
                  Connect New Platform
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add a new messaging inbox
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </>
  )

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box
        sx={{
          flexGrow: 1,
          ml: { xs: 0, md: "60px" },
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        {/* Left Panel - Inboxes List - Desktop Version */}
        {!isMobile && (
          <Paper
            sx={{
              width: 370,
              height: "100vh",
              overflow: "auto",
              borderRadius: 0,
              boxShadow: "0 0 10px rgba(0,0,0,0.05)",
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
            {inboxListContent}
          </Paper>
        )}

        {/* Left Panel - Inboxes List - Mobile Version (Drawer) */}
        {isMobile && (
          <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "85%", sm: 370 },
                boxSizing: "border-box",
              },
            }}
          >
            {inboxListContent}
          </Drawer>
        )}

        {/* Right Panel - Inbox Details */}
        <Box
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3 },
            overflow: "auto",
            width: { xs: "100%", md: "auto" },
          }}
        >
          {/* Mobile Header with Toggle Button */}
          {isMobile && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
                {selectedInbox ? selectedInbox.name : "Platforms"}
              </Typography>
              <IconButton
                onClick={toggleDrawer}
                sx={{
                  bgcolor: alpha("#3f51b5", 0.1),
                  color: "#3f51b5",
                }}
              >
                <ListIcon />
              </IconButton>
            </Box>
          )}

          {!selectedInbox ? (
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: { xs: 2, sm: 4 },
              }}
            >
              <Box
                sx={{
                  width: { xs: 80, sm: 100 },
                  height: { xs: 80, sm: 100 },
                  borderRadius: "50%",
                  bgcolor: alpha("#3f51b5", 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3,
                }}
              >
                <Box sx={{ color: "#3f51b5", fontSize: { xs: 32, sm: 40 } }}>{getPlatformIcon("WhatsApp")}</Box>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5", textAlign: "center" }}>
                No Inbox Selected
              </Typography>
              <Typography variant="body1" color="text.secondary" align="center" sx={{ mb: 3, maxWidth: 400 }}>
                Select an inbox from the list to view and manage its settings, or connect a new platform to get started.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => setOpenModal(true)}
                sx={{
                  bgcolor: "#3f51b5",
                  "&:hover": { bgcolor: "#303f9f" },
                  borderRadius: "8px",
                  px: 3,
                }}
              >
                Connect Platform
              </Button>
            </Box>
          ) : (
            <Box>
              {/* Inbox Header */}
              <Paper
                sx={{
                  p: { xs: 2, sm: 3 },
                  mb: 3,
                  borderRadius: "12px",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                  borderTop: `4px solid ${getPlatformColor(selectedInbox.name)}`,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", sm: "row" },
                    alignItems: { xs: "flex-start", sm: "center" },
                    justifyContent: "space-between",
                    gap: { xs: 2, sm: 0 },
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      width: { xs: "100%", sm: "auto" },
                    }}
                  >
                    <Avatar
                      src={selectedInbox.icon}
                      sx={{
                        width: { xs: 48, sm: 56 },
                        height: { xs: 48, sm: 56 },
                        mr: 2,
                        bgcolor: alpha(getPlatformColor(selectedInbox.name), 0.1),
                        color: getPlatformColor(selectedInbox.name),
                      }}
                    >
                      {getPlatformIcon(selectedInbox.name) || selectedInbox.name[0]}
                    </Avatar>

                    <Box>
                      <Typography
                        variant="h5"
                        sx={{ fontWeight: "bold", mb: 0.5, fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                      >
                        {selectedInbox.name}
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        {selectedInbox.phone && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <PhoneIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {selectedInbox.phone}
                            </Typography>
                          </Box>
                        )}
                        <Chip
                          label={selectedInbox.badge}
                          size="small"
                          sx={{
                            height: 24,
                            fontSize: "0.75rem",
                            bgcolor:
                              selectedInbox.badge === "Connected"
                                ? alpha("#4caf50", 0.1)
                                : selectedInbox.badge === "Pending"
                                  ? alpha("#ff9800", 0.1)
                                  : alpha("#9e9e9e", 0.1),
                            color:
                              selectedInbox.badge === "Connected"
                                ? "#4caf50"
                                : selectedInbox.badge === "Pending"
                                  ? "#ff9800"
                                  : "#9e9e9e",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    </Box>
                  </Box>

                  <Box>
                    <IconButton
                      sx={{
                        bgcolor: alpha("#000", 0.05),
                        "&:hover": { bgcolor: alpha("#000", 0.1) },
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Paper>

              {/* Inbox Content */}
              <Grid container spacing={3}>
                <Grid item xs={12} md={7}>
                  <Paper
                    sx={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      height: "100%",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Box
                      sx={{
                        p: 2,
                        borderBottom: "1px solid",
                        borderColor: alpha("#000", 0.08),
                        bgcolor: alpha(getPlatformColor(selectedInbox.name), 0.05),
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      {getPlatformIcon(selectedInbox.name)}
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                        Recent Messages
                      </Typography>
                    </Box>

                    <Box sx={{ p: 2, flexGrow: 1, overflow: "auto", minHeight: { xs: 200, sm: 300 } }}>
                      {selectedInbox.messages && selectedInbox.messages.length > 0 ? (
                        selectedInbox.messages.map((msg, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              mb: 2,
                              p: 2,
                              bgcolor:
                                msg.sender === "You"
                                  ? alpha("#3f51b5", 0.1)
                                  : msg.sender === "Customer"
                                    ? alpha("#f5f7fa", 0.7)
                                    : alpha(getPlatformColor(selectedInbox.name), 0.1),
                              borderRadius: "12px",
                              maxWidth: "80%",
                              ml: msg.sender === "You" ? "auto" : 0,
                              position: "relative",
                              "&::after": {
                                content: '""',
                                position: "absolute",
                                width: 0,
                                height: 0,
                                borderTop: "8px solid transparent",
                                borderBottom: "8px solid transparent",
                                borderRight:
                                  msg.sender !== "You"
                                    ? `8px solid ${msg.sender === "Customer" ? alpha("#f5f7fa", 0.7) : alpha(getPlatformColor(selectedInbox.name), 0.1)}`
                                    : "none",
                                borderLeft: msg.sender === "You" ? `8px solid ${alpha("#3f51b5", 0.1)}` : "none",
                                top: "12px",
                                left: msg.sender !== "You" ? "-8px" : "auto",
                                right: msg.sender === "You" ? "-8px" : "auto",
                              },
                            }}
                          >
                            <Typography variant="subtitle2" sx={{ fontWeight: "bold", mb: 0.5 }}>
                              {msg.sender}
                            </Typography>
                            <Typography variant="body2">{msg.text}</Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                              {msg.time}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Box
                          sx={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            p: { xs: 2, sm: 4 },
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 40, sm: 60 },
                              height: { xs: 40, sm: 60 },
                              borderRadius: "50%",
                              bgcolor: alpha("#9e9e9e", 0.1),
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              mb: 2,
                            }}
                          >
                            <EmailIcon sx={{ fontSize: { xs: 20, sm: 30 }, color: "#9e9e9e" }} />
                          </Box>
                          <Typography variant="body1" sx={{ fontWeight: "medium", mb: 1, color: "#9e9e9e" }}>
                            No Messages Yet
                          </Typography>
                          <Typography variant="body2" color="text.secondary" align="center">
                            Messages will appear here once customers start contacting you.
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Box
                      sx={{
                        p: 2,
                        borderTop: "1px solid",
                        borderColor: alpha("#000", 0.08),
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <TextField
                        placeholder="Type a message..."
                        variant="outlined"
                        size="small"
                        fullWidth
                        disabled={!selectedInbox.messages || selectedInbox.messages.length === 0}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "20px",
                            bgcolor: alpha("#000", 0.03),
                            "& fieldset": {
                              border: "none",
                            },
                          },
                        }}
                      />
                      <Button
                        variant="contained"
                        disabled={!selectedInbox.messages || selectedInbox.messages.length === 0}
                        sx={{
                          bgcolor: "#3f51b5",
                          "&:hover": { bgcolor: "#303f9f" },
                          borderRadius: "20px",
                          minWidth: "auto",
                          px: 2,
                        }}
                      >
                        Send
                      </Button>
                    </Box>
                  </Paper>
                </Grid>

                <Grid item xs={12} md={5}>
                  <Paper
                    sx={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      p: { xs: 2, sm: 3 },
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
                      Inbox Settings
                    </Typography>
                    <Divider sx={{ mb: 2 }} />

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: "medium", mb: 1 }}>
                        Connection Status
                      </Typography>
                      <Chip
                        label={selectedInbox.badge}
                        sx={{
                          bgcolor:
                            selectedInbox.badge === "Connected"
                              ? alpha("#4caf50", 0.1)
                              : selectedInbox.badge === "Pending"
                                ? alpha("#ff9800", 0.1)
                                : alpha("#9e9e9e", 0.1),
                          color:
                            selectedInbox.badge === "Connected"
                              ? "#4caf50"
                              : selectedInbox.badge === "Pending"
                                ? "#ff9800"
                                : "#9e9e9e",
                          fontWeight: "bold",
                        }}
                      />
                    </Box>

                    {selectedInbox.ai && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: "medium", mb: 1 }}>
                          AI Assistant
                        </Typography>
                        <Chip
                          icon={<SmartToyIcon />}
                          label="Enabled"
                          sx={{
                            bgcolor: alpha("#3f51b5", 0.1),
                            color: "#3f51b5",
                            fontWeight: "bold",
                          }}
                        />
                      </Box>
                    )}

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ fontWeight: "medium", mb: 1 }}>
                        Platform
                      </Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {getPlatformIcon(selectedInbox.name)}
                        <Typography variant="body1">{selectedInbox.name}</Typography>
                      </Box>
                    </Box>

                    {selectedInbox.phone && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" sx={{ fontWeight: "medium", mb: 1 }}>
                          Phone Number
                        </Typography>
                        <Typography variant="body1">{selectedInbox.phone}</Typography>
                      </Box>
                    )}

                    <Divider sx={{ my: 2 }} />

                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        flexDirection: { xs: isSmallScreen ? "column" : "row", sm: "row" },
                        "& .MuiButton-root": {
                          width: { xs: isSmallScreen ? "100%" : "auto", sm: "auto" },
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        sx={{
                          borderColor: "#f44336",
                          color: "#f44336",
                          "&:hover": {
                            borderColor: "#d32f2f",
                            bgcolor: alpha("#f44336", 0.05),
                          },
                          borderRadius: "8px",
                        }}
                      >
                        Disconnect
                      </Button>
                      <Button
                        variant="contained"
                        sx={{
                          bgcolor: "#3f51b5",
                          "&:hover": { bgcolor: "#303f9f" },
                          borderRadius: "8px",
                        }}
                      >
                        Edit Settings
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Box>

      {/* Mobile FAB for adding new platform */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            bgcolor: "#3f51b5",
            "&:hover": { bgcolor: "#303f9f" },
          }}
          onClick={() => setOpenModal(true)}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Platform Connection Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Paper sx={modalStyle}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
            }}
          >
            <Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#3f51b5", mb: 1, fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
              >
                Connect Platform
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Select the messaging platform you want to connect
              </Typography>
            </Box>
            <IconButton
              onClick={() => setOpenModal(false)}
              sx={{
                bgcolor: alpha("#000", 0.05),
                "&:hover": { bgcolor: alpha("#000", 0.1) },
                alignSelf: { xs: "flex-end", sm: "auto" },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2 }}>
            Available Platforms
          </Typography>

          <Grid container spacing={2} sx={{ mb: 4 }}>
            {actualPlatforms.map((platform) => (
              <Grid item xs={6} sm={3} key={platform.name}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.3s ease, transform 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      transform: "translateY(-4px)",
                    },
                    cursor: "pointer",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                  onClick={() => {
                    setOpenModal(false)
                    navigate("/inbox/new-inbox")
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, sm: 64 },
                      height: { xs: 48, sm: 64 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                    }}
                  >
                    {platform.iconComponent || (
                      <img
                        src={platform.icon || "/placeholder.svg"}
                        alt={platform.name}
                        style={{ width: "100%", height: "auto" }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}
                  >
                    {platform.name}
                  </Typography>
                  <Chip
                    label="Available"
                    size="small"
                    sx={{
                      bgcolor: alpha("#4caf50", 0.1),
                      color: "#4caf50",
                      fontWeight: "medium",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 2, display: "flex", alignItems: "center" }}>
            Premium Platforms <LockIcon sx={{ ml: 1, fontSize: 16, color: "#9e9e9e" }} />
          </Typography>

          <Grid container spacing={2}>
            {actualPremiumPlatforms.map((platform) => (
              <Grid item xs={6} sm={3} key={platform.name}>
                <Paper
                  sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    opacity: 0.6,
                    cursor: "not-allowed",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    position: "relative",
                    overflow: "hidden",
                    "&::after": {
                      content: '""',
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.03) 10px, rgba(0,0,0,0.03) 20px)",
                      pointerEvents: "none",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: 48, sm: 64 },
                      height: { xs: 48, sm: 64 },
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mb: 2,
                      filter: "grayscale(1)",
                    }}
                  >
                    {platform.iconComponent || (
                      <img
                        src={platform.icon || "/placeholder.svg"}
                        alt={platform.name}
                        style={{ width: "100%", height: "auto" }}
                      />
                    )}
                  </Box>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", mb: 1, fontSize: { xs: "0.9rem", sm: "1rem" } }}
                  >
                    {platform.name}
                  </Typography>
                  <Chip
                    label="Premium"
                    size="small"
                    sx={{
                      bgcolor: alpha("#ff9800", 0.1),
                      color: "#ff9800",
                      fontWeight: "medium",
                      fontSize: "0.7rem",
                      height: 20,
                    }}
                  />
                </Paper>
              </Grid>
            ))}
          </Grid>

          <Box
            sx={{
              mt: 4,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              flexDirection: { xs: isSmallScreen ? "column" : "row", sm: "row" },
              "& .MuiButton-root": {
                width: { xs: isSmallScreen ? "100%" : "auto", sm: "auto" },
              },
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setOpenModal(false)}
              sx={{
                borderColor: alpha("#000", 0.2),
                color: "text.secondary",
                "&:hover": {
                  borderColor: alpha("#000", 0.3),
                  bgcolor: alpha("#000", 0.05),
                },
                borderRadius: "8px",
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpenModal(false)
                navigate("/pricing")
              }}
              sx={{
                bgcolor: "#ff9800",
                "&:hover": { bgcolor: "#f57c00" },
                borderRadius: "8px",
              }}
            >
              Upgrade to Premium
            </Button>
          </Box>
        </Paper>
      </Modal>
    </Box>
  )
}

export default ConnectedPlatform
