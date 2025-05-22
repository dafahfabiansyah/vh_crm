"use client"

import React, { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Chip,
  FormControl,
  Select,
  MenuItem,
  AppBar,
  Toolbar,
  alpha,
  Button,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputLabel,
  Badge,
  Avatar,
  Tooltip,
  Divider,
  LinearProgress,
  useMediaQuery,
  useTheme,
  Tabs,
  Tab,
  Drawer,
  Fab,
} from "@mui/material"
import { DndProvider, useDrag, useDrop } from "react-dnd"
import { HTML5Backend } from "react-dnd-html5-backend"
// import { TouchBackend } from "react-dnd-touch-backend"
import Sidebar from "../global/Sidebar"
import AddIcon from "@mui/icons-material/Add"
import FilterListIcon from "@mui/icons-material/FilterList"
import SearchIcon from "@mui/icons-material/Search"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import AccessTimeIcon from "@mui/icons-material/AccessTime"
import FlagIcon from "@mui/icons-material/Flag"
import AssignmentIcon from "@mui/icons-material/Assignment"
import PersonIcon from "@mui/icons-material/Person"
import TuneIcon from "@mui/icons-material/Tune"
import CloseIcon from "@mui/icons-material/Close"

// Define item types for drag and drop
const ItemTypes = {
  TASK: "task",
}

// Sample task data with more details
const initialTasks = [
  {
    id: 1,
    title: "Shoppi E-commerce Platform",
    date: "19/05/2025",
    priority: "Tinggi",
    description: "Develop the main shopping cart functionality for the e-commerce platform",
    status: "Belum Dimulai",
    progress: 0,
    assignee: "John Doe",
    tags: ["Frontend", "E-commerce"],
  },
  {
    id: 2,
    title: "User Authentication System",
    date: "20/05/2025",
    priority: "Tinggi",
    description: "Implement secure login and registration system with OAuth integration",
    status: "Sedang Berlangsung",
    progress: 45,
    assignee: "Jane Smith",
    tags: ["Backend", "Security"],
  },
  {
    id: 3,
    title: "Payment Gateway Integration",
    date: "22/05/2025",
    priority: "Sedang",
    description: "Connect multiple payment providers to the checkout system",
    status: "Sedang Berlangsung",
    progress: 70,
    assignee: "Mike Johnson",
    tags: ["Backend", "Payment"],
  },
  {
    id: 4,
    title: "Product Catalog Design",
    date: "18/05/2025",
    priority: "Rendah",
    description: "Create responsive design for product listing pages",
    status: "Selesai",
    progress: 100,
    assignee: "Sarah Lee",
    tags: ["Design", "Frontend"],
  },
  {
    id: 5,
    title: "Database Optimization",
    date: "21/05/2025",
    priority: "Sedang",
    description: "Improve query performance for product search functionality",
    status: "Ditangguhkan",
    progress: 30,
    assignee: "David Chen",
    tags: ["Backend", "Database"],
  },
]

// Priority color mapping
const priorityColors = {
  Tinggi: "#f44336",
  Sedang: "#ff9800",
  Rendah: "#4caf50",
}

// Status color mapping
const statusColors = {
  "Belum Dimulai": "#42a5f5",
  "Sedang Berlangsung": "#ab47bc",
  Ditangguhkan: "#ff9800",
  Selesai: "#4caf50",
}

// Get initials from name
const getInitials = (name) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
}

// Custom DnD backend based on device
const CustomDndProvider = ({ children }) => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

  if (isMobile) {
    return (
      <DndProvider  options={{ enableMouseEvents: true }}>
        {children}
      </DndProvider>
    )
  }

  return <DndProvider backend={HTML5Backend}>{children}</DndProvider>
}

