import { AppBar, IconButton, Toolbar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import beerWikiLogo from '../../images/beerWikiLogo.png';
import styles from './TopBar.module.css';

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
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={props.handleDrawerToggle}
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        <img src={beerWikiLogo} className={styles.topBarLogo} alt="Beer Wiki logo"/>
      </Toolbar>
    </AppBar>
    );
  }

export default TopBar;
