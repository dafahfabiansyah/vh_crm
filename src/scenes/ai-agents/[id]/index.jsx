"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  Tabs,
  Tab,
  TextField,
  Paper,
  IconButton,
  Button,
  Avatar,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  alpha,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useMediaQuery,
  useTheme,
  Drawer,
  Fab,
  Switch,
} from "@mui/material";
import {
  ArrowBack,
  ModeEdit,
  Save,
  Add as AddIcon,
  SmartToy as SmartToyIcon,
  SupportAgent as SupportAgentIcon,
  ShoppingCart as ShoppingCartIcon,
  Settings as SettingsIcon,
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatListNumbered as FormatListNumberedIcon,
  Image as ImageIcon,
  Undo as UndoIcon,
  Redo as RedoIcon,
  Link as LinkIcon,
  CloudUpload as CloudUploadIcon,
  Refresh as RefreshIcon,
  Chat as ChatIcon,
  Close as CloseIcon,
  ExpandMore as ExpandMoreIcon,
} from "@mui/icons-material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { knowledgeTabs } from "../../../data/mockData";
import Sidebar from "../../global/Sidebar";
import { getAgentById, updateAgentById } from "../../../service";
import Chat from "../../../components/Chat";
import { fetchWithAuth } from "../../../api/fetchWithAuth";
import { config } from "../../../config";

