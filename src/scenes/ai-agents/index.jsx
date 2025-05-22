"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Paper,
  InputLabel,
  Grid,
  Chip,
  alpha,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
  useMediaQuery,
  useTheme,
  Fab,
} from "@mui/material"
import {
  Add as AddIcon,
  Settings as SettingsIcon,
  Delete as DeleteIcon,
  Close as CloseIcon,
  SmartToy as SmartToyIcon,
  SupportAgent as SupportAgentIcon,
  ShoppingCart as ShoppingCartIcon,
  Search as SearchIcon,
} from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { deleteAgentById, getAgents, createAgent, getRoles } from "../../service"
import Sidebar from "../global/Sidebar"

const AIAgents = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  // Get authentication token from Redux store
  const { token } = useSelector((state) => state.auth)

  // State to store AI agents
  const [agents, setAgents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")

  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [agentToDelete, setAgentToDelete] = useState(null)
  const [agentToDeleteName, setAgentToDeleteName] = useState("")

  // State for create new agent modal
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [newAgentName, setNewAgentName] = useState("")
  const [selectedTemplate, setSelectedTemplate] = useState("")
  const [nameError, setNameError] = useState("")
  const [isCreating, setIsCreating] = useState(false)

  // State for roles fetched from backend
  const [roles, setRoles] = useState([])
  const [rolesLoading, setRolesLoading] = useState(false)
  const [rolesError, setRolesError] = useState("")

  // Fetch agents from backend
  const fetchAgents = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await getAgents(token)
      setAgents(Array.isArray(data) ? data : data.data || [])
    } catch (err) {
      console.error("Error fetching agents:", err)
      setError("Failed to load AI agents. Please try again later.")
      setAgents([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAgents()
  }, [token])

  // Function to open create modal
  const handleOpenCreateModal = () => {
    setCreateModalOpen(true)
    setNewAgentName("")
    setSelectedTemplate("")
    setNameError("")
  }

  // Function to close create modal
  const handleCloseCreateModal = () => {
    setCreateModalOpen(false)
  }

  // Function to handle template selection
  const handleTemplateChange = (event) => {
    setSelectedTemplate(event.target.value)
  }

  // Function to handle name input
  const handleNameChange = (event) => {
    setNewAgentName(event.target.value)
    if (event.target.value.trim() === "") {
      setNameError("Name is required")
    } else {
      setNameError("")
    }
  }

  // Function to handle search input
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  // Fetch roles from backend when modal opened
  useEffect(() => {
    const fetchRoles = async () => {
      if (!createModalOpen) return

      try {
        setRolesLoading(true)
        setRolesError("")

        const data = await getRoles(token)

        // Parse the response properly
        const rolesData = Array.isArray(data) ? data : data.data || []

        // Filter to only show Customer Service AI and Sales AI
        const filteredRoles = rolesData.filter(
          (role) => role.name === "Customer Service AI" || role.name === "Sales AI",
        )

        // Set predefined roles if API returns empty array
        if (filteredRoles.length === 0) {
          setRoles([
            {
              id: "143d345a-80ad-4873-8ba5-9b44d5ba3f20",
              name: "Customer Service AI",
              description: "AI agent for customer support",
              created_at: "2025-05-17T13:53:48.158581Z",
              updated_at: "2025-05-17T13:53:48.158581Z",
            },
            {
              id: "90c7c5ba-39d6-40db-91b8-0f374fd960b6",
              name: "Sales AI",
              description: "AI agent for sales operations",
              created_at: "2025-05-17T13:53:48.158581Z",
              updated_at: "2025-05-17T13:53:48.158581Z",
            },
          ])
        } else {
          setRoles(filteredRoles)
        }
      } catch (error) {
        console.error("Error fetching roles:", error)
        setRolesError(error.message || "Failed to fetch roles")

        // Fallback to hardcoded data in case of error
        setRoles([
          {
            id: "143d345a-80ad-4873-8ba5-9b44d5ba3f20",
            name: "Customer Service AI",
            description: "AI agent for customer support",
            created_at: "2025-05-17T13:53:48.158581Z",
            updated_at: "2025-05-17T13:53:48.158581Z",
          },
          {
            id: "90c7c5ba-39d6-40db-91b8-0f374fd960b6",
            name: "Sales AI",
            description: "AI agent for sales operations",
            created_at: "2025-05-17T13:53:48.158581Z",
            updated_at: "2025-05-17T13:53:48.158581Z",
          },
        ])
      } finally {
        setRolesLoading(false)
      }
    }

    fetchRoles()
  }, [createModalOpen, token])

  // Function to create a new agent
  const handleCreateNewAgent = async () => {
    if (newAgentName.trim() === "") {
      setNameError("Name is required")
      return
    }
    const selectedTemplateData = roles.find((role) => role.id === selectedTemplate)

    try {
      setIsCreating(true)
      await createAgent(
        {
          name: newAgentName,
          role_name: selectedTemplateData ? selectedTemplateData.name : "",
          description: selectedTemplateData ? selectedTemplateData.description : "A newly created AI agent",
        },
        token,
      )
      await fetchAgents()
      handleCloseCreateModal()
    } catch (err) {
      setNameError(err.message || "Failed to create agent")
    } finally {
      setIsCreating(false)
    }
  }

  // Function to navigate to agent settings page
  const handleNavigateToSettings = (agentId) => {
    navigate(`/ai-agents/${agentId}`)
  }

  // Function to open delete confirmation dialog
  const handleOpenDeleteDialog = (agent, event) => {
    event.stopPropagation()
    setAgentToDelete(agent.id)
    setAgentToDeleteName(agent.name)
    setDeleteDialogOpen(true)
  }

  // Function to close delete confirmation dialog
  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false)
    setAgentToDelete(null)
    setAgentToDeleteName("")
  }

  // Function to delete an agent
  const handleDeleteAgent = async () => {
    if (agentToDelete) {
      try {
        await deleteAgentById(agentToDelete, token)
        // Refresh agents list after delete
        await fetchAgents()
      } catch (err) {
        // Optionally show error to user
        setError(err.message || "Failed to delete agent")
      } finally {
        handleCloseDeleteDialog()
      }
    }
  }

  // Get icon based on agent role
  const getAgentIcon = (agent) => {
    if (!agent.role || !agent.role.name) return <SmartToyIcon sx={{ fontSize: isMobile ? 30 : 40 }} />

    const roleName = agent.role.name.toLowerCase()
    if (roleName.includes("customer") || roleName.includes("service")) {
      return <SupportAgentIcon sx={{ fontSize: isMobile ? 30 : 40 }} />
    } else if (roleName.includes("sales")) {
      return <ShoppingCartIcon sx={{ fontSize: isMobile ? 30 : 40 }} />
    }
    return <SmartToyIcon sx={{ fontSize: isMobile ? 30 : 40 }} />
  }

  // Get color based on agent role
  const getAgentColor = (agent) => {
    if (!agent.role || !agent.role.name) return "#3f51b5"

    const roleName = agent.role.name.toLowerCase()
    if (roleName.includes("customer") || roleName.includes("service")) {
      return "#4caf50"
    } else if (roleName.includes("sales")) {
      return "#ff9800"
    }
    return "#3f51b5"
  }

  // Filter agents based on search term
  const filteredAgents = agents.filter(
    (agent) =>
      agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (agent.role && agent.role.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (agent.description && agent.description.toLowerCase().includes(searchTerm.toLowerCase())),
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
      <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: "70px" } }}>
        {/* Topbar */}
        {/* <Topbar /> */}

        {/* Content */}
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5", fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
            >
              AI Agents
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your AI agents to automate customer interactions and improve response times.
            </Typography>
          </Box>

          {/* Search and Actions */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              justifyContent: "space-between",
              alignItems: { xs: "stretch", sm: "center" },
              mb: 3,
              gap: 2,
            }}
          >
            <TextField
              placeholder="Search agents..."
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
              sx={{
                width: { xs: "100%", sm: 300 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                  bgcolor: alpha("#000", 0.03),
                  "& fieldset": {
                    border: "none",
                  },
                },
              }}
            />

            {!isMobile && (
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateModal}
                sx={{
                  bgcolor: "#3f51b5",
                  "&:hover": { bgcolor: "#303f9f" },
                  borderRadius: "8px",
                  px: 3,
                }}
              >
                Create New Agent
              </Button>
            )}
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Loading State */}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", py: 8 }}>
              <CircularProgress sx={{ color: "#3f51b5" }} />
            </Box>
          ) : (
            <>
              {/* Empty State */}
              {agents.length === 0 ? (
                <Paper
                  sx={{
                    p: { xs: 3, sm: 4 },
                    borderRadius: "12px",
                    textAlign: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: 300,
                  }}
                >
                  <Avatar
                    sx={{
                      bgcolor: alpha("#3f51b5", 0.1),
                      width: { xs: 60, sm: 80 },
                      height: { xs: 60, sm: 80 },
                      mb: 2,
                    }}
                  >
                    <SmartToyIcon sx={{ fontSize: { xs: 30, sm: 40 }, color: "#3f51b5" }} />
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    No AI Agents Yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                    Create your first AI agent to start automating customer interactions and improving response times.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={handleOpenCreateModal}
                    sx={{
                      bgcolor: "#3f51b5",
                      "&:hover": { bgcolor: "#303f9f" },
                      borderRadius: "8px",
                      px: 3,
                    }}
                  >
                    Create Your First Agent
                  </Button>
                </Paper>
              ) : (
                <>
                  {/* No Search Results */}
                  {filteredAgents.length === 0 && searchTerm !== "" ? (
                    <Paper
                      sx={{
                        p: { xs: 3, sm: 4 },
                        borderRadius: "12px",
                        textAlign: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        minHeight: 200,
                      }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                        No Results Found
                      </Typography>
                      <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                        No AI agents match your search for "{searchTerm}".
                      </Typography>
                      <Button
                        variant="outlined"
                        onClick={() => setSearchTerm("")}
                        sx={{
                          borderColor: "#3f51b5",
                          color: "#3f51b5",
                          "&:hover": { borderColor: "#303f9f", bgcolor: alpha("#3f51b5", 0.05) },
                          borderRadius: "8px",
                        }}
                      >
                        Clear Search
                      </Button>
                    </Paper>
                  ) : (
                    /* AI Agents Grid */
                    <Grid container spacing={2}>
                      {filteredAgents.map((agent) => (
                        <Grid item xs={12} sm={6} md={4} key={agent.id || agent.name}>
                          <Paper
                            onClick={() => handleNavigateToSettings(agent.id)}
                            sx={{
                              borderRadius: "12px",
                              overflow: "hidden",
                              height: "100%",
                              cursor: "pointer",
                              transition: "transform 0.2s ease, box-shadow 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                              },
                              display: "flex",
                              flexDirection: "column",
                              position: "relative",
                            }}
                          >
                            {/* Agent Header */}
                            <Box
                              sx={{
                                bgcolor: alpha(getAgentColor(agent), 0.1),
                                p: { xs: 2, sm: 3 },
                                display: "flex",
                                alignItems: "center",
                                borderBottom: "1px solid",
                                borderColor: alpha("#000", 0.05),
                              }}
                            >
                              <Avatar
                                sx={{
                                  bgcolor: alpha(getAgentColor(agent), 0.2),
                                  color: getAgentColor(agent),
                                  width: { xs: 40, sm: 48 },
                                  height: { xs: 40, sm: 48 },
                                  mr: 2,
                                }}
                              >
                                {getAgentIcon(agent)}
                              </Avatar>
                              <Box sx={{ flexGrow: 1 }}>
                                <Typography
                                  variant="h6"
                                  sx={{ fontWeight: "bold", mb: 0.5, fontSize: { xs: "1rem", sm: "1.25rem" } }}
                                >
                                  {agent.name}
                                </Typography>
                                {agent.role && (
                                  <Chip
                                    label={agent.role.name}
                                    size="small"
                                    sx={{
                                      height: 20,
                                      fontSize: "0.7rem",
                                      bgcolor: alpha(getAgentColor(agent), 0.1),
                                      color: getAgentColor(agent),
                                      fontWeight: "bold",
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>

                            {/* Agent Content */}
                            <Box sx={{ p: { xs: 2, sm: 3 }, flexGrow: 1 }}>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                {agent.description ||
                                  (agent.role && agent.role.description) ||
                                  "No description available"}
                              </Typography>

                              <Divider sx={{ my: 2 }} />

                              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <Typography variant="caption" color="text.secondary">
                                  Created: {new Date(agent.created_at).toLocaleDateString()}
                                </Typography>

                                <Box sx={{ display: "flex" }}>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleNavigateToSettings(agent.id)
                                    }}
                                    sx={{
                                      color: "#3f51b5",
                                      bgcolor: alpha("#3f51b5", 0.1),
                                      mr: 1,
                                      "&:hover": {
                                        bgcolor: alpha("#3f51b5", 0.2),
                                      },
                                    }}
                                  >
                                    <SettingsIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={(e) => handleOpenDeleteDialog(agent, e)}
                                    sx={{
                                      color: "#f44336",
                                      bgcolor: alpha("#f44336", 0.1),
                                      "&:hover": {
                                        bgcolor: alpha("#f44336", 0.2),
                                      },
                                    }}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Box>
                              </Box>
                            </Box>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Mobile FAB for creating new agent */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={handleOpenCreateModal}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            bgcolor: "#3f51b5",
            "&:hover": { bgcolor: "#303f9f" },
          }}
        >
          <AddIcon />
        </Fab>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        fullWidth={isMobile}
        maxWidth={isMobile ? "sm" : false}
        PaperProps={{
          sx: {
            borderRadius: "12px",
            p: 1,
            width: isMobile ? "calc(100% - 32px)" : "auto",
            m: isMobile ? 2 : "auto",
          },
        }}
      >
        <DialogTitle id="delete-dialog-title" sx={{ fontWeight: "bold" }}>
          Delete AI Agent
        </DialogTitle>
        <DialogContent id="delete-dialog-description">
          <Typography variant="body1" sx={{ mb: 1 }}>
            Are you sure you want to delete <strong>{agentToDeleteName}</strong>?
          </Typography>
          <Typography variant="body2" color="text.secondary">
            This action cannot be undone. All data associated with this AI agent will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            pt: 0,
            flexDirection: isMobile ? "column" : "row",
            "& .MuiButton-root": { width: isMobile ? "100%" : "auto", mt: isMobile ? 1 : 0 },
          }}
        >
          <Button
            onClick={handleCloseDeleteDialog}
            sx={{
              color: "text.primary",
              "&:hover": { bgcolor: alpha("#000", 0.05) },
              borderRadius: "8px",
              order: isMobile ? 2 : 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteAgent}
            variant="contained"
            color="error"
            sx={{
              bgcolor: "#f44336",
              "&:hover": { bgcolor: "#d32f2f" },
              borderRadius: "8px",
              order: isMobile ? 1 : 2,
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Create New Agent Modal */}
      <Dialog
        open={createModalOpen}
        onClose={handleCloseCreateModal}
        aria-labelledby="create-dialog-title"
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          sx: {
            borderRadius: isMobile ? 0 : "12px",
            p: 1,
          },
        }}
      >
        <DialogTitle id="create-dialog-title" sx={{ fontWeight: "bold", p: 3, pb: 1 }}>
          Create New AI Agent
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseCreateModal}
          sx={{
            position: "absolute",
            right: 16,
            top: 16,
            color: "text.secondary",
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent sx={{ p: 3 }}>
          <Box component="form" noValidate>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium" }}>
              Agent Name
            </Typography>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              placeholder="Enter a name for your AI agent"
              type="text"
              fullWidth
              variant="outlined"
              value={newAgentName}
              onChange={handleNameChange}
              error={!!nameError}
              helperText={nameError}
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
              inputProps={{
                "aria-label": "Agent name",
              }}
            />

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium" }}>
              Agent Template
            </Typography>
            <FormControl
              fullWidth
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
              }}
            >
              <InputLabel id="template-select-label">Select a template</InputLabel>
              <Select
                labelId="template-select-label"
                id="template-select"
                value={selectedTemplate}
                onChange={handleTemplateChange}
                label="Select a template"
                disabled={rolesLoading}
                displayEmpty
              >
                <MenuItem value="">
                  <em>Select a template</em>
                </MenuItem>
                {rolesLoading ? (
                  <MenuItem value="loading" disabled>
                    Loading templates...
                  </MenuItem>
                ) : (
                  roles.map((role) => (
                    <MenuItem key={role.id} value={role.id}>
                      {role.name}
                    </MenuItem>
                  ))
                )}
              </Select>
              {rolesError && (
                <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                  {rolesError}
                </Typography>
              )}
            </FormControl>

            {selectedTemplate && (
              <Paper
                sx={{
                  p: 2,
                  bgcolor: alpha("#3f51b5", 0.05),
                  borderRadius: "8px",
                  mb: 2,
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: "medium", mb: 1 }}>
                  Template Description
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {roles.find((role) => role.id === selectedTemplate)?.description}
                </Typography>
              </Paper>
            )}
          </Box>
        </DialogContent>

        <DialogActions
          sx={{
            p: 3,
            pt: 0,
            flexDirection: isMobile ? "column" : "row",
            "& .MuiButton-root": {
              width: isMobile ? "100%" : "auto",
              mt: isMobile ? 1 : 0,
            },
          }}
        >
          <Button
            onClick={handleCloseCreateModal}
            sx={{
              color: "text.primary",
              "&:hover": { bgcolor: alpha("#000", 0.05) },
              borderRadius: "8px",
              order: isMobile ? 2 : 1,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateNewAgent}
            variant="contained"
            disabled={!selectedTemplate || !newAgentName.trim() || isCreating}
            sx={{
              bgcolor: "#3f51b5",
              "&:hover": { bgcolor: "#303f9f" },
              borderRadius: "8px",
              px: 3,
              order: isMobile ? 1 : 2,
            }}
          >
            {isCreating ? "Creating..." : "Create Agent"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default AIAgents
