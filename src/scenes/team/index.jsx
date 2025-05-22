import React, { useState } from "react";
import {
  Box,
  Typography,
  Tab,
  Tabs,
  Avatar,
  Badge,
  Button,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Modal,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import FilterListIcon from "@mui/icons-material/FilterList";
import AddIcon from "@mui/icons-material/Add";
import ViewListIcon from "@mui/icons-material/ViewList";
import RefreshIcon from "@mui/icons-material/Refresh";

import Sidebar from "../global/Sidebar";

const Header = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "0 16px",
  height: "60px",
  backgroundColor: "#fff",
  borderBottom: "1px solid #e0e0e0",
}));

const SearchBar = styled(Box)(() => ({
  display: "flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: "4px",
  backgroundColor: "#f5f5f5",
  border: "1px solid #e0e0e0",
}));

const StyledBadge = styled(Badge)(() => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      content: '""',
    },
  },
}));

const TicketItem = ({ children, onClick }) => (
  <Box
    sx={{
      p: 2,
      borderBottom: "1px solid #eee",
      position: "relative",
      cursor: "pointer",
      "&:hover": { backgroundColor: "#f5f5f5" },
    }}
    onClick={onClick}
  >
    {children}
  </Box>
);

const StatusBadge = ({ status, children }) => (
  <Box
    sx={{
      position: "absolute",
      top: "12px",
      right: "16px",
      bgcolor: status === "Pending" ? "#fff8e1" : "#e8f5e9",
      px: 1,
      borderRadius: 1,
    }}
  >
    <Typography
      variant="body2"
      sx={{
        fontSize: "12px",
        color: status === "Pending" ? "#ff8f00" : "#2e7d32",
      }}
    >
      {children}
    </Typography>
  </Box>
);

const TicketTime = ({ children }) => (
  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "12px" }}>
    {children}
  </Typography>
);

const chatData = {
  "Ab Teguh Ardiansyah": [
    {
      sender: "Ab Teguh Ardiansyah",
      message: "Kak, Sepertinya ini ada masalah dengan produknya",
      time: "13:38",
    },
    {
      sender: "Abang Benerin",
      message: "Bisa dijelaskan lebih detail?",
      time: "13:39",
    },
    {
      sender: "Ab Teguh Ardiansyah",
      message: "Produk datang dalam keadaan rusak",
      time: "13:40",
    },
  ],
  "ABANG BENERIN": [
    {
      sender: "ABANG BENERIN",
      message: "This message is currently being processed",
      time: "13:37",
    },
  ],
  // Tambahkan data chat lainnya...
};

const WelcomeCard = styled(Box)(() => ({
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "16px",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
}));

const FeatureCard = styled(Box)(() => ({
  backgroundColor: "#fff",
  borderRadius: "8px",
  padding: "20px",
  marginBottom: "16px",
  display: "flex",
  alignItems: "center",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  cursor: "pointer",
  "&:hover": {
    boxShadow: "0 2px 5px rgba(0,0,0,0.15)",
  },
}));

const FeatureIcon = styled(Box)(() => ({
  borderRadius: "8px",
  width: "48px",
  height: "48px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginRight: "16px",
}));

