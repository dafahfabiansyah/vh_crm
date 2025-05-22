"use client"

import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Badge,
  Button,
  alpha,
  Tooltip,
  Paper,
  Chip,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import HelpOutlineIcon from "@mui/icons-material/HelpOutline"
import PersonIcon from "@mui/icons-material/Person"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import LogoutIcon from "@mui/icons-material/Logout"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import SettingsIcon from "@mui/icons-material/Settings"
import NotificationsIcon from "@mui/icons-material/Notifications"
import TimerIcon from "@mui/icons-material/Timer"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { logout } from "../../redux/authSlice"

// Styled Badge for online status
const StyledBadge = ({ children }) => (
  <Badge
    overlap="circular"
    anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    variant="dot"
    sx={{
      "& .MuiBadge-badge": {
        backgroundColor: "#44b700",
        color: "#44b700",
        boxShadow: `0 0 0 2px white`,
        "&::after": {
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          animation: "ripple 1.2s infinite ease-in-out",
          border: "1px solid currentColor",
          content: '""',
        },
      },
      "@keyframes ripple": {
        "0%": {
          transform: "scale(.8)",
          opacity: 1,
        },
        "100%": {
          transform: "scale(2.4)",
          opacity: 0,
        },
      },
    }}
  >
    {children}
  </Badge>
)

