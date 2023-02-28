import React, { useContext, useEffect, useState } from "react";
import { styled, useTheme } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Groups3Icon from "@mui/icons-material/Groups3";
import DvrIcon from "@mui/icons-material/Dvr";
import { purple } from "@mui/material/colors";
import { Box, Typography } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import SidebarOptions from "./SidebarContext";
import HomeIcon from "@mui/icons-material/Home";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import { baseUrl } from "../APIs/BaseURL";
import { useDispatch } from "react-redux";
import { setEmployees } from "../Redux/employeeSlice";
import { setDepartments } from "../Redux/departmentSlice";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Sidebar = () => {
  const { options, toggleOptions } = useContext(SidebarOptions);
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getData();
  });

  //Get data
  const getData = async () => {
    try{
      const {data} = await baseUrl.get('/')
      dispatch(setEmployees(data.employees))
      dispatch(setDepartments(data.departments))
    }catch(err){
      //handle err
    }
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const getHome = () => {
    toggleOptions('HOME');
    navigate("/");
  };

  const getEmployees = () => {
    toggleOptions('EMPLOYEES');
    navigate("/employees");
  };

  const getDepartments = () => {
    toggleOptions('DEPARTMENTS');
    navigate("/departments");
  };

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar
          sx={{ backgroundColor: purple[500] }}
          position="fixed"
          open={open}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={handleDrawerOpen}
              edge="start"
              sx={{
                marginRight: 5,
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h5"
              noWrap
              component="div"
              sx={{ fontWeight: "500",mr:'auto' }}
            >
              {options.home?'Home':options.employees?'Employees List':'Departments List'}
            </Typography>
              <AdminPanelSettingsIcon sx={{ fontWeight: "500",ml:'auto',fontSize:'3rem' }}/>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </DrawerHeader>
          <List>
            <Divider />
            <ListItem
              disablePadding
              sx={{ display: "block", background: options.home && purple[300]}}
              onClick={getHome}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <HomeIcon
                    sx={{ color: options.home ? "white" : purple[500] }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      type=""
                      sx={{
                        color: options.home ? "white" : purple[500],
                        fontWeight: "500",
                      }}
                    >
                      Home
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{
                display: "block",
                background: options.employees && purple[300],
              }}
              onClick={getEmployees}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <Groups3Icon
                    sx={{ color: options.employees ? "white" : purple[500] }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      type=""
                      sx={{
                        color: options.employees ? "white" : purple[500],
                        fontWeight: "500",
                      }}
                    >
                      Employees List
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem
              disablePadding
              sx={{
                display: "block",
                background: options.departments && purple[300],
              }}
              onClick={getDepartments}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  <DvrIcon
                    sx={{ color: options.departments ? "white" : purple[500] }}
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      type=""
                      sx={{
                        color: options.departments ? "white" : purple[500],
                        fontWeight: "500",
                      }}
                    >
                      Department List
                    </Typography>
                  }
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          <Divider />
          </List>
        </Drawer>
        <Box component="main" sx={{ flexGrow: 1, p: 3, gap: "0.5rem" }}>
          <DrawerHeader />
          <Outlet />
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