// Modal style
const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Team = () => {
  const [openModal, setOpenModal] = useState(false);
  const [currentChat, setCurrentChat] = useState([]);
  const [currentUser, setCurrentUser] = useState("");
  const [tabValue, setTabValue] = useState(0);
  // const [selectedTicket, setSelectedTicket] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(""); // State untuk menyimpan nilai yang dipilih

  const handleTicketClick = (user) => {
    setCurrentUser(user);
    setCurrentChat(chatData[user] || []);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleChange = (event) => {
    setSelectedAgent(event.target.value); // Update state saat memilih
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <Box sx={{ display: "flex", backgroundColor: "#f5f7fa", height: "100vh" }}>
      {/* Left Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <Box sx={{ flexGrow: 1, ml: "60px", display: "flex" }}>
        {/* Ticket List Section */}
        <Box
          sx={{
            width: "350px",
            borderRight: "1px solid #e0e0e0",
            height: "100vh",
            overflow: "auto",
          }}
        >
          {/* Header */}
          <Header>
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="agent-select-label">All Agent</InputLabel>
              <Select
                labelId="agent-select-label"
                id="agent-select"
                value={selectedAgent} // Nilai yang dipilih
                onChange={handleChange} // Handler saat memilih
                label="Agent"
                sx={{
                  "& .MuiSelect-select": {
                    padding: "8px 32px 8px 12px",
                    fontSize: "14px",
                  },
                }}
              >
                <MenuItem value="all agent">All Agent</MenuItem>
                <MenuItem value="wahyu">Wahyu</MenuItem>
                <MenuItem value="hihi">hihi</MenuItem>
                <MenuItem value="haha">Haha</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <IconButton size="small" sx={{ ml: 1 }}>
                <FilterListIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ ml: 1 }}>
                <AddIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ ml: 1 }}>
                <ViewListIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" sx={{ ml: 1 }}>
                <RefreshIcon fontSize="small" />
              </IconButton>
            </Box>
          </Header>

          {/* Tabs */}
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                "& .MuiTab-root": { textTransform: "none", fontSize: "14px" },
              }}
            >
              <Tab label="Assigned" />
              <Tab label="Unassigned" />
            </Tabs>
          </Box>

          {tabValue === 0 && (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  p: 1,
                  bgcolor: "#f9f9f9",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  Assigned
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  658
                </Typography>
              </Box>

              {/* Ticket Items */}
              <TicketItem
                onClick={() => handleTicketClick("Ab Teguh Ardiansyah")}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                    Ab Teguh Ardiansyah
                  </Typography>
                  <TicketTime>13:38</TicketTime>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "13px" }}
                >
                  Kak, Sepertinya ini ada...
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: "#4caf50",
                      fontSize: "12px",
                    }}
                  >
                    A
                  </Avatar>
                  <Typography variant="body2" sx={{ ml: 1, fontSize: "13px" }}>
                    Abang Benerin
                  </Typography>
                </Box>
                <StatusBadge status="Pending">Pending</StatusBadge>
              </TicketItem>

              {/* Ticket lainnya... */}
              <TicketItem onClick={() => handleTicketClick("ABANG BENERIN")}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mb: 1,
                  }}
                >
                  <Typography sx={{ fontWeight: 500, fontSize: "14px" }}>
                    ABANG BENERIN
                  </Typography>
                  <TicketTime>13:37</TicketTime>
                </Box>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "13px" }}
                >
                  This message is currently...
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  <Avatar
                    sx={{
                      width: 24,
                      height: 24,
                      bgcolor: "#2196f3",
                      fontSize: "12px",
                    }}
                  >
                    A
                  </Avatar>
                  <Typography variant="body2" sx={{ ml: 1, fontSize: "13px" }}>
                    Agent
                  </Typography>
                </Box>
                <StatusBadge status="Active">Active</StatusBadge>
              </TicketItem>
            </Box>
          )}

          {tabValue === 1 && (
            <Box sx={{ p: 2 }}>
              <Typography variant="body2" color="text.secondary">
                No unassigned tickets
              </Typography>
            </Box>
          )}
        </Box>

        {/* Welcome Screen / Right Panel */}
        <Box sx={{ flexGrow: 1, p: 3, bgcolor: "#f5f7fa" }}>
          {/* Feature Cards */}
          <FeatureCard>
            <FeatureIcon sx={{ bgcolor: "#fff3e0" }}>
              <Box
                component="img"
                src="/path-to-image.png" // Update with the actual path
                alt="Crown"
                sx={{ width: 32, height: 32 }}
              />
            </FeatureIcon>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "16px" }}
              >
                1. Hubungkan Platform
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Mulai terima pesan dari Whatsapp, IG, dan FB Anda!
              </Typography>
            </Box>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon sx={{ bgcolor: "#e8f5e9" }}>
              <Box
                component="img"
                src="/path-to-image.png" // Update with the actual path
                alt="AI Robot"
                sx={{ width: 32, height: 32 }}
              />
            </FeatureIcon>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "16px" }}
              >
                2. Buat AI Agent
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Jawab pesan masuk dengan Agent AI anda
              </Typography>
            </Box>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon sx={{ bgcolor: "#e3f2fd" }}>
              <Box
                component="img"
                src="/path-to-image.png" // Update with the actual path
                alt="People"
                sx={{ width: 32, height: 32 }}
              />
            </FeatureIcon>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "16px" }}
              >
                3. Undang Agen Manusia
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Undang tim Anda untuk membantu menjawab chat
              </Typography>
            </Box>
          </FeatureCard>

          <FeatureCard>
            <FeatureIcon sx={{ bgcolor: "#e8eaf6" }}>
              <Box
                component="img"
                src="/path-to-image.png" // Update with the actual path
                alt="Link"
                sx={{ width: 32, height: 32 }}
              />
            </FeatureIcon>
            <Box>
              <Typography
                variant="h6"
                sx={{ fontWeight: 500, fontSize: "16px" }}
              >
                4. Konek AI Agent ke Inbox
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hubungkan AI Agent dan Human Agent ke Platform
              </Typography>
            </Box>
          </FeatureCard>

          <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
            <Button
              variant="text"
              color="primary"
              sx={{
                textTransform: "none",
                fontSize: "14px",
              }}
            >
              Butuh bantuan lebih? Lihat Tutorial Youtube kami
            </Button>
          </Box>
        </Box>
      </Box>

      {/* Chat Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="chat-modal-title"
      >
        <Box sx={modalStyle}>
          <Typography
            id="chat-modal-title"
            variant="h6"
            component="h2"
            sx={{ mb: 2 }}
          >
            Chat with {currentUser}
          </Typography>
          <Box sx={{ maxHeight: 300, overflowY: "auto", mb: 2 }}>
            {currentChat.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  mb: 1,
                  p: 1,
                  bgcolor: msg.sender === currentUser ? "#f5f5f5" : "#e3f2fd",
                  borderRadius: 1,
                }}
              >
                <Typography
                  variant="body2"
                  sx={{ fontWeight: 500, fontSize: "14px" }}
                >
                  {msg.sender}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: "14px" }}>
                  {msg.message}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ fontSize: "12px", color: "text.secondary" }}
                >
                  {msg.time}
                </Typography>
              </Box>
            ))}
          </Box>
          <Button variant="contained" onClick={handleCloseModal} fullWidth>
            Close
          </Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default Team;