const Topbar = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const mobileMenuOpen = Boolean(mobileMenuAnchorEl)
  const dispatch = useDispatch()

  // Get authentication status directly from Redux store
  const { isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleMobileMenuClick = (event) => {
    setMobileMenuAnchorEl(event.currentTarget)
  }

  const handleMobileMenuClose = () => {
    setMobileMenuAnchorEl(null)
  }

  const handleLogout = () => {
    // Dispatch logout action from our Redux slice
    dispatch(logout())
    handleClose()
    handleMobileMenuClose()
    navigate("/login")
  }

  const userName = localStorage.getItem("user_name") || "John Doe"
  const userEmail = localStorage.getItem("user_email") || "john.doe@example.com"
  const userType = localStorage.getItem("user_type") || "business" // default "free", bisa diganti sesuai backend

  // Get user initials for avatar
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
  }

  // Get color based on user type
  const getUserTypeColor = (type) => {
    switch (type.toLowerCase()) {
      case "free":
        return { bg: "#4caf50", light: alpha("#4caf50", 0.1) }
      case "business":
        return { bg: "#3f51b5", light: alpha("#3f51b5", 0.1) }
      case "premium":
        return { bg: "#f44336", light: alpha("#f44336", 0.1) }
      default:
        return { bg: "#9e9e9e", light: alpha("#9e9e9e", 0.1) }
    }
  }

  const userTypeColor = getUserTypeColor(userType)

  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        py: 1.5,
        px: { xs: 2, sm: 3 },
        borderBottom: "1px solid",
        borderColor: alpha("#000", 0.08),
        backgroundColor: "#fff",
        position: "sticky",
        top: 0,
        zIndex: 500,
        borderRadius: 0,
      }}
    >
      {/* Left side buttons - Desktop & Tablet */}
      {!isMobile && (
        <Box sx={{ display: "flex", alignItems: "center", flexWrap: { xs: "wrap", md: "nowrap" } }}>
          <Button
            variant="contained"
            startIcon={<TimerIcon />}
            sx={{
              ml: { xs: 0, md: 7 },
              mr: 2,
              mb: { xs: isTablet ? 1 : 0, md: 0 },
              borderRadius: "8px",
              fontSize: "13px",
              textTransform: "none",
              backgroundColor: "#3f51b5",
              "&:hover": { backgroundColor: "#303f9f" },
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              height: 36,
              whiteSpace: "nowrap",
              order: { xs: isTablet ? 3 : 1, md: 1 },
              flexGrow: { xs: isTablet ? 1 : 0, md: 0 },
            }}
          >
            Paket business Anda berakhir dalam 35 hari
          </Button>

          <Button
            variant="outlined"
            startIcon={<HelpOutlineIcon />}
            sx={{
              mr: 2,
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "13px",
              color: "#3f51b5",
              borderColor: alpha("#3f51b5", 0.3),
              "&:hover": {
                borderColor: "#3f51b5",
                backgroundColor: alpha("#3f51b5", 0.05),
              },
              height: 36,
              order: { xs: 1, md: 2 },
            }}
          >
            Help Center
          </Button>

          <Button
            variant="outlined"
            startIcon={<WhatsAppIcon />}
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontSize: "13px",
              color: "#25D366",
              borderColor: alpha("#25D366", 0.3),
              "&:hover": {
                borderColor: "#25D366",
                backgroundColor: alpha("#25D366", 0.05),
              },
              height: 36,
              order: { xs: 2, md: 3 },
            }}
          >
            WA Support
          </Button>
        </Box>
      )}

      {/* Right side user info */}
      <Box sx={{ display: "flex", alignItems: "center", ml: isMobile ? "auto" : 0 }}>
        {/* Notification icon */}
        <Tooltip title="Notifications">
          <IconButton
            sx={{
              mr: 2,
              bgcolor: alpha("#000", 0.03),
              "&:hover": { bgcolor: alpha("#000", 0.08) },
            }}
          >
            <Badge badgeContent={3} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>

        {/* Online status - Hide on mobile */}
        {!isMobile && (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mr: 2,
              px: 1.5,
              py: 0.5,
              borderRadius: "20px",
              bgcolor: alpha("#44b700", 0.1),
            }}
          >
            <StyledBadge>
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: "#44b700",
                  color: "white",
                }}
              >
                <PersonIcon />
              </Avatar>
            </StyledBadge>
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "13px", ml: 1, color: "#44b700" }}>
              {isAuthenticated ? "Online" : "Offline"}
            </Typography>
          </Box>
        )}

        {/* User profile - Desktop */}
        {!isMobile ? (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              minWidth: 180,
              pr: 1,
              cursor: "pointer",
              "&:hover": { bgcolor: alpha("#000", 0.03) },
              borderRadius: "8px",
              px: 1.5,
              py: 0.5,
              transition: "background 0.2s",
            }}
            onClick={handleClick}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: userTypeColor.bg,
                color: "white",
                mr: 1.5,
                fontWeight: "bold",
              }}
            >
              {getInitials(userName)}
            </Avatar>

            <Box sx={{ mr: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 600,
                    fontSize: "14px",
                    whiteSpace: "nowrap",
                    maxWidth: 150,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                  title={userName}
                >
                  {userName}
                </Typography>
                <Chip
                  label={userType}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: "0.7rem",
                    bgcolor: userTypeColor.light,
                    color: userTypeColor.bg,
                    fontWeight: "bold",
                    textTransform: "capitalize",
                  }}
                />
              </Box>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                  maxWidth: 180,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "block",
                }}
                title={userEmail}
              >
                {userEmail}
              </Typography>
            </Box>

            <IconButton size="small" sx={{ ml: 0.5, p: 0.5 }}>
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
        ) : (
          // Mobile user avatar with menu
          <IconButton onClick={handleMobileMenuClick}>
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: userTypeColor.bg,
                color: "white",
                fontWeight: "bold",
              }}
            >
              {getInitials(userName)}
            </Avatar>
          </IconButton>
        )}

        {/* User menu - Desktop */}
        <Menu
          anchorEl={anchorEl}
          id="account-menu"
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                mt: 1.5,
                minWidth: 220,
                borderRadius: "12px",
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1.5,
                  borderRadius: "8px",
                  mx: 1,
                  my: 0.5,
                  "&:hover": {
                    bgcolor: alpha("#3f51b5", 0.05),
                  },
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 3, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {userEmail}
            </Typography>
          </Box>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleClose}>
            <AccountCircleIcon sx={{ mr: 2, fontSize: 20, color: "#3f51b5" }} />
            <Typography>Profil Saya</Typography>
          </MenuItem>

          <MenuItem onClick={handleClose}>
            <SettingsIcon sx={{ mr: 2, fontSize: 20, color: "#3f51b5" }} />
            <Typography>Pengaturan</Typography>
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout} sx={{ color: "#f44336" }}>
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography fontWeight="medium">Logout</Typography>
          </MenuItem>
        </Menu>

        {/* Mobile menu */}
        <Menu
          anchorEl={mobileMenuAnchorEl}
          id="mobile-menu"
          open={mobileMenuOpen}
          onClose={handleMobileMenuClose}
          slotProps={{
            paper: {
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.15))",
                mt: 1.5,
                borderRadius: "12px",
                minWidth: 200,
                "& .MuiMenuItem-root": {
                  px: 2,
                  py: 1.5,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <Box sx={{ px: 3, py: 1.5 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: "bold", color: "#3f51b5" }}>
              {userName}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {userEmail}
            </Typography>
            <Chip
              label={userType}
              size="small"
              sx={{
                mt: 1,
                height: 20,
                fontSize: "0.7rem",
                bgcolor: userTypeColor.light,
                color: userTypeColor.bg,
                fontWeight: "bold",
                textTransform: "capitalize",
                display: "block",
              }}
            />
          </Box>

          <Divider sx={{ my: 1 }} />

          <MenuItem
            onClick={() => {
              handleMobileMenuClose()
              navigate("/profile")
            }}
          >
            <AccountCircleIcon sx={{ mr: 2, fontSize: 20, color: "#3f51b5" }} />
            <Typography>Profil Saya</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMobileMenuClose()
              navigate("/settings")
            }}
          >
            <SettingsIcon sx={{ mr: 2, fontSize: 20, color: "#3f51b5" }} />
            <Typography>Pengaturan</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMobileMenuClose()
              window.open("https://wa.me/yourwhatsappnumber", "_blank")
            }}
          >
            <WhatsAppIcon sx={{ mr: 2, fontSize: 20, color: "#25D366" }} />
            <Typography>WA Support</Typography>
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMobileMenuClose()
              navigate("/help")
            }}
          >
            <HelpOutlineIcon sx={{ mr: 2, fontSize: 20, color: "#3f51b5" }} />
            <Typography>Help Center</Typography>
          </MenuItem>

          <Divider sx={{ my: 1 }} />

          <MenuItem onClick={handleLogout} sx={{ color: "#f44336" }}>
            <LogoutIcon sx={{ mr: 2, fontSize: 20 }} />
            <Typography>Logout</Typography>
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  )
}

export default Topbar