const AgentSettings = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { token } = useSelector((state) => state.auth);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));

  // State for agent data and form fields
  const [agent, setAgent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // State for editable fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [behavior, setBehavior] = useState("");
  const [welcomeMessage, setWelcomeMessage] = useState("");
  const [transferConditions, setTransferConditions] = useState("");
  const [stopAfterHandoff, setStopAfterHandoff] = useState(false);

  // State for tracking changes
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Knowledge Sources tab state
  const [knowledgeTab, setKnowledgeTab] = useState("Text");
  const [knowledgeTabList, setKnowledgeTabList] = useState([
    { label: "Default", editing: false },
  ]);
  const [selectedKnowledgeTab, setSelectedKnowledgeTab] = useState(0);
  const [knowledgeContent, setKnowledgeContent] = useState("");

  // State for confirmation dialog
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingTabValue, setPendingTabValue] = useState(null); // Track intended tab

  // State for chat preview drawer (mobile)
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);

  // State for Additional Settings
  const [model, setModel] = useState("standard");
  const [aiHistoryLimit, setAiHistoryLimit] = useState(20);
  const [aiContextLimit, setAiContextLimit] = useState(10);
  const [messageAwait, setMessageAwait] = useState(5);
  const [aiMessageLimit, setAiMessageLimit] = useState(1000);
  const [selectedLabels, setSelectedLabels] = useState([]);

  const [timezone, setTimezone] = useState("");
  const [timezones, setTimezones] = useState([]);

  const [agentSettings, setAgentSettings] = useState(null);

  useEffect(() => {
    const fetchTimezones = () => {
      try {
        const timezoneList = Intl.supportedValuesOf("timeZone");
        const formattedTimezones = timezoneList.map((tz) => {
          const date = new Date();
          const options = { timeZone: tz, timeZoneName: "long" };
          const dateString = date.toLocaleString("id-ID", options);
          const offset = getTimezoneOffset(tz);
          return {
            value: tz,
            label: `(${offset}) ${tz}`,
          };
        });
        formattedTimezones.sort((a, b) => {
          return a.label.localeCompare(b.label);
        });
        setTimezones(formattedTimezones);
        const localTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(localTimezone);
      } catch (error) {
        // console.error("Error fetching timezones:", error);
        setTimezones([
          { value: "GMT+7:00", label: "(GMT+7:00) Bangkok, Hanoi, Jakarta" },
        ]);
        setTimezone("GMT+7:00");
      }
    };

    fetchTimezones();
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchAgentSettings = async () => {
      try {
        const response = await fetchWithAuth(
          `/api/v1/tenant/agents/${id}/settings`
        );
        if (!response.ok) throw new Error("Failed to fetch agent settings");
        const data = await response.json();
        console.log("Agent settings data:", data);
        setAgentSettings(data);
      } catch (e) {
        console.error("Error fetching agent settings:", e);
        setAgentSettings(null);
      }
    };
    fetchAgentSettings();
  }, [id]);

  useEffect(() => {
    if (agentSettings) {
      setBehavior(agentSettings.behavior || "");
      setWelcomeMessage(agentSettings.welcome_message || "");
      setTransferConditions(agentSettings.transfer_conditions || "");
      setSelectedLabels(agentSettings.labels || []);
      setModel(agentSettings.model || "standard");
      setAiHistoryLimit(agentSettings.history_limit || 20);
      setAiContextLimit(agentSettings.context_limit || 10);
      setMessageAwait(agentSettings.message_await || 5);
      setAiMessageLimit(agentSettings.message_limit || 1000);
      setTimezone(agentSettings.timezone || "");
    }
  }, [agentSettings]);

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getAgentById(id, token);
        setAgent(data);
        setName(data.name || "");
        setDescription(data.role?.description || "");
        setBehavior(data.behavior || "");
      } catch (err) {
        setError(err.message || "Failed to fetch agent data");
      } finally {
        setLoading(false);
      }
    };
    fetchAgent();
  }, [id, token]);

  useEffect(() => {
    if (agent) {
      const isChanged =
        name !== agent.name ||
        description !== (agent.role?.description || "") ||
        behavior !== (agent.behavior || "");
      setHasChanges(isChanged);
    }
  }, [name, description, behavior, agent]);

  const handleTabChange = (event, newValue) => {
    if (hasChanges) {
      setPendingTabValue(newValue); // Store intended tab
      setConfirmDialogOpen(true);
    } else {
      setTabValue(newValue); // No changes, switch tab directly
    }
  };

  const handleConfirmTabChange = (newValue) => {
    setTabValue(newValue);
    setConfirmDialogOpen(false);
    setPendingTabValue(null);
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      const updatedAgent = await updateAgentById(
        id,
        { name, description, behavior },
        token
      );
      setAgent(updatedAgent);
      setSaveSuccess(true);
      setHasChanges(false); // Reset hasChanges after save
      setTimeout(() => setSaveSuccess(false), 3000);
      await fetchWithAuth(`/api/v1/tenant/agents/${id}/settings`, {
        method: "PUT",
        body: JSON.stringify({
          behavior,
          welcome_message: welcomeMessage,
          transfer_conditions: transferConditions,
          labels: selectedLabels.filter((l) => l),
          model,
          history_limit: aiHistoryLimit,
          context_limit: aiContextLimit,
          message_await: messageAwait,
          message_limit: aiMessageLimit,
          timezone,
        }),
      });
      // If there was a pending tab switch, go there after save
      if (pendingTabValue !== null) {
        setTabValue(pendingTabValue);
        setConfirmDialogOpen(false);
        setPendingTabValue(null);
      }
    } catch (err) {
      setError(err.message || "Failed to update agent");
    } finally {
      setIsSaving(false);
    }
  };

