/**
 * Responsive drawer component for the menu.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {React.ReactNode} props.children - The children components.
 * @returns {JSX.Element} The rendered menu component.
 */
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Link,
} from "@mui/material";
import SportsBar from "@mui/icons-material/SportsBar";
import HomeIcon from "@mui/icons-material/Home";

import TopBar from "../TopBar";
import styles from "./Menu.module.css";

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

export default function ResponsiveDrawer(props: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <>
      <List
        className={styles.menuList}
        component="nav"
        aria-label="Main navigation"
        role="navigation"
      >
        <Link
          component={RouterLink}
          to={`/`}
          underline="none"
          aria-label="Navigate to home page"
        >
          <ListItem disablePadding className={styles.menuListItem}>
            <ListItemButton role="menuitem" aria-label="Home page">
              <ListItemIcon aria-hidden="true">
                <HomeIcon color={"secondary"} />
              </ListItemIcon>
              <ListItemText primary="Home" color={"secondary"} />
            </ListItemButton>
          </ListItem>
        </Link>
        <Link
          component={RouterLink}
          to={`/beer`}
          underline="none"
          aria-label="Navigate to breweries list"
        >
          <ListItem disablePadding className={styles.menuListItem}>
            <ListItemButton role="menuitem" aria-label="Breweries list page">
              <ListItemIcon aria-hidden="true">
                <SportsBar color={"secondary"} />
              </ListItemIcon>
              <ListItemText primary="Breweries List" color={"secondary"} />
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* Skip to main content link for keyboard users */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <TopBar
        drawerWidth={drawerWidth}
        handleDrawerToggle={handleDrawerToggle}
      />
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="Main navigation drawer"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          aria-label="Mobile navigation menu"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
          aria-label="Desktop navigation menu"
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)`, background: "#f7f7f7" },
        }}
        role="main"
        aria-label="Main content area"
        id="main-content"
        tabIndex={-1}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