// Draggable Task Card Component
const DraggableTaskCard = ({ task }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.TASK,
    item: { id: task.id, status: task.status },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }))

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <Card
        sx={{
          mb: 2,
          bgcolor: "white",
          boxShadow: isDragging ? "0 8px 16px rgba(0,0,0,0.2)" : "0 2px 4px rgba(0,0,0,0.05)",
          transition: "box-shadow 0.3s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            transform: "translateY(-2px)",
          },
          borderLeft: `4px solid ${priorityColors[task.priority]}`,
          position: "relative",
        }}
      >
        <CardContent sx={{ pb: "8px !important", px: isMobile ? 1.5 : 2 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{ fontSize: isMobile ? "0.9rem" : "0.95rem", fontWeight: "bold" }}
            >
              {task.title}
            </Typography>
            <IconButton size="small">
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          <Typography
            variant="body2"
            sx={{ mb: 1, color: "text.secondary", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 0.5 }}
          >
            <AccessTimeIcon fontSize="inherit" /> {task.date}
          </Typography>

          <Typography variant="body2" sx={{ mb: 1.5, fontSize: "0.85rem" }}>
            {task.description}
          </Typography>

          {task.progress < 100 && (
            <Box sx={{ mb: 1.5 }}>
              <LinearProgress
                variant="determinate"
                value={task.progress}
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: alpha("#000", 0.05),
                  "& .MuiLinearProgress-bar": {
                    bgcolor: task.progress < 30 ? "#f44336" : task.progress < 70 ? "#ff9800" : "#4caf50",
                  },
                }}
              />
              <Typography variant="caption" sx={{ display: "block", textAlign: "right", mt: 0.5 }}>
                {task.progress}%
              </Typography>
            </Box>
          )}

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1 }}>
            {task.tags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                sx={{
                  height: 20,
                  fontSize: "0.7rem",
                  bgcolor: alpha("#6200ea", 0.1),
                  color: "#6200ea",
                }}
              />
            ))}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
            <Chip
              icon={<FlagIcon style={{ fontSize: "0.9rem" }} />}
              label={task.priority}
              size="small"
              sx={{
                bgcolor: alpha(priorityColors[task.priority], 0.1),
                color: priorityColors[task.priority],
                fontWeight: "bold",
                fontSize: "0.7rem",
                height: 24,
              }}
            />

            <Tooltip title={task.assignee}>
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  fontSize: "0.8rem",
                  bgcolor: "#5e35b1",
                }}
              >
                {getInitials(task.assignee)}
              </Avatar>
            </Tooltip>
          </Box>
        </CardContent>
      </Card>
    </div>
  )
}

// Droppable Column Component
const DroppableColumn = ({ column, tasks, moveTask }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))

  const [{ isOver }, drop] = useDrop(() => ({
    accept: ItemTypes.TASK,
    drop: (item) => moveTask(item.id, column.title),
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }))

  const filteredTasks = tasks.filter((task) => task.status === column.title)

  return (
    <Paper
      ref={drop}
      sx={{
        p: isMobile ? 1.5 : 2,
        bgcolor: isOver ? alpha(statusColors[column.title], 0.1) : alpha(statusColors[column.title], 0.05),
        borderTop: `4px solid ${statusColors[column.title]}`,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "background-color 0.2s ease",
        outline: isOver ? `2px dashed ${statusColors[column.title]}` : "none",
        borderRadius: "8px",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: "bold",
            flexGrow: 1,
            color: statusColors[column.title],
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          {column.title}
        </Typography>
        <Chip
          label={column.count}
          size="small"
          sx={{
            bgcolor: column.count > 0 ? statusColors[column.title] : "#9e9e9e",
            color: "white",
            fontWeight: "bold",
            borderRadius: "50%",
            width: 24,
            height: 24,
          }}
        />
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          minHeight: isMobile ? 300 : 500,
          maxHeight: isMobile ? "calc(100vh - 300px)" : "calc(100vh - 200px)",
          overflow: "auto",
          transition: "background-color 0.2s ease",
          bgcolor: isOver ? alpha(statusColors[column.title], 0.05) : "transparent",
          borderRadius: 1,
          p: 1,
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
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => <DraggableTaskCard key={task.id} task={task} moveTask={moveTask} />)
        ) : (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
              minHeight: isMobile ? 150 : 200,
              border: "2px dashed",
              borderColor: alpha(statusColors[column.title], 0.3),
              borderRadius: 2,
              p: 3,
            }}
          >
            <AssignmentIcon
              sx={{ fontSize: isMobile ? 30 : 40, color: alpha(statusColors[column.title], 0.4), mb: 1 }}
            />
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ fontSize: isMobile ? "0.8rem" : "0.875rem" }}
            >
              Tidak ada tugas di kolom ini.
              <br />
              Seret tugas ke sini atau tambahkan yang baru.
            </Typography>
          </Box>
        )}
      </Box>

      <Button
        variant="text"
        startIcon={<AddIcon />}
        sx={{
          mt: 2,
          color: statusColors[column.title],
          justifyContent: "flex-start",
          "&:hover": {
            bgcolor: alpha(statusColors[column.title], 0.1),
          },
          fontSize: isMobile ? "0.8rem" : "0.875rem",
        }}
      >
        Tambah Tugas
      </Button>
    </Paper>
  )
}

