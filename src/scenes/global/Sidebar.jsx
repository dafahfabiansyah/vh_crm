"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Avatar,
  IconButton,
  Tooltip,
  Typography,
  alpha,
  Badge,
  Drawer,
  useMediaQuery,
  useTheme,
  Fab,
} from "@mui/material"
import ContactsIcon from "@mui/icons-material/Contacts"
import DashboardIcon from "@mui/icons-material/Dashboard"
import GroupIcon from "@mui/icons-material/Group"
import SettingsIcon from "@mui/icons-material/Settings"
import SmartToyIcon from "@mui/icons-material/SmartToy"
import AssignmentIcon from "@mui/icons-material/Assignment"
import WhatsAppIcon from "@mui/icons-material/WhatsApp"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import { useNavigate, useLocation } from "react-router-dom"

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [expanded, setExpanded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile drawer when navigating
  useEffect(() => {
    if (mobileOpen) {
      setMobileOpen(false)
    }
  }, [location.pathname])

  // Navigation items
  const navItems = [
    {
      title: "Dashboard",
      icon: <DashboardIcon />,
      path: "/",
      active: location.pathname === "/",
    },
    // {
    //   title: "Inbox",
    //   icon: <MessageIcon />,
    //   path: "/inbox",
    //   active: location.pathname === "/inbox",
    //   badge: 5,
    // },
    {
      title: "Tickets",
      icon: <AssignmentIcon />,
      path: "/ticket",
      active: location.pathname === "/ticket",
      badge: 2,
    },
    {
      title: "Contacts",
      icon: <ContactsIcon />,
      path: "/contact",
      active: location.pathname === "/contact",
    },
    {
      title: "Platforms",
      icon: <WhatsAppIcon />,
      path: "/connected-platforms",
      active: location.pathname === "/connected-platforms",
    },
    {
      title: "AI Agents",
      icon: <SmartToyIcon />,
      path: "/ai-agents",
      active: location.pathname === "/ai-agents",
    },
    {
      title: "Team",
      icon: <GroupIcon />,
      path: "/human-agent",
      active: location.pathname === "/human-agent",
    },
  ]

  // Settings at the bottom
  const bottomItems = [
    {
      title: "Settings",
      icon: <SettingsIcon />,
      path: "/settings",
      active: location.pathname === "/settings",
    },
  ]

  // Sidebar content - shared between desktop and mobile
  const sidebarContent = (
    <>
      {/* Company Logo/Avatar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: expanded || isMobile ? "flex-start" : "center",
          width: "100%",
          px: expanded || isMobile ? 3 : 0,
          mb: 4,
          mt: isMobile ? 2 : 0,
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#3f51b5",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          T
        </Avatar>
        {(expanded || isMobile) && (
          <Typography
            variant="subtitle1"
            sx={{
              ml: 2,
              fontWeight: "bold",
              color: "#3f51b5",
              whiteSpace: "nowrap",
              opacity: expanded || isMobile ? 1 : 0,
              transition: "opacity 0.3s ease",
            }}
          >
            Tumbuhin
          </Typography>
        )}

        {/* Close button for mobile */}
        {isMobile && (
          <IconButton
            onClick={() => setMobileOpen(false)}
            sx={{
              ml: "auto",
              color: alpha("#000", 0.6),
            }}
          >
            <CloseIcon />
          </IconButton>
        )}
      </Box>

      {/* Navigation Items */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          flexGrow: 1,
          overflowY: "auto",
          "&::-webkit-scrollbar": {
            width: "4px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            background: alpha("#000", 0.1),
            borderRadius: "2px",
          },
        }}
      >
        {navItems.map((item, index) => (
          <Tooltip key={index} title={expanded || isMobile ? "" : item.title} placement="right">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: expanded || isMobile ? "flex-start" : "center",
                width: "100%",
                px: expanded || isMobile ? 3 : 0,
                py: 1,
                mb: 0.5,
                cursor: "pointer",
                position: "relative",
                "&::before": item.active
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "60%",
                      bgcolor: "#3f51b5",
                      borderRadius: "0 4px 4px 0",
                    }
                  : {},
                "&:hover": {
                  bgcolor: alpha("#3f51b5", 0.05),
                },
                bgcolor: item.active ? alpha("#3f51b5", 0.1) : "transparent",
                transition: "background-color 0.2s ease",
              }}
              onClick={() => navigate(item.path)}
            >
              <IconButton
                sx={{
                  color: item.active ? "#3f51b5" : alpha("#000", 0.6),
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                  p: 1,
                }}
              >
                {item.badge ? (
                  <Badge
                    badgeContent={item.badge}
                    color="error"
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: "0.6rem",
                        height: 16,
                        minWidth: 16,
                      },
                    }}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </IconButton>
              {(expanded || isMobile) && (
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    fontWeight: item.active ? "bold" : "medium",
                    color: item.active ? "#3f51b5" : "text.primary",
                    whiteSpace: "nowrap",
                    opacity: expanded || isMobile ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {item.title}
                  {item.badge && (
                    <Box
                      component="span"
                      sx={{
                        ml: 1,
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        bgcolor: "#f44336",
                        color: "white",
                        borderRadius: "50%",
                        width: 18,
                        height: 18,
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                      }}
                    >
                      {item.badge}
                    </Box>
                  )}
                </Typography>
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>

      {/* Bottom Items (Settings) */}
      <Box sx={{ width: "100%", mt: 2 }}>
        {bottomItems.map((item, index) => (
          <Tooltip key={index} title={expanded || isMobile ? "" : item.title} placement="right">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: expanded || isMobile ? "flex-start" : "center",
                width: "100%",
                px: expanded || isMobile ? 3 : 0,
                py: 1,
                cursor: "pointer",
                position: "relative",
                "&::before": item.active
                  ? {
                      content: '""',
                      position: "absolute",
                      left: 0,
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "4px",
                      height: "60%",
                      bgcolor: "#3f51b5",
                      borderRadius: "0 4px 4px 0",
                    }
                  : {},
                "&:hover": {
                  bgcolor: alpha("#3f51b5", 0.05),
                },
                bgcolor: item.active ? alpha("#3f51b5", 0.1) : "transparent",
                transition: "background-color 0.2s ease",
              }}
              onClick={() => navigate(item.path)}
            >
              <IconButton
                sx={{
                  color: item.active ? "#3f51b5" : alpha("#000", 0.6),
                  "&:hover": {
                    bgcolor: "transparent",
                  },
                  p: 1,
                }}
              >
                {item.icon}
              </IconButton>
              {(expanded || isMobile) && (
                <Typography
                  variant="body2"
                  sx={{
                    ml: 1,
                    fontWeight: item.active ? "bold" : "medium",
                    color: item.active ? "#3f51b5" : "text.primary",
                    whiteSpace: "nowrap",
                    opacity: expanded || isMobile ? 1 : 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  {item.title}
                </Typography>
              )}
            </Box>
          </Tooltip>
        ))}
      </Box>
    </>
  )

  // Mobile sidebar as drawer
  if (isMobile) {
    return (
      <>
        {/* Mobile menu button */}
        <Fab
          size="small"
          color="primary"
          aria-label="menu"
          onClick={() => setMobileOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 999,
            bgcolor: "#3f51b5",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <MenuIcon />
        </Fab>

        {/* Mobile drawer */}
        <Drawer
          anchor="left"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: 250,
              boxSizing: "border-box",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
            },
          }}
        >
          {sidebarContent}
        </Drawer>
      </>
    )
  }

  // Desktop sidebar
  return (
    <Box
      sx={{
        width: expanded ? "220px" : "70px",
        height: "100vh",
        backgroundColor: "#fff",
        borderRight: "1px solid",
        borderColor: alpha("#000", 0.08),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: "16px",
        paddingBottom: "16px",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        transition: "width 0.3s ease",
        boxShadow: "0 0 10px rgba(0,0,0,0.05)",
        overflow: "hidden",
        "&:hover": {
          width: "220px",
        },
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {sidebarContent}
    </Box>
  )
}

export default Sidebar