const handleBehaviorChange = (e) => {
    setBehavior(e.target.value);
  };

  const handleWelcomeMessageChange = (e) => {
    setWelcomeMessage(e.target.value);
  };

  const handleModelChange = (e) => {
    setModel(e.target.value);
  };

  const handleHistoryLimitChange = (e) => {
    setAiHistoryLimit(Number(e.target.value));
  };

  const handleKnowledgeTabChange = (tabLabel) => setKnowledgeTab(tabLabel);

  const handleKnowledgeTabListChange = (idx) => setSelectedKnowledgeTab(idx);

  const handleAddKnowledgeTabList = () => {
    setKnowledgeTabList((prev) => [
      ...prev,
      { label: `Tab ${prev.length + 1}`, editing: false },
    ]);
    setSelectedKnowledgeTab(knowledgeTabList.length);
  };

  const handleEditTabName = (idx) => {
    setKnowledgeTabList((prev) =>
      prev.map((tab, i) => (i === idx ? { ...tab, editing: true } : tab))
    );
  };

  const handleTabNameChange = (idx, value) => {
    setKnowledgeTabList((prev) =>
      prev.map((tab, i) => (i === idx ? { ...tab, label: value } : tab))
    );
  };

  const handleTabNameBlur = (idx) => {
    setKnowledgeTabList((prev) =>
      prev.map((tab, i) => (i === idx ? { ...tab, editing: false } : tab))
    );
  };

  const toggleChatDrawer = () => {
    setChatDrawerOpen(!chatDrawerOpen);
  };

  const getAgentIcon = () => {
    if (!agent || !agent.role || !agent.role.name)
      return <SmartToyIcon sx={{ fontSize: isMobile ? 20 : 24 }} />;

    const roleName = agent.role.name.toLowerCase();
    if (roleName.includes("customer") || roleName.includes("service")) {
      return <SupportAgentIcon sx={{ fontSize: isMobile ? 20 : 24 }} />;
    } else if (roleName.includes("sales")) {
      return <ShoppingCartIcon sx={{ fontSize: isMobile ? 20 : 24 }} />;
    }
    return <SmartToyIcon sx={{ fontSize: isMobile ? 20 : 24 }} />;
  };

  const getAgentColor = () => {
    if (!agent || !agent.role || !agent.role.name) return "#3f51b5";

    const roleName = agent.role.name.toLowerCase();
    if (roleName.includes("customer") || roleName.includes("service")) {
      return "#4caf50";
    } else if (roleName.includes("sales")) {
      return "#ff9800";
    }
    return "#3f51b5";
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Sidebar />
        <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: "70px" } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 64px)",
            }}
          >
            <CircularProgress sx={{ color: "#3f51b5" }} />
          </Box>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Sidebar />
        <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: "70px" } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 64px)",
            }}
          >
            <Alert severity="error" sx={{ maxWidth: 500, m: 2 }}>
              {error}
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/ai-agents")}
                sx={{ ml: 2, borderColor: "currentColor", color: "inherit" }}
              >
                Back to AI Agents
              </Button>
            </Alert>
          </Box>
        </Box>
      </Box>
    );
  }

  if (!agent) {
    return (
      <Box
        sx={{
          display: "flex",
          backgroundColor: "#f5f7fa",
          minHeight: "100vh",
          flexDirection: { xs: "column", md: "row" },
        }}
      >
        <Sidebar />
        <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: "70px" } }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "calc(100vh - 64px)",
            }}
          >
            <Alert severity="warning" sx={{ maxWidth: 500, m: 2 }}>
              Agent not found
              <Button
                variant="outlined"
                size="small"
                onClick={() => navigate("/ai-agents")}
                sx={{ ml: 2, borderColor: "currentColor", color: "inherit" }}
              >
                Back to AI Agents
              </Button>
            </Alert>
          </Box>
        </Box>
      </Box>
    );
  }

  const getTimezoneOffset = (timezone) => {
    const date = new Date();
    const utcDate = new Date(date.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzDate = new Date(
      date.toLocaleString("en-US", { timeZone: timezone })
    );
    const offset = (tzDate - utcDate) / 60000;

    const hours = Math.floor(Math.abs(offset) / 60);
    const minutes = Math.abs(offset) % 60;

    const sign = offset >= 0 ? "+" : "-";
    return `GMT${sign}${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleChange = (event) => {
    setTimezone(event.target.value);
  };

  return (
    <Box
      sx={{
        display: "flex",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
        flexDirection: { xs: "column", md: "row" },
      }}
    >
      <Sidebar />

      <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: "70px" } }}>
        <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: "auto" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              alignItems: { xs: "flex-start", sm: "center" },
              mb: 3,
              gap: { xs: 2, sm: 0 },
            }}
          >
            <IconButton
              onClick={() => navigate("/ai-agents")}
              sx={{
                mr: 2,
                bgcolor: alpha("#000", 0.05),
                "&:hover": { bgcolor: alpha("#000", 0.1) },
              }}
            >
              <ArrowBack />
            </IconButton>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexGrow: 1,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: alpha(getAgentColor(), 0.1),
                  color: getAgentColor(),
                  mr: 2,
                  width: { xs: 40, sm: 48 },
                  height: { xs: 40, sm: 48 },
                }}
              >
                {getAgentIcon()}
              </Avatar>
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: "bold",
                    color: "#3f51b5",
                    fontSize: { xs: "1.25rem", sm: "1.5rem" },
                  }}
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
                      bgcolor: alpha(getAgentColor(), 0.1),
                      color: getAgentColor(),
                      fontWeight: "bold",
                    }}
                  />
                )}
              </Box>
            </Box>

            <Button
              variant="contained"
              startIcon={<Save />}
              onClick={handleSaveChanges}
              disabled={!hasChanges || isSaving}
              sx={{
                bgcolor: "#3f51b5",
                "&:hover": { bgcolor: "#303f9f" },
                borderRadius: "8px",
                px: 3,
                width: { xs: "100%", sm: "auto" },
              }}
            >
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
          </Box>

          {saveSuccess && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Changes saved successfully!
            </Alert>
          )}

          <Paper
            sx={{
              borderRadius: "12px",
              mb: 3,
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              variant={isMobile ? "scrollable" : "standard"}
              scrollButtons={isMobile ? "auto" : false}
              allowScrollButtonsMobile
              sx={{
                borderBottom: "1px solid",
                borderColor: alpha("#000", 0.08),
                "& .MuiTab-root": {
                  textTransform: "none",
                  fontSize: { xs: "0.8rem", sm: "0.95rem" },
                  fontWeight: 500,
                  py: { xs: 1.5, sm: 2 },
                  minHeight: { xs: 48, sm: 56 },
                  minWidth: { xs: "auto", sm: 0 },
                },
                "& .Mui-selected": {
                  color: "#3f51b5",
                  fontWeight: "bold",
                },
                "& .MuiTabs-indicator": {
                  backgroundColor: "#3f51b5",
                  height: 3,
                },
              }}
            >
              <Tab
                icon={
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <SettingsIcon
                      sx={{
                        mr: { xs: 0.5, sm: 1 },
                        fontSize: { xs: 18, sm: 20 },
                      }}
                    />
                    <span>{isMobile ? "" : "General"}</span>
                  </Box>
                }
                label=""
              />
              <Tab
                icon={
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <SmartToyIcon
                      sx={{
                        mr: { xs: 0.5, sm: 1 },
                        fontSize: { xs: 18, sm: 20 },
                      }}
                    />
                    <span>{isMobile ? "" : "Knowledge Sources"}</span>
                  </Box>
                }
                label=""
              />
              <Tab
                icon={
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <LinkIcon
                      sx={{
                        mr: { xs: 0.5, sm: 1 },
                        fontSize: { xs: 18, sm: 20 },
                      }}
                    />
                    <span>{isMobile ? "" : "Integrations"}</span>
                  </Box>
                }
                label=""
              />
              <Tab
                icon={
                  <Box
                    component="span"
                    sx={{ display: "flex", alignItems: "center" }}
                  >
                    <RefreshIcon
                      sx={{
                        mr: { xs: 0.5, sm: 1 },
                        fontSize: { xs: 18, sm: 20 },
                      }}
                    />
                    <span>{isMobile ? "" : "Followups"}</span>
                  </Box>
                }
                label=""
              />
            </Tabs>
          </Paper>

          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", lg: "row" },
              gap: 3,
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Paper
                sx={{
                  borderRadius: "12px",
                  p: { xs: 2, sm: 3 },
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                }}
              >
                {tabValue === 0 && (
                  <Box>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Agent Name
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter agent name"
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1 }}
                    >
                      Description
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter agent description"
                      multiline
                      rows={2}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />

                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        gap: { xs: 2, sm: 1 },
                        mb: 3,
                        p: 2,
                        borderRadius: "8px",
                        bgcolor: alpha("#3f51b5", 0.05),
                      }}
                    >
                      <RefreshIcon sx={{ color: "#3f51b5" }} />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ fontWeight: "bold" }}
                        >
                          Last Trained
                        </Typography>
                        <Typography variant="body2">
                          {agent.updatedAt ||
                          agent.updated_at ||
                          agent.role?.updated_at
                            ? new Intl.DateTimeFormat("id-ID", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              }).format(
                                new Date(
                                  agent.updatedAt ||
                                    agent.updated_at ||
                                    agent.role?.updated_at
                                )
                              )
                            : "-"}
                        </Typography>
                      </Box>
                      <Button
                        variant="outlined"
                        startIcon={<RefreshIcon />}
                        sx={{
                          ml: { xs: 0, sm: "auto" },
                          borderColor: "#3f51b5",
                          color: "#3f51b5",
                          "&:hover": {
                            borderColor: "#303f9f",
                            bgcolor: alpha("#3f51b5", 0.05),
                          },
                          borderRadius: "8px",
                          width: { xs: "100%", sm: "auto" },
                        }}
                      >
                        Retrain
                      </Button>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5" }}
                    >
                      AI Agent Behavior
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      This is the AI Prompt that will determine the speaking
                      style and identity of the AI.
                    </Typography>

                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={8}
                      value={behavior}
                      onChange={handleBehaviorChange}
                      placeholder="Enter agent behavior instructions"
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5" }}
                    >
                      Welcome Message
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      value={welcomeMessage}
                      onChange={handleWelcomeMessageChange}
                      placeholder="Enter welcome message for users"
                      helperText={`${welcomeMessage.length}/5000`}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", mb: 1, color: "#3f51b5" }}
                    >
                      Agent Transfer Conditions
                    </Typography>
                    <TextField
                      fullWidth
                      variant="outlined"
                      multiline
                      rows={3}
                      value={transferConditions}
                      onChange={(e) => {
                        if (e.target.value.length <= 750)
                          setTransferConditions(e.target.value);
                      }}
                      placeholder="When the customer wants to purchase"
                      helperText={`${transferConditions.length}/750`}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "8px",
                        },
                      }}
                    />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Switch
                        checked={stopAfterHandoff}
                        onChange={(e) => setStopAfterHandoff(e.target.checked)}
                        color="primary"
                      />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        Stop AI after Handoff
                      </Typography>
                    </Box>

                    <Accordion sx={{ mb: 3 }}>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: "bold", color: "#3f51b5" }}
                        >
                          Additional Settings
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 2,
                          }}
                        >
                          <FormControl fullWidth>
                            <InputLabel>Model</InputLabel>
                            <Select
                              value={model}
                              label="Model"
                              onChange={handleModelChange}
                            >
                              <MenuItem value="gpt-4.1-mini">
                                gpt-4.1-mini
                              </MenuItem>
                              <MenuItem value="gpt-4.1">gpt-4.1</MenuItem>
                              <MenuItem value="gpt-4o">gpt-4o</MenuItem>
                              <MenuItem value="gpt-4o-mini">
                                gpt-4o-mini
                              </MenuItem>
                            </Select>
                          </FormControl>
                          <TextField
                            label="AI History Limit"
                            type="number"
                            value={aiHistoryLimit}
                            onChange={handleHistoryLimitChange}
                            helperText="Berapa banyak pesan yang akan diingat AI."
                            fullWidth
                          />
                          <TextField
                            label="AI Context Limit"
                            type="number"
                            value={aiContextLimit}
                            onChange={(e) =>
                              setAiContextLimit(Number(e.target.value))
                            }
                            helperText="Level AI untuk membaca knowledge source."
                            fullWidth
                          />
                          <TextField
                            label="Message Await"
                            type="number"
                            value={messageAwait}
                            onChange={(e) =>
                              setMessageAwait(Number(e.target.value))
                            }
                            helperText="Delay Waktu AI untuk merespon pesan pengguna."
                            fullWidth
                          />
                          <TextField
                            label="AI Message Limit"
                            type="number"
                            value={aiMessageLimit}
                            onChange={(e) =>
                              setAiMessageLimit(Number(e.target.value))
                            }
                            helperText="Limit pesan yang bisa dikirim oleh AI ke satu customer."
                            fullWidth
                          />
                          <FormControl fullWidth>
                            <InputLabel>Timezone</InputLabel>
                            <Select
                              value={timezone}
                              label="Timezone"
                              onChange={handleChange}
                            >
                              {timezones.map((tz) => (
                                <MenuItem key={tz.value} value={tz.value}>
                                  {tz.label}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                          <TextField
                            label="Selected Labels"
                            value={selectedLabels.join(", ")}
                            onChange={(e) =>
                              setSelectedLabels(
                                e.target.value.split(",").map((l) => l.trim())
                              )
                            }
                            helperText="AI dapat secara otomatis melabel chat. Pilih label yang diizinkan untuk digunakan oleh AI."
                            fullWidth
                          />
                        </Box>
                      </AccordionDetails>
                    </Accordion>
                  </Box>
                )}

                {tabValue === 1 && (
                  <Box>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        flexWrap: "wrap",
                        gap: 1,
                        overflow: { xs: "auto", sm: "visible" },
                        pb: { xs: 1, sm: 0 },
                        maxWidth: "100%",
                      }}
                    >
                      {knowledgeTabs.map((tab) => (
                        <Button
                          key={tab.label}
                          onClick={() => handleKnowledgeTabChange(tab.label)}
                          sx={{
                            px: { xs: 1.5, sm: 2 },
                            py: 1,
                            borderRadius: "8px",
                            bgcolor:
                              knowledgeTab === tab.label
                                ? alpha("#3f51b5", 0.1)
                                : "transparent",
                            color:
                              knowledgeTab === tab.label
                                ? "#3f51b5"
                                : "text.primary",
                            border:
                              knowledgeTab === tab.label
                                ? "1px solid #3f51b5"
                                : "1px solid #e0e0e0",
                            fontWeight:
                              knowledgeTab === tab.label ? "bold" : "medium",
                            fontSize: { xs: "0.8rem", sm: "0.9rem" },
                            textTransform: "none",
                            "&:hover": {
                              bgcolor: alpha("#3f51b5", 0.05),
                              borderColor: "#3f51b5",
                            },
                            whiteSpace: "nowrap",
                            minWidth: { xs: "auto", sm: "initial" },
                          }}
                        >
                          <span style={{ marginRight: 8 }}>{tab.icon}</span>
                          {tab.label}
                        </Button>
                      ))}
                    </Box>

                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        mb: 3,
                        flexWrap: "wrap",
                        overflow: { xs: "auto", sm: "visible" },
                        pb: { xs: 1, sm: 0 },
                      }}
                    >
                      {knowledgeTabList.map((tab, idx) => (
                        <Box
                          key={idx}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            bgcolor:
                              selectedKnowledgeTab === idx
                                ? alpha("#3f51b5", 0.1)
                                : alpha("#000", 0.03),
                            border:
                              selectedKnowledgeTab === idx
                                ? "1px solid #3f51b5"
                                : "1px solid transparent",
                            borderRadius: "8px",
                            px: { xs: 1.5, sm: 2 },
                            py: 1,
                            mr: 1,
                            mb: 1,
                            cursor: "pointer",
                            minWidth: { xs: 70, sm: 90 },
                            position: "relative",
                          }}
                          onClick={() => handleKnowledgeTabListChange(idx)}
                        >
                          {tab.editing ? (
                            <TextField
                              value={tab.label}
                              onChange={(e) =>
                                handleTabNameChange(idx, e.target.value)
                              }
                              onBlur={() => handleTabNameBlur(idx)}
                              autoFocus
                              variant="standard"
                              InputProps={{
                                disableUnderline: true,
                              }}
                              sx={{
                                "& input": {
                                  p: 0,
                                  fontWeight: "medium",
                                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                },
                              }}
                            />
                          ) : (
                            <>
                              <Typography
                                sx={{
                                  fontWeight: "medium",
                                  fontSize: { xs: "0.8rem", sm: "0.9rem" },
                                }}
                              >
                                {tab.label}
                              </Typography>
                              <IconButton
                                size="small"
                                sx={{ ml: 1, p: 0.5 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditTabName(idx);
                                }}
                              >
                                <ModeEdit
                                  sx={{ fontSize: { xs: 14, sm: 16 } }}
                                />
                              </IconButton>
                            </>
                          )}
                        </Box>
                      ))}
                      <Tooltip title="Add new tab">
                        <IconButton
                          size="small"
                          sx={{
                            bgcolor: alpha("#3f51b5", 0.1),
                            color: "#3f51b5",
                            "&:hover": { bgcolor: alpha("#3f51b5", 0.2) },
                            mr: 1,
                            mb: 1,
                          }}
                          onClick={handleAddKnowledgeTabList}
                        >
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>

                    <Paper
                      sx={{
                        borderRadius: "8px",
                        border: "1px solid",
                        borderColor: alpha("#000", 0.1),
                        overflow: "hidden",
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1,
                          borderBottom: "1px solid",
                          borderColor: alpha("#000", 0.1),
                          bgcolor: alpha("#000", 0.02),
                          flexWrap: "wrap",
                          overflow: { xs: "auto", sm: "visible" },
                        }}
                      >
                        <Tooltip title="Undo">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <UndoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Redo">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <RedoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ mx: 1 }}
                        />
                        <Tooltip title="Bold">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <FormatBoldIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Italic">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <FormatItalicIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ mx: 1 }}
                        />
                        <Tooltip title="Bulleted List">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <FormatListBulletedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Numbered List">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <FormatListNumberedIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ mx: 1 }}
                        />
                        <Tooltip title="Insert Image">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <ImageIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Insert Link">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <LinkIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Divider
                          orientation="vertical"
                          flexItem
                          sx={{ mx: 1 }}
                        />
                        <Tooltip title="Upload File">
                          <IconButton size="small" sx={{ mx: 0.5 }}>
                            <CloudUploadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>

                      <TextField
                        multiline
                        fullWidth
                        rows={12}
                        value={knowledgeContent}
                        onChange={(e) => setKnowledgeContent(e.target.value)}
                        placeholder={`Enter ${knowledgeTab.toLowerCase()} content here...`}
                        variant="outlined"
                        InputProps={{
                          sx: {
                            p: 2,
                            borderRadius: 0,
                            border: "none",
                            "& .MuiOutlinedInput-notchedOutline": {
                              border: "none",
                            },
                          },
                        }}
                      />
                    </Paper>
                  </Box>
                )}

                {tabValue === 2 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 4,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha("#3f51b5", 0.1),
                        color: "#3f51b5",
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        mb: 2,
                      }}
                    >
                      <LinkIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      No Integrations Yet
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, textAlign: "center", maxWidth: 500, px: 2 }}
                    >
                      Connect your AI agent with external services to enhance
                      its capabilities.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        bgcolor: "#3f51b5",
                        "&:hover": { bgcolor: "#303f9f" },
                        borderRadius: "8px",
                        px: 3,
                        width: { xs: "100%", sm: "auto" },
                        maxWidth: { xs: "80%", sm: "none" },
                      }}
                    >
                      Add Integration
                    </Button>
                  </Box>
                )}

                {tabValue === 3 && (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      py: 4,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha("#3f51b5", 0.1),
                        color: "#3f51b5",
                        width: { xs: 60, sm: 80 },
                        height: { xs: 60, sm: 80 },
                        mb: 2,
                      }}
                    >
                      <RefreshIcon sx={{ fontSize: { xs: 30, sm: 40 } }} />
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                      No Followups Configured
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ mb: 3, textAlign: "center", maxWidth: 500, px: 2 }}
                    >
                      Configure automated followups to engage with users after
                      conversations.
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      sx={{
                        bgcolor: "#3f51b5",
                        "&:hover": { bgcolor: "#303f9f" },
                        borderRadius: "8px",
                        px: 3,
                        width: { xs: "100%", sm: "auto" },
                        maxWidth: { xs: "80%", sm: "none" },
                      }}
                    >
                      Configure Followups
                    </Button>
                  </Box>
                )}
              </Paper>
            </Box>

            {!isMobile && !isTablet && (
              <Box sx={{ width: 350 }}>
                <Paper
                  sx={{
                    borderRadius: "12px",
                    overflow: "hidden",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    // height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      borderBottom: "1px solid",
                      borderColor: alpha("#000", 0.1),
                      bgcolor: alpha("#3f51b5", 0.05),
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                      Chat Preview
                    </Typography>
                    <Chip
                      label="Testing Mode"
                      size="small"
                      sx={{
                        ml: "auto",
                        height: 24,
                        bgcolor: alpha("#3f51b5", 0.1),
                        color: "#3f51b5",
                        fontWeight: "medium",
                      }}
                    />
                  </Box>
                  <Chat agentName={agent?.name} />
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {(isMobile || isTablet) && (
        <Fab
          color="primary"
          aria-label="chat preview"
          onClick={toggleChatDrawer}
          sx={{
            position: "fixed",
            bottom: 16,
            right: 16,
            bgcolor: "#3f51b5",
            "&:hover": { bgcolor: "#303f9f" },
          }}
        >
          <ChatIcon />
        </Fab>
      )}

      <Drawer
        anchor="right"
        open={chatDrawerOpen}
        onClose={toggleChatDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: { xs: "100%", sm: 350 },
            boxSizing: "border-box",
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            borderBottom: "1px solid",
            borderColor: alpha("#000", 0.1),
            bgcolor: alpha("#3f51b5", 0.05),
            display: "flex",
            alignItems: "center",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            Chat Preview
          </Typography>
          <Chip
            label="Testing Mode"
            size="small"
            sx={{
              ml: "auto",
              height: 24,
              bgcolor: alpha("#3f51b5", 0.1),
              color: "#3f51b5",
              fontWeight: "medium",
            }}
          />
          <IconButton onClick={toggleChatDrawer} sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ height: "calc(100% - 56px)" }}>
          <Chat agentName={agent?.name} />
        </Box>
      </Drawer>

      <Dialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        aria-labelledby="confirm-dialog-title"
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
        <DialogTitle id="confirm-dialog-title" sx={{ fontWeight: "bold" }}>
          Unsaved Changes
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            You have unsaved changes. Do you want to save them before switching
            tabs?
          </Typography>
        </DialogContent>
        <DialogActions
          sx={{
            p: 2,
            pt: 0,
            flexDirection: isMobile ? "column" : "row",
            "& .MuiButton-root": {
              width: isMobile ? "100%" : "auto",
              mt: isMobile ? 1 : 0,
            },
          }}
        >
          <Button
            onClick={() => {
              setConfirmDialogOpen(false);
              if (pendingTabValue !== null) {
                handleConfirmTabChange(pendingTabValue);
              }
            }}
            sx={{
              color: "text.primary",
              "&:hover": { bgcolor: alpha("#000", 0.05) },
              borderRadius: "8px",
            }}
          >
            Discard
          </Button>
          <Button
            onClick={async () => {
              await handleSaveChanges();
              // Tab switch is handled in handleSaveChanges if pendingTabValue is set
            }}
            variant="contained"
            sx={{
              bgcolor: "#3f51b5",
              "&:hover": { bgcolor: "#303f9f" },
              borderRadius: "8px",
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentSettings;
