"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Badge,
  Chip,
  alpha,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Grid, // Added Grid import
} from "@mui/material"
import FilterListIcon from "@mui/icons-material/FilterList"
import AddIcon from "@mui/icons-material/Add"
import ViewListIcon from "@mui/icons-material/ViewList"
import RefreshIcon from "@mui/icons-material/Refresh"
import SearchIcon from "@mui/icons-material/Search"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import PersonIcon from "@mui/icons-material/Person"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import InstagramIcon from "@mui/icons-material/Instagram"
import FacebookIcon from "@mui/icons-material/Facebook"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import GroupAddIcon from "@mui/icons-material/GroupAdd"
import LinkIcon from "@mui/icons-material/Link"
import YouTubeIcon from "@mui/icons-material/YouTube"
import Sidebar from "../global/Sidebar"
import { useNavigate } from "react-router-dom"
import ChatModal from "../../components/ChatModal"

// Status color mapping - matching the Kanban board style
const statusColors = {
  Pending: "#ff9800",
  Active: "#4caf50",
  Closed: "#9e9e9e",
  New: "#42a5f5",
}

// Get initials from name
const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

const Dashboard = () => {
  const [openModal, setOpenModal] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [selectedAgent, setSelectedAgent] = useState("")
  const [chatTo, setChatTo] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [isMobileView, setIsMobileView] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 900)
    }

    // Initial check
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const navigate = useNavigate()

  const handleTicketClick = (user) => {
    setChatTo(user)
    setOpenModal(true)
  }

  const handleCloseModal = () => {
    setOpenModal(false)
  }

  const handleChange = (event) => {
    setSelectedAgent(event.target.value)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // Sample ticket data
  const tickets = [
    {
      id: 1,
      name: "Ab Teguh Ardiansyah",
      message: "Kak, Sepertinya ini ada...",
      time: "13:38",
      agent: "Abang Benerin",
      agentInitial: "A",
      agentColor: "#4caf50",
      status: "Pending",
    },
    {
      id: 2,
      name: "ABANG BENERIN",
      message: "This message is currently...",
      time: "13:37",
      agent: "Agent",
      agentInitial: "A",
      agentColor: "#2196f3",
      status: "Active",
    },
    {
      id: 3,
      name: "Sarah Customer",
      message: "Saya ingin menanyakan tentang...",
      time: "12:45",
      agent: "Wahyu",
      agentInitial: "W",
      agentColor: "#9c27b0",
      status: "Active",
    },
    {
      id: 4,
      name: "John Buyer",
      message: "Apakah produk ini masih tersedia?",
      time: "11:20",
      agent: "Hihi",
      agentInitial: "H",
      agentColor: "#e91e63",
      status: "Closed",
    },
    {
      id: 5,
      name: "New Customer",
      message: "Halo, saya tertarik dengan produk...",
      time: "10:15",
      agent: "Unassigned",
      agentInitial: "U",
      agentColor: "#607d8b",
      status: "New",
    },
  ]

  // Feature cards data
  const featureCards = [
    {
      id: 1,
      title: "1. Hubungkan Platform",
      description: "Mulai terima pesan dari Whatsapp, IG, dan FB Anda!",
      icon: <WhatsAppIcon sx={{ fontSize: 32 }} />,
      secondaryIcon: <InstagramIcon sx={{ fontSize: 24 }} />,
      tertiaryIcon: <FacebookIcon sx={{ fontSize: 24 }} />,
      bgColor: "#fff3e0",
      iconColor: "#ff9800",
      path: "/connected-platforms",
    },
    {
      id: 2,
      title: "2. Buat AI Agent",
      description: "Jawab pesan masuk dengan Agent AI anda",
      icon: <SmartToyIcon sx={{ fontSize: 32 }} />,
      bgColor: "#e8f5e9",
      iconColor: "#4caf50",
      path: "/ai-agents",
    },
    {
      id: 3,
      title: "3. Undang Agen Manusia",
      description: "Undang tim Anda untuk membantu menjawab chat",
      icon: <GroupAddIcon sx={{ fontSize: 32 }} />,
      bgColor: "#e3f2fd",
      iconColor: "#2196f3",
      path: "/team",
    },
    {
      id: 4,
      title: "4. Konek AI Agent ke Inbox",
      description: "Hubungkan AI Agent dan Human Agent ke Platform",
      icon: <LinkIcon sx={{ fontSize: 32 }} />,
      bgColor: "#e8eaf6",
      iconColor: "#3f51b5",
      path: "/inbox",
    },
  ]

  // Filter tickets based on search term
  const filteredTickets = tickets.filter(
    (ticket) =>
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.agent.toLowerCase().includes(searchTerm.toLowerCase()),
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
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: { xs: 0, md: "60px" }, display: "flex", flexDirection: { xs: "column", md: "row" } }}>
        {/* Ticket List Section */}
        <Paper
          className="ticket-list-paper"
          sx={{
            width: { xs: "100%", md: "350px" },
            height: { xs: "auto", md: "100vh" },
            maxHeight: { xs: "400px", md: "100vh" },
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
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: 2,
              borderBottom: "1px solid",
              borderColor: alpha("#000", 0.08),
              bgcolor: "white",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
              Inbox
            </Typography>

            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton
                size="small"
                sx={{
                  color: "#3f51b5",
                  "&:hover": { bgcolor: alpha("#3f51b5", 0.1) },
                }}
              >
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton
                size="small"
                sx={{
                  ml: 1,
                  color: "#3f51b5",
                  "&:hover": { bgcolor: alpha("#3f51b5", 0.1) },
                }}
              >
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>

          {/* Search and Filter */}
          <Box
            sx={{
              p: 2,
              display: "flex",
              alignItems: "center",
              gap: 1,
              bgcolor: "white",
              borderBottom: "1px solid",
              borderColor: alpha("#000", 0.08),
            }}
          >
            <TextField
              placeholder="Cari tiket..."
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
            <IconButton
              size="small"
              sx={{
                bgcolor: alpha("#3f51b5", 0.1),
                color: "#3f51b5",
                "&:hover": { bgcolor: alpha("#3f51b5", 0.2) },
              }}
            >
              <FilterListIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Agent Filter */}
          <Box
            sx={{
              p: 2,
              bgcolor: "white",
              borderBottom: "1px solid",
              borderColor: alpha("#000", 0.08),
            }}
          >
            <FormControl fullWidth size="small">
              <InputLabel id="agent-select-label">Filter by Agent</InputLabel>
              <Select
                labelId="agent-select-label"
                id="agent-select"
                // value={selectedAgent}
                value={getInitials(selectedAgent)}
                onChange={handleChange}
                label="Filter by Agent"
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: alpha("#000", 0.1),
                  },
                }}
              >
                <MenuItem value="">All Agents</MenuItem>
                <MenuItem value="Abang Benerin">Abang Benerin</MenuItem>
                <MenuItem value="Wahyu">Wahyu</MenuItem>
                <MenuItem value="Hihi">Hihi</MenuItem>
                <MenuItem value="Haha">Haha</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Tabs */}
          <Box sx={{ bgcolor: "white" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "text.secondary",
                },
                "& .Mui-selected": {
                  color: "#3f51b5",
                  fontWeight: "bold",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#3f51b5",
                  height: "3px",
                },
              }}
            >
              <Tab label="Assigned" />
              <Tab label="Unassigned" />
            </Tabs>
          </Box>

          {/* Ticket Count */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              bgcolor: alpha("#3f51b5", 0.03),
              borderBottom: "1px solid",
              borderColor: alpha("#000", 0.08),
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: "medium", color: "#3f51b5" }}>
              {tabValue === 0 ? "Assigned Tickets" : "Unassigned Tickets"}
            </Typography>
            <Chip
              label={tabValue === 0 ? filteredTickets.length : "0"}
              size="small"
              sx={{
                bgcolor: alpha("#3f51b5", 0.1),
                color: "#3f51b5",
                fontWeight: "bold",
                height: "24px",
              }}
            />
          </Box>

          {/* Ticket List */}
          {tabValue === 0 && (
            <Box>
              {filteredTickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  sx={{
                    m: 1.5,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.3s ease, transform 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      transform: "translateY(-2px)",
                    },
                    borderLeft: `4px solid ${statusColors[ticket.status]}`,
                    position: "relative",
                    cursor: "pointer",
                  }}
                  onClick={() => handleTicketClick(ticket.name)}
                >
                  <CardContent sx={{ p: "12px !important" }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                      <Typography sx={{ fontWeight: "bold", fontSize: "14px" }}>{ticket.name}</Typography>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        <AccessTimeIcon sx={{ fontSize: "0.8rem", color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {ticket.time}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "13px", mb: 1.5, overflow: "hidden", textOverflow: "ellipsis" }}
                    >
                      {ticket.message}
                    </Typography>

                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            width: 24,
                            height: 24,
                            bgcolor: ticket.agentColor,
                            fontSize: "12px",
                          }}
                        >
                          {ticket.agentInitial}
                        </Avatar>
                        <Typography variant="body2" sx={{ ml: 1, fontSize: "12px" }}>
                          {ticket.agent}
                        </Typography>
                      </Box>

                      <Chip
                        label={ticket.status}
                        size="small"
                        sx={{
                          height: "20px",
                          fontSize: "10px",
                          bgcolor: alpha(statusColors[ticket.status], 0.1),
                          color: statusColors[ticket.status],
                          fontWeight: "bold",
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: alpha("#3f51b5", 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ViewListIcon sx={{ fontSize: 40, color: "#3f51b5" }} />
              </Box>
              <Typography variant="body1" sx={{ fontWeight: "medium", color: "#3f51b5" }}>
                Tidak ada tiket yang belum ditugaskan
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Semua tiket telah ditugaskan ke agen. Periksa tab "Assigned" untuk melihat tiket yang ada.
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Welcome Screen / Right Panel */}
        <Box sx={{ flexGrow: 1, p: 3, overflow: "auto", width: { xs: "100%", md: "auto" } }}>
          {/* Header */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#3f51b5", mb: 0.5 }}>
                Dashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Selamat datang di platform customer service Anda
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              {isMobileView && (
                <IconButton
                  sx={{ mr: 1, display: { xs: "flex", md: "none" } }}
                  onClick={() => document.querySelector(".ticket-list-paper").scrollIntoView({ behavior: "smooth" })}
                >
                  <ViewListIcon />
                </IconButton>
              )}
              <Badge badgeContent={3} color="primary">
                <Chip
                  icon={<PersonIcon />}
                  label="Agen Aktif"
                  sx={{ bgcolor: alpha("#3f51b5", 0.1), color: "#3f51b5" }}
                />
              </Badge>
            </Box>
          </Box>

          {/* Feature Cards */}
          <Grid container spacing={2}>
            {featureCards.map((card) => (
              <Grid item xs={12} sm={6} md={6} key={card.id}>
                <Paper
                  sx={{
                    p: 3,
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    transition: "box-shadow 0.3s ease, transform 0.2s ease",
                    "&:hover": {
                      boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      transform: "translateY(-4px)",
                    },
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 3,
                    height: "100%",
                  }}
                  onClick={() => navigate(card.path)}
                >
                  <Box
                    sx={{
                      width: 64,
                      height: 64,
                      borderRadius: "12px",
                      bgcolor: card.bgColor,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                    }}
                  >
                    <Box sx={{ color: card.iconColor }}>{card.icon}</Box>
                    {card.secondaryIcon && (
                      <Box
                        sx={{
                          position: "absolute",
                          bottom: -6,
                          right: -6,
                          bgcolor: alpha(card.iconColor, 0.2),
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: card.iconColor,
                        }}
                      >
                        {card.secondaryIcon}
                      </Box>
                    )}
                    {card.tertiaryIcon && (
                      <Box
                        sx={{
                          position: "absolute",
                          top: -6,
                          right: -6,
                          bgcolor: alpha(card.iconColor, 0.2),
                          borderRadius: "50%",
                          width: 28,
                          height: 28,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: card.iconColor,
                        }}
                      >
                        {card.tertiaryIcon}
                      </Box>
                    )}
                  </Box>
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5" }}>
                      {card.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Stats Cards */}
          <Typography variant="h6" sx={{ fontWeight: "bold", mt: 4, mb: 2, color: "#3f51b5" }}>
            Statistik Tiket
          </Typography>

          <Grid container spacing={2}>
            {Object.entries(statusColors).map(([status, color]) => (
              <Grid item xs={6} sm={3} key={status}>
                <Paper
                  sx={{
                    p: 2,
                    borderRadius: "12px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    borderTop: `4px solid ${color}`,
                  }}
                >
                  <Typography variant="h4" sx={{ fontWeight: "bold", color }}>
                    {status === "Active" ? "8" : status === "Pending" ? "5" : status === "Closed" ? "12" : "3"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tiket {status}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Tutorial Link */}
          <Paper
            sx={{
              p: 3,
              mt: 4,
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              bgcolor: alpha("#3f51b5", 0.05),
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ bgcolor: "#f44336" }}>
              <YouTubeIcon />
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                Butuh bantuan lebih?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Lihat tutorial lengkap di kanal YouTube kami
              </Typography>
            </Box>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#3f51b5",
                "&:hover": { bgcolor: "#303f9f" },
                borderRadius: "8px",
                width: { xs: "100%", sm: "auto" },
                mt: { xs: 2, sm: 0 },
              }}
            >
              Tonton Sekarang
            </Button>
          </Paper>
        </Box>
      </Box>

      {/* Chat Modal */}
      <ChatModal open={openModal} onClose={handleCloseModal} to={chatTo} />
    </Box>
  )
}

export default Dashboard