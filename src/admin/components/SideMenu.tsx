import React from 'react';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate, useLocation } from 'react-router-dom';

function SideMenu() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <List>
      <ListItem disablePadding>
        <ListItemButton
          selected={location.pathname === '/admin'}
          onClick={() => handleNavigation('/admin')}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="ダッシュボード" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          selected={location.pathname === '/admin/department-and-position'}
          onClick={() => handleNavigation('/admin/department-and-position')}
        >
          <ListItemIcon>
            <PeopleIcon />
          </ListItemIcon>
          <ListItemText primary="部署と役職" />
        </ListItemButton>
      </ListItem>
      <Divider />
      <ListItem disablePadding>
        <ListItemButton
          selected={location.pathname === '/admin/employee-edit'}
          onClick={() => handleNavigation('/admin/employee-edit')}
        >
          <ListItemIcon>
            <EditIcon />
          </ListItemIcon>
          <ListItemText primary="従業員の編集" />
        </ListItemButton>
      </ListItem>
      <Divider />
    </List>
  );
}

export default SideMenu;