const Ticket = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  // const isTablet = useMediaQuery(theme.breakpoints.down("md"))

  const [tasks, setTasks] = useState(initialTasks)
  const [sortBy, setSortBy] = useState("Tidak ada")
  const [sortOrder, setSortOrder] = useState("Menaik")
  const [searchTerm, setSearchTerm] = useState("")
  const [openAddDialog, setOpenAddDialog] = useState(false)
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Sedang",
    status: "Belum Dimulai",
    date: new Date().toLocaleDateString("id-ID"),
    progress: 0,
    assignee: "",
    tags: [],
  })

  // Define columns
  const columns = [
    {
      id: "belum-dimulai",
      title: "Belum Dimulai",
      count: tasks.filter((task) => task.status === "Belum Dimulai").length,
    },
    {
      id: "sedang-berlangsung",
      title: "Sedang Berlangsung",
      count: tasks.filter((task) => task.status === "Sedang Berlangsung").length,
    },
    { id: "ditangguhkan", title: "Ditangguhkan", count: tasks.filter((task) => task.status === "Ditangguhkan").length },
    { id: "selesai", title: "Selesai", count: tasks.filter((task) => task.status === "Selesai").length },
  ]

  const handleSortByChange = (event) => {
    setSortBy(event.target.value)
  }

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  // Function to move a task from one status to another
  const moveTask = (taskId, newStatus) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status: newStatus } : task)))
  }

  // Filter and sort tasks
  const filteredAndSortedTasks = React.useMemo(() => {
    let result = [...tasks]

    // Filter by search term
    if (searchTerm) {
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.assignee?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Sort tasks
    if (sortBy !== "Tidak ada") {
      result.sort((a, b) => {
        let comparison = 0

        if (sortBy === "Tanggal") {
          const dateA = new Date(a.date.split("/").reverse().join("-"))
          const dateB = new Date(b.date.split("/").reverse().join("-"))
          comparison = dateA - dateB
        } else if (sortBy === "Prioritas") {
          const priorityOrder = { Tinggi: 3, Sedang: 2, Rendah: 1 }
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority]
        }

        return sortOrder === "Menurun" ? -comparison : comparison
      })
    }

    return result
  }, [tasks, searchTerm, sortBy, sortOrder])

  // Filter tasks by tab for mobile view
  const filteredTasksByTab = React.useMemo(() => {
    if (!isMobile) return filteredAndSortedTasks

    const statusByTab = columns[tabValue].title
    return filteredAndSortedTasks.filter((task) => task.status === statusByTab)
  }, [filteredAndSortedTasks, tabValue, isMobile, tasks])

  // Handle adding a new task
  const handleAddTask = () => {
    if (newTask.title.trim() && newTask.description.trim()) {
      const task = {
        ...newTask,
        id: tasks.length + 1,
        tags: newTask.tags.length ? newTask.tags : ["Baru"],
      }

      setTasks([...tasks, task])
      setOpenAddDialog(false)
      setNewTask({
        title: "",
        description: "",
        priority: "Sedang",
        status: "Belum Dimulai",
        date: new Date().toLocaleDateString("id-ID"),
        progress: 0,
        assignee: "",
        tags: [],
      })
    }
  }

  // Handle input change for new task
  const handleNewTaskChange = (e) => {
    const { name, value } = e.target
    setNewTask({
      ...newTask,
      [name]: value,
    })
  }

  // Handle tags input
  const handleTagsChange = (e) => {
    const tagsArray = e.target.value
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)
    setNewTask({
      ...newTask,
      tags: tagsArray,
    })
  }

  // Toggle filter drawer
  const toggleFilterDrawer = () => {
    setOpenFilterDrawer(!openFilterDrawer)
  }

  // Filter drawer content
  const filterDrawerContent = (
    <Box sx={{ width: 280, p: 2 }} role="presentation">
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          Filter & Urutan
        </Typography>
        <IconButton onClick={toggleFilterDrawer}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium" }}>
        Urutkan Berdasarkan
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 2 }}>
        <Select value={sortBy} onChange={handleSortByChange} displayEmpty>
          <MenuItem value="Tidak ada">Tidak ada</MenuItem>
          <MenuItem value="Tanggal">Tanggal</MenuItem>
          <MenuItem value="Prioritas">Prioritas</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium" }}>
        Arah Urutan
      </Typography>
      <FormControl fullWidth size="small" sx={{ mb: 3 }}>
        <Select value={sortOrder} onChange={handleSortOrderChange} displayEmpty>
          <MenuItem value="Menaik">Menaik</MenuItem>
          <MenuItem value="Menurun">Menurun</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "medium" }}>
        Cari
      </Typography>
      <TextField
        placeholder="Cari tugas..."
        variant="outlined"
        size="small"
        fullWidth
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: <SearchIcon sx={{ mr: 1, color: "text.secondary" }} />,
        }}
        sx={{ mb: 3 }}
      />

      <Button
        variant="contained"
        fullWidth
        onClick={toggleFilterDrawer}
        sx={{
          bgcolor: "#3f51b5",
          "&:hover": { bgcolor: "#303f9f" },
          borderRadius: "8px",
        }}
      >
        Terapkan Filter
      </Button>
    </Box>
  )

  return (
    <CustomDndProvider>
      <Box sx={{ display: "flex", flexGrow: 1, bgcolor: "#f5f7fa", minHeight: "100vh", pb: 4 }}>
        <Sidebar />
        <Box sx={{ flexGrow: 1, ml: { xs: 0, sm: "70px" } }}>
          <AppBar
            position="static"
            color="default"
            elevation={0}
            sx={{ borderBottom: "1px solid #e0e0e0", bgcolor: "white" }}
          >
            <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
              <Typography
                variant="h6"
                component="div"
                sx={{
                  flexGrow: 1,
                  fontWeight: "bold",
                  color: "#3f51b5",
                  marginLeft: { xs: 0, sm: 5 },
                  fontSize: { xs: "1.1rem", sm: "1.25rem" },
                }}
              >
                Task Management Board
              </Typography>

              {/* Desktop search and filter */}
              {!isMobile && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ position: "relative", bgcolor: alpha("#000", 0.04), borderRadius: 1, px: 2, py: 0.5 }}>
                    <SearchIcon
                      sx={{
                        position: "absolute",
                        left: 8,
                        top: "50%",
                        transform: "translateY(-50%)",
                        color: "text.secondary",
                      }}
                    />
                    <TextField
                      placeholder="Cari tugas..."
                      variant="standard"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      InputProps={{
                        disableUnderline: true,
                        sx: { pl: 4 },
                      }}
                      sx={{ width: 200 }}
                    />
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      bgcolor: alpha("#000", 0.04),
                      borderRadius: 1,
                      px: 2,
                      py: 0.5,
                    }}
                  >
                    <FilterListIcon sx={{ color: "text.secondary" }} />
                    <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                      <Select value={sortBy} onChange={handleSortByChange} displayEmpty disableUnderline>
                        <MenuItem value="Tidak ada">Tidak ada</MenuItem>
                        <MenuItem value="Tanggal">Tanggal</MenuItem>
                        <MenuItem value="Prioritas">Prioritas</MenuItem>
                      </Select>
                    </FormControl>
                    <FormControl variant="standard" size="small" sx={{ minWidth: 120 }}>
                      <Select value={sortOrder} onChange={handleSortOrderChange} displayEmpty disableUnderline>
                        <MenuItem value="Menaik">Menaik</MenuItem>
                        <MenuItem value="Menurun">Menurun</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                </Box>
              )}

              {/* Mobile filter button */}
              {isMobile && (
                <IconButton onClick={toggleFilterDrawer} sx={{ mr: 1 }}>
                  <TuneIcon />
                </IconButton>
              )}

              <Button
                variant="contained"
                startIcon={!isMobile && <AddIcon />}
                onClick={() => setOpenAddDialog(true)}
                sx={{
                  bgcolor: "#3f51b5",
                  "&:hover": { bgcolor: "#303f9f" },
                  borderRadius: "8px",
                  px: isMobile ? 2 : 3,
                  minWidth: isMobile ? "auto" : "initial",
                }}
              >
                {isMobile ? <AddIcon /> : "Tugas Baru"}
              </Button>
            </Toolbar>
          </AppBar>

          <Box sx={{ p: { xs: 2, sm: 4, md: 10 } }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                justifyContent: "space-between",
                alignItems: { xs: "flex-start", sm: "center" },
                mb: 3,
                gap: { xs: 2, sm: 0 },
              }}
            >
              <Box>
                <Typography
                  variant="h5"
                  sx={{ fontWeight: "bold", mb: 0.5, fontSize: { xs: "1.25rem", sm: "1.5rem" } }}
                >
                  Papan Tugas
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Kelola dan pantau kemajuan tugas dengan mudah
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexWrap: { xs: "wrap", sm: "nowrap" },
                  width: { xs: "100%", sm: "auto" },
                }}
              >
                <Badge badgeContent={tasks.length} color="primary">
                  <Chip
                    icon={<AssignmentIcon />}
                    label="Total Tugas"
                    sx={{ bgcolor: alpha("#3f51b5", 0.1), color: "#3f51b5" }}
                  />
                </Badge>

                {!isMobile && <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />}

                <Tooltip title="Pengguna Aktif">
                  <Box sx={{ display: "flex" }}>
                    {["John Doe", "Jane Smith", "Mike Johnson"].map((user, index) => (
                      <Avatar
                        key={index}
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: "0.8rem",
                          bgcolor: "#5e35b1",
                          ml: index > 0 ? -1 : 0,
                          border: "2px solid white",
                        }}
                      >
                        {getInitials(user)}
                      </Avatar>
                    ))}
                  </Box>
                </Tooltip>
              </Box>
            </Box>

            {/* Mobile tabs for status columns */}
            {isMobile && (
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  mb: 2,
                  borderBottom: "1px solid",
                  borderColor: alpha("#000", 0.1),
                  "& .MuiTab-root": {
                    textTransform: "none",
                    minWidth: 100,
                    fontSize: "0.85rem",
                    fontWeight: 500,
                    color: "text.primary",
                  },
                  "& .Mui-selected": {
                    color: "#3f51b5",
                    fontWeight: "bold",
                  },
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#3f51b5",
                  },
                }}
              >
                {columns.map((column) => (
                  <Tab
                    key={column.id}
                    label={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {column.title}
                        <Chip
                          label={column.count}
                          size="small"
                          sx={{
                            height: 20,
                            minWidth: 20,
                            fontSize: "0.7rem",
                            bgcolor: column.count > 0 ? statusColors[column.title] : "#9e9e9e",
                            color: "white",
                          }}
                        />
                      </Box>
                    }
                  />
                ))}
              </Tabs>
            )}

            {/* Desktop grid view */}
            {!isMobile && (
              <Grid container spacing={2}>
                {columns.map((column) => (
                  <Grid item xs={12} sm={6} md={3} key={column.id}>
                    <DroppableColumn column={column} tasks={filteredAndSortedTasks} moveTask={moveTask} />
                  </Grid>
                ))}
              </Grid>
            )}

            {/* Mobile single column view */}
            {isMobile && (
              <Box sx={{ mt: 2 }}>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: alpha(statusColors[columns[tabValue].title], 0.05),
                    borderTop: `4px solid ${statusColors[columns[tabValue].title]}`,
                    borderRadius: "8px",
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: "bold", flexGrow: 1, color: statusColors[columns[tabValue].title] }}
                    >
                      {columns[tabValue].title}
                    </Typography>
                    <Chip
                      label={columns[tabValue].count}
                      size="small"
                      sx={{
                        bgcolor: columns[tabValue].count > 0 ? statusColors[columns[tabValue].title] : "#9e9e9e",
                        color: "white",
                        fontWeight: "bold",
                        borderRadius: "50%",
                        width: 24,
                        height: 24,
                      }}
                    />
                  </Box>

                  <Box
                    sx={{
                      minHeight: 300,
                      maxHeight: "calc(100vh - 300px)",
                      overflow: "auto",
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
                    {filteredTasksByTab.length > 0 ? (
                      filteredTasksByTab.map((task) => (
                        <DraggableTaskCard key={task.id} task={task} moveTask={moveTask} />
                      ))
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: 200,
                          border: "2px dashed",
                          borderColor: alpha(statusColors[columns[tabValue].title], 0.3),
                          borderRadius: 2,
                          p: 3,
                        }}
                      >
                        <AssignmentIcon
                          sx={{ fontSize: 30, color: alpha(statusColors[columns[tabValue].title], 0.4), mb: 1 }}
                        />
                        <Typography variant="body2" color="text.secondary" align="center" sx={{ fontSize: "0.8rem" }}>
                          Tidak ada tugas di kolom ini.
                          <br />
                          Tambahkan tugas baru.
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  <Button
                    variant="text"
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setNewTask({ ...newTask, status: columns[tabValue].title })
                      setOpenAddDialog(true)
                    }}
                    sx={{
                      mt: 2,
                      color: statusColors[columns[tabValue].title],
                      justifyContent: "flex-start",
                      "&:hover": {
                        bgcolor: alpha(statusColors[columns[tabValue].title], 0.1),
                      },
                    }}
                  >
                    Tambah Tugas
                  </Button>
                </Paper>
              </Box>
            )}
          </Box>
        </Box>
      </Box>

      {/* Add Task Dialog */}
      <Dialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        maxWidth="sm"
        fullWidth
        fullScreen={isMobile}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            bgcolor: "#f5f7fa",
            pb: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Tambah Tugas Baru
          {isMobile && (
            <IconButton edge="end" color="inherit" onClick={() => setOpenAddDialog(false)} aria-label="close">
              <CloseIcon />
            </IconButton>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
            <TextField
              label="Judul Tugas"
              name="title"
              value={newTask.title}
              onChange={handleNewTaskChange}
              fullWidth
              required
            />

            <TextField
              label="Deskripsi"
              name="description"
              value={newTask.description}
              onChange={handleNewTaskChange}
              multiline
              rows={3}
              fullWidth
              required
            />

            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
              }}
            >
              <FormControl fullWidth>
                <InputLabel>Prioritas</InputLabel>
                <Select name="priority" value={newTask.priority} onChange={handleNewTaskChange} label="Prioritas">
                  <MenuItem value="Tinggi">Tinggi</MenuItem>
                  <MenuItem value="Sedang">Sedang</MenuItem>
                  <MenuItem value="Rendah">Rendah</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={newTask.status} onChange={handleNewTaskChange} label="Status">
                  <MenuItem value="Belum Dimulai">Belum Dimulai</MenuItem>
                  <MenuItem value="Sedang Berlangsung">Sedang Berlangsung</MenuItem>
                  <MenuItem value="Ditangguhkan">Ditangguhkan</MenuItem>
                  <MenuItem value="Selesai">Selesai</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              label="Penanggung Jawab"
              name="assignee"
              value={newTask.assignee}
              onChange={handleNewTaskChange}
              fullWidth
              placeholder="Nama penanggung jawab"
              InputProps={{
                startAdornment: <PersonIcon sx={{ mr: 1, color: "text.secondary" }} />,
              }}
            />

            <TextField
              label="Tag (pisahkan dengan koma)"
              name="tags"
              value={newTask.tags.join(", ")}
              onChange={handleTagsChange}
              fullWidth
              placeholder="Frontend, Backend, Design"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setOpenAddDialog(false)} color="inherit">
            Batal
          </Button>
          <Button onClick={handleAddTask} variant="contained" disabled={!newTask.title || !newTask.description}>
            Tambah Tugas
          </Button>
        </DialogActions>
      </Dialog>

      {/* Mobile Filter Drawer */}
      <Drawer anchor="right" open={openFilterDrawer} onClose={toggleFilterDrawer}>
        {filterDrawerContent}
      </Drawer>

      {/* Mobile FAB for adding new task */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setOpenAddDialog(true)}
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
    </CustomDndProvider>
  )
}

export default Ticket
