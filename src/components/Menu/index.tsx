/**
 * Responsive drawer component for the menu.
 *
 * @component
 * @param {Props} props - The component props.
 * @param {React.ReactNode} props.children - The children components.
 * @returns {JSX.Element} The rendered menu component.
 */
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
} from '@mui/material';
import SportsBar from '@mui/icons-material/SportsBar';
import HomeIcon from '@mui/icons-material/Home';

import TopBar from '../TopBar';
import styles from './Menu.module.css';

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
      >
        <Link component={RouterLink} to={`/`}>
          <ListItem 
            disablePadding 
            className={styles.menuListItem}
          >
            <ListItemButton>
              <ListItemIcon>
                <HomeIcon color={'secondary'} />
              </ListItemIcon>
              <ListItemText primary='Home' color={'secondary'}/>
            </ListItemButton>
          </ListItem>
        </Link>
        <Link component={RouterLink} to={`/beer`}>
          <ListItem 
            disablePadding
            className={styles.menuListItem}
          >
            <ListItemButton>
              <ListItemIcon>
                <SportsBar  color={'secondary'} />
              </ListItemIcon>
              <ListItemText primary='Beer List' color={'secondary'}/>
            </ListItemButton>
          </ListItem>
        </Link>
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <TopBar drawerWidth={drawerWidth} handleDrawerToggle={handleDrawerToggle} />
      <Box
        component='nav'
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label='mailbox folders'
      >
        <Drawer
          variant='temporary'
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant='permanent'
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component='main'
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)`, background: '#f7f7f7' },
        }}
      >
        <Toolbar />
        {props.children}
      </Box>
    </Box>
  );
}
