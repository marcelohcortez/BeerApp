/**
 * Represents the top bar component of the application.
 *
 * @param {number} drawerWidth - The width of the drawer.
 * @param {() => void} handleDrawerToggle - The function to handle the drawer toggle.
 * @returns {JSX.Element} The rendered top bar component.
 */
import { AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import beerWikiLogo from "../../images/beerWikiLogo.png";
import OptimizedImage from "../OptimizedImage";
import styles from "./TopBar.module.css";

interface Props {
  drawerWidth: number;
  handleDrawerToggle: () => void;
}

const TopBar = (props: Props) => {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${props.drawerWidth}px)` },
        ml: { sm: `${props.drawerWidth}px` },
      }}
      component="header"
      role="banner"
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="Toggle navigation menu"
          aria-expanded="false"
          edge="start"
          onClick={props.handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <OptimizedImage
          src={beerWikiLogo}
          alt="Beer Wiki - Navigate to homepage"
          className={styles.topBarLogo}
          width={200}
          height={40}
        />
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
