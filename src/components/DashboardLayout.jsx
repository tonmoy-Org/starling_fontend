import React from 'react';
import { styled, useTheme, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import InputBase from '@mui/material/InputBase';
import Badge from '@mui/material/Badge';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useAuth } from '../auth/AuthProvider';
import { useLocation, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';
import logo from '../public/favicon/logo.png';
import miniLogo from '../public/favicon/favicon.ico';
import DashboardFooter from './DashboardFooter';

import {
  LogOut,
  User,
  Menu as MenuIcon,
  ChevronDown,
  ChevronUp,
  Search,
  Bell,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Mail,
  Shield,
  UserCog,
  X,
  Edit,
  ShieldCheck,
  Briefcase,
} from 'lucide-react';

const drawerWidth = 250;
const closedDrawerWidth = 60;
const mobileDrawerWidth = 280;

// Updated color variables
const colors = {
  primary: '#3182ce',
  primaryLight: '#ebf8ff',
  primaryDark: '#2c5282',
  activeBg: '#ebf8ff',
  activeText: '#3182ce',
  activeBorder: '#3182ce',
  drawerBg: '#ffffff',
  textPrimary: '#2d3748',
  textSecondary: '#718096',
  textTertiary: '#a0aec0',
  borderLight: '#e2e8f0',
  hoverBg: '#f7fafc',
  white: '#ffffff',
  black: '#000000',
  sidebarHover: '#f1f5f9',
  sidebarActive: '#e6f7ff',
  appBarBg: 'rgba(255, 255, 255, 0.1)',
};

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: colors.drawerBg,
  borderRight: `1px solid ${colors.borderLight}`,
  boxShadow: '1px 0 4px rgba(0,0,0,0.04)',
  zIndex: theme.zIndex.drawer,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
});

const closedMixin = (theme) => ({
  width: closedDrawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: colors.drawerBg,
  borderRight: `1px solid ${colors.borderLight}`,
  boxShadow: '1px 0 4px rgba(0,0,0,0.04)',
  zIndex: theme.zIndex.drawer,
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(0, 0.5),
  minHeight: 52,
  flexShrink: 0,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  backgroundColor: colors.appBarBg,
  backdropFilter: 'blur(10px)',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`,
  color: colors.textPrimary,
  zIndex: theme.zIndex.drawer - 1,
  transition: theme.transitions.create(['width', 'margin', 'background-color'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin', 'background-color'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const PermanentDrawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: theme.zIndex.drawer,
    ...(open
      ? {
        ...openedMixin(theme),
        '& .MuiDrawer-paper': openedMixin(theme),
      }
      : {
        ...closedMixin(theme),
        '& .MuiDrawer-paper': closedMixin(theme),
      }),
  })
);

const ScrollableBox = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  overflowX: 'hidden',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  '&::-webkit-scrollbar-track': {
    background: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    background: 'transparent',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
});

const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  backgroundColor: alpha('#ffffff', 0.1),
  border: `1px solid ${alpha('#ffffff', 0.3)}`,
  borderRadius: '5px',
  padding: '2px 10px',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: alpha(colors.primary, 0.5),
    backgroundColor: alpha('#ffffff', 0.15),
  },
  '&:focus-within': {
    borderColor: colors.primary,
    backgroundColor: alpha('#ffffff', 0.15),
    boxShadow: `0 0 0 2px ${alpha(colors.primary, 0.1)}`,
  },
  [theme.breakpoints.down('md')]: {
    position: 'fixed',
    top: 60,
    left: 16,
    right: 16,
    zIndex: theme.zIndex.appBar + 1,
    width: 'calc(100% - 32px)',
    backgroundColor: alpha('#ffffff', 0.95),
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    borderColor: colors.primary,
    '&:hover, &:focus-within': {
      borderColor: colors.primary,
      backgroundColor: alpha('#ffffff', 0.95),
    },
  },
}));

const SearchInput = styled(InputBase)(({ theme }) => ({
  color: colors.textPrimary,
  fontSize: '0.8rem',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: '6px 0 6px 6px',
    fontSize: '0.8rem',
    '&::placeholder': {
      color: alpha(colors.textPrimary, 0.7),
      opacity: 1,
      fontSize: '0.8rem',
    },
  },
  [theme.breakpoints.down('md')]: {
    '& .MuiInputBase-input::placeholder': {
      fontSize: '0.85rem',
    },
  },
}));

const MobileSearchBackdrop = styled(Box)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'block',
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: theme.zIndex.appBar + 2,
    backdropFilter: 'blur(2px)',
  },
}));

const MobileSearchButton = styled(IconButton)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    color: colors.textPrimary,
    backgroundColor: alpha('#ffffff', 0.1),
    borderRadius: '5px',
    border: `1px solid ${alpha('#ffffff', 0.3)}`,
    width: 32,
    height: 32,
    '&:hover': {
      backgroundColor: alpha('#ffffff', 0.2),
      color: colors.primary,
    },
  },
}));

const MobileActionsContainer = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
  [theme.breakpoints.down('md')]: {
    display: 'flex',
    alignItems: 'center',
    gap: 0.75,
  },
}));

const DesktopActionsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 1.5,
  flex: 1,
  justifyContent: 'flex-end',
  maxWidth: '550px',
  [theme.breakpoints.down('md')]: {
    display: 'none',
  },
}));

const BreadcrumbContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  minWidth: 0,
  [theme.breakpoints.down('sm')]: {
    display: 'none',
  },
}));

const MobilePageTitle = styled(Typography)(({ theme }) => ({
  display: 'none',
  [theme.breakpoints.down('sm')]: {
    display: 'block',
    fontSize: '0.9rem',
    fontWeight: 600,
    color: colors.textPrimary,
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    maxWidth: '120px',
  },
}));

const HoverMenu = styled(Box)(({ theme }) => ({
  position: 'fixed',
  backgroundColor: colors.appBarBg,
  backdropFilter: 'blur(10px)',
  borderRadius: '6px',
  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  border: `1px solid ${alpha('#ffffff', 0.2)}`,
  zIndex: theme.zIndex.drawer + 20,
  overflow: 'hidden',
  animation: 'fadeIn 0.15s ease-out',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateX(-5px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
}));

const HoverMenuItem = styled(Box)(({ theme }) => ({
  padding: '8px 12px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  fontSize: '0.8rem',
  fontWeight: 500,
  color: colors.textPrimary,
  transition: 'all 0.2s ease',
  backgroundColor: 'transparent',
  '&:hover': {
    backgroundColor: alpha('#ffffff', 0.15),
    color: colors.primary,
  },
  '&.active': {
    backgroundColor: alpha(colors.primary, 0.2),
    color: colors.primary,
    borderLeft: `2px solid ${colors.activeBorder}`,
  },
}));

const DrawerCloseButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 8,
  zIndex: 1,
  width: 28,
  height: 28,
  backgroundColor: alpha(colors.primary, 0.1),
  color: colors.primary,
  '&:hover': {
    backgroundColor: alpha(colors.primary, 0.2),
  },
  [theme.breakpoints.up('md')]: {
    display: 'none',
  },
}));

const generateBreadcrumb = (path) => {
  const pathParts = path.replace(/^\/+/, '').split('/').filter(Boolean);
  const ACRONYMS = new Set(['rme', 'RSS', 'TOS']);
  const SPECIAL_CASES = {
    'rme': 'RME',
    'rss': 'RSS',
    'tos': 'TOS',
  };

  const breadcrumbItems = pathParts.map((part, index) => {
    const decodedPart = decodeURIComponent(part);
    let displayName;

    if (SPECIAL_CASES[decodedPart.toLowerCase()]) {
      displayName = SPECIAL_CASES[decodedPart.toLowerCase()];
    }
    else if (/^[A-Z]+$/.test(decodedPart) || ACRONYMS.has(decodedPart.toLowerCase())) {
      displayName = decodedPart.toUpperCase();
    }
    else if (ACRONYMS.has(decodedPart.toLowerCase())) {
      displayName = decodedPart.toUpperCase();
    }
    else {
      displayName = decodedPart
        .replace(/-/g, ' ')
        .split(' ')
        .map(word => {
          if (ACRONYMS.has(word.toLowerCase())) {
            return word.toUpperCase();
          }
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
    }

    return {
      name: displayName,
      path: '/' + pathParts.slice(0, index + 1).join('/'),
      isLast: index === pathParts.length - 1
    };
  });

  return breadcrumbItems;
};

const getPageTitle = (path) => {
  const pathParts = path.replace(/^\/+/, '').split('/').filter(Boolean);

  if (pathParts.length === 0) {
    return 'Dashboard';
  }

  const lastPart = pathParts[pathParts.length - 1];
  const decodedPart = decodeURIComponent(lastPart);

  return decodedPart
    .replace(/-/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const ProfileDialog = ({ open, onClose, user, userRole }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const getDashboardBasePath = () => {
    const currentPath = location.pathname;

    if (currentPath.startsWith('/super-admin-dashboard')) {
      return '/super-admin-dashboard';
    } else if (currentPath.startsWith('/manager-dashboard')) {
      return '/manager-dashboard';
    } else if (currentPath.startsWith('/tech-dashboard')) {
      return '/tech-dashboard';
    }

    switch (userRole?.toUpperCase()) {
      case 'SUPER-ADMIN':
        return '/super-admin-dashboard';
      case 'MANAGER':
        return '/manager-dashboard';
      case 'TECH':
        return '/tech-dashboard';
      default:
        return '/';
    }
  };

  const getRoleColor = (role) => {
    switch (role?.toUpperCase()) {
      case 'SUPERADMIN':
        return '#dc2626';
      case 'MANAGER':
        return '#059669';
      case 'TECH':
        return '#2563eb';
      default:
        return '#6b7280';
    }
  };

  const getRoleLabel = (role) => {
    switch (role?.toUpperCase()) {
      case 'SUPERADMIN':
        return 'Super Admin';
      case 'MANAGER':
        return 'Manager';
      case 'TECH':
        return 'Technician';
      default:
        return 'User';
    }
  };

  const getRoleIcon = (role) => {
    switch (role?.toUpperCase()) {
      case 'SUPERADMIN':
        return <ShieldCheck size={18} />;
      case 'MANAGER':
        return <Briefcase size={18} />;
      case 'TECH':
        return <UserCog size={18} />;
      default:
        return <User size={18} />;
    }
  };

  const handleEditProfile = () => {
    const basePath = getDashboardBasePath();
    onClose();
    navigate(`${basePath}/profile`);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: '#ffffff',
          borderRadius: '8px',
          border: '1px solid rgba(0,0,0,0.08)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          [theme.breakpoints.down('sm')]: {
            margin: '16px',
            width: 'calc(100% - 32px)',
          },
        }
      }}
    >
      <DialogTitle sx={{
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        pb: 2,
        position: 'relative',
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: alpha(colors.primary, 0.1),
              color: colors.primary,
            }}>
              <User size={20} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{
                color: colors.textPrimary,
                fontSize: '1rem',
                fontWeight: 600,
                lineHeight: 1.2,
              }}>
                User Profile
              </Typography>
              <Typography variant="caption" sx={{
                color: colors.textSecondary,
                fontSize: '0.75rem',
                fontWeight: 400,
              }}>
                View and manage your profile information
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: colors.textSecondary,
              '&:hover': {
                backgroundColor: alpha(colors.textSecondary, 0.1),
                color: colors.textPrimary,
              },
            }}
          >
            <X size={18} />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', mb: 0 }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                bgcolor: colors.primary,
                color: colors.white,
                fontSize: '2rem',
                fontWeight: 600,
                border: '4px solid #ffffff',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                [theme.breakpoints.down('sm')]: {
                  width: 80,
                  height: 80,
                  fontSize: '1.5rem',
                },
              }}
            >
              {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </Avatar>
          </Box>

          <Typography variant="h5" sx={{
            color: colors.textPrimary,
            fontSize: '1.25rem',
            fontWeight: 600,
            mb: 0.5,
            textAlign: 'center',
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.1rem',
            },
          }}>
            {user?.name || 'Jenny Wilson'}
          </Typography>

          <Chip
            icon={getRoleIcon(userRole)}
            label={getRoleLabel(userRole)}
            sx={{
              backgroundColor: alpha(getRoleColor(userRole), 0.1),
              color: getRoleColor(userRole),
              border: `1px solid ${alpha(getRoleColor(userRole), 0.3)}`,
              fontSize: '0.75rem',
              fontWeight: 600,
              height: '28px',
              mb: 3,
              '& .MuiChip-icon': {
                color: getRoleColor(userRole),
                marginLeft: '8px',
              },
            }}
          />
        </Box>

        <Box sx={{
          backgroundColor: colors.hoverBg,
          borderRadius: '8px',
          p: 2.5,
          mb: 2,
          [theme.breakpoints.down('sm')]: {
            p: 2,
          },
        }}>
          <Typography variant="subtitle2" sx={{
            color: colors.textSecondary,
            fontSize: '0.8rem',
            fontWeight: 600,
            mb: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 0.75,
          }}>
            <User size={14} />
            Personal Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box>
              <Typography variant="caption" sx={{
                color: colors.textTertiary,
                fontSize: '0.7rem',
                fontWeight: 500,
                mb: 0.5,
                display: 'block',
              }}>
                Email Address
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Mail size={14} color={colors.textTertiary} />
                <Typography variant="body2" sx={{
                  color: colors.textPrimary,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  wordBreak: 'break-word',
                }}>
                  {user?.email || 'jennywilson@gmail.com'}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{
                color: colors.textTertiary,
                fontSize: '0.7rem',
                fontWeight: 500,
                mb: 0.5,
                display: 'block',
              }}>
                Account Role
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Shield size={14} color={colors.textTertiary} />
                <Typography variant="body2" sx={{
                  color: colors.textPrimary,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}>
                  {getRoleLabel(userRole)}
                </Typography>
              </Box>
            </Box>

            <Box>
              <Typography variant="caption" sx={{
                color: colors.textTertiary,
                fontSize: '0.7rem',
                fontWeight: 500,
                mb: 0.5,
                display: 'block',
              }}>
                Member Since
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Calendar size={14} color={colors.textTertiary} />
                <Typography variant="body2" sx={{
                  color: colors.textPrimary,
                  fontSize: '0.85rem',
                  fontWeight: 500,
                }}>
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  }) : 'January 2024'}
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{
        p: 2.5,
        pt: 2,
        borderTop: '1px solid rgba(0,0,0,0.06)',
        justifyContent: 'space-between',
      }}>
        <Button
          onClick={handleEditProfile}
          variant="outlined"
          startIcon={<Edit size={16} />}
          sx={{
            textTransform: 'none',
            fontSize: '0.85rem',
            fontWeight: 500,
            color: colors.primary,
            borderColor: colors.borderLight,
            '&:hover': {
              borderColor: colors.primary,
              backgroundColor: alpha(colors.primary, 0.04),
            },
          }}
        >
          Edit Profile
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const NestedMenuItem = ({ item, level = 0, isDrawerOpen, getActiveStyles, handleNavigation, isMobile, location, onCloseDrawer, onExpandToggle }) => {
  const isExpandable = item.isExpandable;
  const isExpanded = item.expanded;
  const [hoverMenuAnchor, setHoverMenuAnchor] = React.useState(null);
  const [hoverTimeout, setHoverTimeout] = React.useState(null);

  const isItemActive = (path) => {
    if (!path) return false;
    const currentPath = location.pathname;
    if (currentPath === path) return true;
    if (path !== '/super-admin-dashboard' && path !== '/manager-dashboard' && path !== '/tech-dashboard' && currentPath.startsWith(path + '/')) {
      return true;
    }
    if (path === '/manager-dashboard' && currentPath === '/manager-dashboard') {
      return true;
    }
    if (path !== '/super-admin-dashboard' && path !== '/manager-dashboard' && path !== '/tech-dashboard' && currentPath === path) {
      return true;
    }
    return false;
  };

  const isActive = isItemActive(item.path);

  const handleMouseEnter = (event) => {
    if (!isDrawerOpen && !isMobile) {
      clearTimeout(hoverTimeout);
      setHoverMenuAnchor(event.currentTarget);
    }
  };

  const handleMouseLeave = () => {
    if (!isDrawerOpen && !isMobile) {
      const timeout = setTimeout(() => {
        setHoverMenuAnchor(null);
      }, 200);
      setHoverTimeout(timeout);
    }
  };

  const handleHoverMenuMouseEnter = () => {
    clearTimeout(hoverTimeout);
  };

  const handleHoverMenuMouseLeave = () => {
    const timeout = setTimeout(() => {
      setHoverMenuAnchor(null);
    }, 200);
    setHoverTimeout(timeout);
  };

  const handleItemClick = (event) => {
    event.preventDefault();
    event.stopPropagation();

    // If item is expandable and has no path, just toggle expansion
    if (isExpandable && !item.path) {
      if (onExpandToggle) {
        onExpandToggle(item.text);
      }
      return;
    }

    // If item has a path (navigation item), handle navigation
    if (item.path) {
      // Check if it's an external URL (starts with http:// or https://)
      if (item.path.startsWith('http://') || item.path.startsWith('https://')) {
        // Open external link in new tab
        window.open(item.path, '_blank');
      } else {
        // Internal navigation - close drawer on mobile
        handleNavigation(item.path);
        if (isMobile && onCloseDrawer) {
          onCloseDrawer();
        }
      }
    } else if (item.onClick) {
      item.onClick(event);
    }
    setHoverMenuAnchor(null);
  };

  const mainButton = (
    <ListItemButton
      component="div"
      onClick={handleItemClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      sx={[
        getActiveStyles(item.path),
        {
          minHeight: 40,
          flexDirection: isDrawerOpen ? 'row' : 'column',
          justifyContent: isDrawerOpen ? 'flex-start' : 'center',
          alignItems: 'center',
          gap: isDrawerOpen ? 1.25 : 0.25,
          px: isDrawerOpen ? 2.25 : 1.25,
          py: isDrawerOpen ? 0.5 : 0.75,
          pl: isDrawerOpen ? 2.25 + (level * 2) : 1.25,
          '& .MuiListItemIcon-root': {
            minWidth: 0,
            mr: isDrawerOpen ? 1.25 : 0,
            justifyContent: 'center',
          },
          '& .MuiListItemText-root': {
            m: 0,
            display: isDrawerOpen ? 'block' : 'none', // Hide text when drawer is closed
          },
          textDecoration: 'none',
          cursor: 'pointer',
        },
        isExpandable && {
          pr: 1.25,
        }
      ]}
    >
      <ListItemIcon>
        {React.cloneElement(item.icon, {
          sx: {
            width: 18,
            height: 18,
            color: 'inherit',
          }
        })}
      </ListItemIcon>
      {isDrawerOpen && (
        <ListItemText
          primary={
            <Typography sx={{
              fontSize: '0.8rem',
              fontWeight: 500,
              lineHeight: 1.2,
              color: 'inherit',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              letterSpacing: '0.01em',
            }}>
              {item.text}
            </Typography>
          }
        />
      )}
      {isExpandable && isDrawerOpen && (
        <ListItemIcon sx={{
          minWidth: 0,
          ml: 'auto',
          color: 'inherit',
          opacity: 0.7
        }}>
          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </ListItemIcon>
      )}
    </ListItemButton>
  );

  const wrappedButton = isDrawerOpen || !isMobile ? (
    mainButton
  ) : (
    <Tooltip
      title={item.text}
      placement="right"
      arrow
      componentsProps={{
        tooltip: {
          sx: {
            backgroundColor: colors.textPrimary,
            fontSize: '0.75rem',
            padding: '3px 6px',
            borderRadius: '3px',
          }
        },
        arrow: {
          sx: {
            color: colors.textPrimary,
          }
        }
      }}
    >
      {mainButton}
    </Tooltip>
  );

  const renderHoverMenu = () => {
    if (!hoverMenuAnchor || isDrawerOpen || isMobile) return null;

    const rect = hoverMenuAnchor.getBoundingClientRect();
    const hasSubItems = item.subItems && item.subItems.length > 0;

    return (
      <HoverMenu
        onMouseEnter={handleHoverMenuMouseEnter}
        onMouseLeave={handleHoverMenuMouseLeave}
        sx={{
          left: rect.right + 4,
          top: rect.top,
          minWidth: 180,
          maxWidth: 250,
        }}
      >
        {/* Main item */}
        <HoverMenuItem
          onClick={handleItemClick}
          className={isActive ? 'active' : ''}
          sx={{
            fontWeight: 600,
            borderBottom: hasSubItems ? `1px solid ${alpha('#ffffff', 0.2)}` : 'none',
          }}
        >
          {React.cloneElement(item.icon, { size: 16, color: isActive ? colors.primary : colors.textPrimary })}
          <span>{item.text}</span>
          {item.path && (item.path.startsWith('http://') || item.path.startsWith('https://')) && (
            <Box component="span" sx={{ ml: 'auto', fontSize: '0.7rem', opacity: 0.7 }}>
              ↗
            </Box>
          )}
        </HoverMenuItem>

        {/* Sub-items */}
        {hasSubItems && item.subItems.map((subItem, index) => {
          const isSubItemActive = isItemActive(subItem.path);
          const hasNestedSubItems = subItem.subItems && subItem.subItems.length > 0;
          const isSubItemExternal = subItem.path && (subItem.path.startsWith('http://') || subItem.path.startsWith('https://'));

          return (
            <React.Fragment key={index}>
              {/* Sub-item with its own navigation */}
              <HoverMenuItem
                onClick={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                  if (isSubItemExternal) {
                    window.open(subItem.path, '_blank');
                  } else if (subItem.path) {
                    handleNavigation(subItem.path);
                  } else if (subItem.onClick) {
                    subItem.onClick(event);
                  }
                  setHoverMenuAnchor(null);
                }}
                className={isSubItemActive ? 'active' : ''}
                sx={{
                  pl: 3,
                }}
              >
                {subItem.icon && React.cloneElement(subItem.icon, {
                  size: 14,
                  color: isSubItemActive ? colors.primary : colors.textPrimary
                })}
                <span>{subItem.text}</span>
                {isSubItemExternal && (
                  <Box component="span" sx={{ ml: 'auto', fontSize: '0.7rem', opacity: 0.7 }}>
                    ↗
                  </Box>
                )}
              </HoverMenuItem>

              {/* Nested sub-items */}
              {hasNestedSubItems && subItem.subItems.map((nestedItem, nestedIndex) => {
                const isNestedItemActive = isItemActive(nestedItem.path);
                const isNestedItemExternal = nestedItem.path && (nestedItem.path.startsWith('http://') || nestedItem.path.startsWith('https://'));

                return (
                  <HoverMenuItem
                    key={`${index}-${nestedIndex}`}
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      if (isNestedItemExternal) {
                        window.open(nestedItem.path, '_blank');
                      } else if (nestedItem.path) {
                        handleNavigation(nestedItem.path);
                      } else if (nestedItem.onClick) {
                        nestedItem.onClick(event);
                      }
                      setHoverMenuAnchor(null);
                    }}
                    className={isNestedItemActive ? 'active' : ''}
                    sx={{
                      pl: 5,
                    }}
                  >
                    {nestedItem.icon && React.cloneElement(nestedItem.icon, {
                      size: 12,
                      color: isNestedItemActive ? colors.primary : colors.textPrimary
                    })}
                    <span style={{ fontSize: '0.75rem' }}>{nestedItem.text}</span>
                    {isNestedItemExternal && (
                      <Box component="span" sx={{ ml: 'auto', fontSize: '0.65rem', opacity: 0.7 }}>
                        ↗
                      </Box>
                    )}
                  </HoverMenuItem>
                );
              })}
            </React.Fragment>
          );
        })}
      </HoverMenu>
    );
  };

  return (
    <React.Fragment>
      <ListItem
        disablePadding
        sx={{
          display: 'block',
          position: 'relative',
        }}
      >
        {wrappedButton}
        {renderHoverMenu()}
      </ListItem>

      {isExpandable && isExpanded && item.subItems && isDrawerOpen && (
        <List sx={{
          py: 0,
          pl: 0,
          backgroundColor: level === 0 ? alpha(colors.textTertiary, 0.05) : 'transparent'
        }}>
          {item.subItems.map((subItem, index) => (
            <NestedMenuItem
              key={subItem.text || index}
              item={subItem}
              level={level + 1}
              isDrawerOpen={isDrawerOpen}
              getActiveStyles={getActiveStyles}
              handleNavigation={handleNavigation}
              isMobile={isMobile}
              location={location}
              onCloseDrawer={onCloseDrawer}
              onExpandToggle={onExpandToggle}
            />
          ))}
        </List>
      )}
    </React.Fragment>
  );
};

export default function DashboardLayout({ children, title, menuItems }) {
  const theme = useTheme();
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

  const [open, setOpen] = React.useState(!isMobile);
  const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
  const [profileDialogOpen, setProfileDialogOpen] = React.useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  const [expandedItems, setExpandedItems] = React.useState(new Set());

  React.useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => setOpen(!open);
  const handleDrawerClose = () => setOpen(false);

  const getInitials = (name) =>
    name?.split(' ').map((n) => n[0]).join('').toUpperCase() || 'U';

  const breadcrumbItems = generateBreadcrumb(location.pathname);
  const pageTitle = getPageTitle(location.pathname);

  const getUserRole = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const parsed = JSON.parse(userData);
        return parsed.role || parsed.userType || 'USER';
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
    return 'USER';
  };

  const userRole = getUserRole();

  const isRouteActive = (path) => {
    if (!path) return false;
    const currentPath = location.pathname;

    if (currentPath === path) return true;

    if (path !== '/super-admin-dashboard' && path !== '/manager-dashboard' && path !== '/tech-dashboard' && currentPath.startsWith(path + '/')) {
      return true;
    }

    if (path === '/manager-dashboard' && currentPath === '/manager-dashboard') {
      return true;
    }

    if (path !== '/super-admin-dashboard' && path !== '/manager-dashboard' && path !== '/tech-dashboard' && currentPath === path) {
      return true;
    }

    return false;
  };

  const getActiveStyles = (path) => {
    const isActive = isRouteActive(path);

    if (isActive) {
      return {
        color: `${colors.primary} !important`,
        backgroundColor: colors.activeBg,
        borderLeft: `2px solid ${colors.activeBorder}`,
        '& .MuiListItemIcon-root': {
          color: colors.primary,
        },
        '&:hover': {
          backgroundColor: alpha(colors.primary, 0.15),
          color: `${colors.primary} !important`,
        },
        borderRadius: '0 5px 5px 0',
        transition: 'all 0.15s ease',
        mx: 0.5,
        my: 0.25,
      };
    }

    return {
      color: colors.textSecondary,
      backgroundColor: 'transparent',
      '& .MuiListItemIcon-root': {
        color: colors.textSecondary,
      },
      '&:hover': {
        backgroundColor: colors.sidebarHover,
        color: colors.primary,
        '& .MuiListItemIcon-root': {
          color: colors.primary,
        },
      },
      borderRadius: '0 5px 5px 0',
      transition: 'all 0.15s ease',
      mx: 0.5,
      my: 0.25,
    };
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleProfileClick = () => {
    setProfileDialogOpen(true);
    handleMenuClose();
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate('/login');
  };

  const handleNavigation = (path) => {
    if (path) {
      // Check if it's an external URL (starts with http:// or https://)
      if (path.startsWith('http://') || path.startsWith('https://')) {
        // Open external link in new tab
        window.open(path, '_blank');
      } else {
        // Internal navigation
        navigate(path);
      }

      // Close drawer on mobile after actual navigation
      if (isMobile) {
        setOpen(false);
      }
    }
  };

  const handleBreadcrumbClick = (path) => {
    if (path) {
      navigate(path);
      // Close drawer on mobile after breadcrumb navigation
      if (isMobile) {
        setOpen(false);
      }
    }
  };

  const handleProfileDialogClose = () => {
    setProfileDialogOpen(false);
  };

  const toggleMobileSearch = () => {
    setMobileSearchOpen(!mobileSearchOpen);
  };

  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false);
  };

  const handleExpandToggle = (itemText) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemText)) {
        newSet.delete(itemText);
      } else {
        newSet.add(itemText);
      }
      return newSet;
    });
  };

  const processMenuItems = (items) => {
    return items.map(item => ({
      ...item,
      expanded: expandedItems.has(item.text),
      subItems: item.subItems ? processMenuItems(item.subItems) : undefined,
    }));
  };

  const processedMenuItems = menuItems?.map(section => ({
    ...section,
    items: processMenuItems(section.items || [])
  }));

  const renderDrawerContent = () => (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      color: colors.textPrimary,
      '& .MuiListItemIcon-root': {
        color: 'inherit',
      },
      '& .MuiTypography-root': {
        color: 'inherit',
      },
      '& .MuiDivider-root': {
        borderColor: colors.borderLight,
      },
      position: 'relative',
    }}>
      {isMobile && (
        <DrawerCloseButton onClick={handleDrawerClose}>
          <X size={16} />
        </DrawerCloseButton>
      )}

      <DrawerHeader>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: open ? 'flex-start' : 'center',
          width: '100%',
          px: open ? 2 : 1,
        }}>
          {open ? (
            <img
              src={logo}
              alt="Logo"
              style={{
                width: '140px',
                height: 'auto',
              }}
            />
          ) : (
            <Box sx={{
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <img
                src={miniLogo}
                alt="Logo"
                style={{
                  width: '28px',
                  height: '28px',
                  objectFit: 'contain',
                }}
              />
            </Box>
          )}
        </Box>
      </DrawerHeader>
      <ScrollableBox sx={{ py: 0.5 }}>
        {processedMenuItems?.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            {open && section.sectionName && (
              <Box sx={{
                px: 2.5,
                py: 0.75,
                mb: 0.25,
              }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: colors.textTertiary,
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    display: 'block',
                  }}
                >
                  {section.sectionName}
                </Typography>
              </Box>
            )}

            <List sx={{ py: 0.25 }}>
              {section.items.map((item, index) => (
                <NestedMenuItem
                  key={item.text || index}
                  item={item}
                  level={0}
                  isDrawerOpen={open}
                  getActiveStyles={getActiveStyles}
                  handleNavigation={handleNavigation}
                  isMobile={isMobile}
                  location={location}
                  onCloseDrawer={handleDrawerClose}
                  onExpandToggle={handleExpandToggle}
                />
              ))}
            </List>
          </React.Fragment>
        ))}
      </ScrollableBox>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      {mobileSearchOpen && (
        <MobileSearchBackdrop onClick={handleMobileSearchClose} />
      )}

      <AppBar
        position="fixed"
        open={open && !isMobile}
        sx={{
          zIndex: theme.zIndex.drawer - 1,
          backgroundColor: colors.appBarBg,
          backdropFilter: 'blur(10px)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          px: { xs: 1.5, sm: 0 }
        }}
      >
        <Toolbar sx={{
          minHeight: 56,
          px: { xs: 1.5, sm: 2.5 },
          py: { xs: 1, sm: 0 },
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 1.5,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {!isMobile ? (
              <IconButton
                onClick={handleDrawerToggle}
                edge="start"
                sx={{
                  marginLeft: open ? -1.5 : 5.5,
                  width: 32,
                  height: 32,
                  borderRadius: '5px',
                  border: `1px solid ${alpha('#ffffff', 0.3)}`,
                  backgroundColor: alpha('#ffffff', 0.9),
                  color: colors.textPrimary,
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.95),
                    borderColor: alpha('#ffffff', 0.5),
                  },
                }}
              >
                {open ? (
                  <ChevronLeft size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </IconButton>
            ) : (
              <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerToggle}
                edge="start"
                sx={{
                  color: colors.textPrimary,
                  borderRadius: '5px',
                  backgroundColor: alpha('#ffffff', 0.9),
                  border: `1px solid ${alpha('#ffffff', 0.3)}`,
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.95),
                  },
                }}
              >
                <MenuIcon size={18} />
              </IconButton>
            )}

            <MobilePageTitle>
              {pageTitle}
            </MobilePageTitle>

            <BreadcrumbContainer>
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 600,
                  color: colors.textPrimary,
                  fontSize: '0.95rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.01em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                {breadcrumbItems.map((item, index) => (
                  <React.Fragment key={item.path || `item-${index}`}>
                    {index > 0 && (
                      <Box
                        component="span"
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mx: 0.5,
                        }}
                      >
                        <ChevronRight size={14} color={alpha(colors.textPrimary, 0.7)} />
                      </Box>
                    )}
                    <Box
                      component="span"
                      onClick={() => !item.isLast && handleBreadcrumbClick(item.path)}
                      sx={{
                        color: item.isLast ? colors.primary : alpha(colors.textPrimary, 0.9),
                        cursor: item.isLast ? 'default' : 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: item.isLast ? 600 : 500,
                        '&:hover': !item.isLast ? {
                          color: colors.primary,
                          textDecoration: 'underline',
                        } : {},
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.25,
                      }}
                    >
                      {item.name}
                      {item.isLast && (
                        <Box sx={{
                          width: 4,
                          height: 4,
                          borderRadius: '50%',
                          backgroundColor: colors.primary,
                          ml: 0.5,
                        }} />
                      )}
                    </Box>
                  </React.Fragment>
                ))}
              </Typography>
            </BreadcrumbContainer>
          </Box>

          <DesktopActionsContainer>
            <SearchContainer sx={{ width: '280px' }}>
              <Search size={16} color={alpha(colors.textPrimary, 0.7)} />
              <SearchInput
                placeholder="Q Search"
                inputProps={{ 'aria-label': 'search' }}
              />
            </SearchContainer>

            <IconButton
              sx={{
                color: colors.textPrimary,
                backgroundColor: alpha('#ffffff', 0.1),
                borderRadius: '5px',
                border: `1px solid ${alpha('#ffffff', 0.3)}`,
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.2),
                  color: colors.primary,
                },
              }}
            >
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.55rem',
                    height: '14px',
                    minWidth: '14px',
                  }
                }}
              >
                <Bell size={16} />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0.5,
                borderRadius: '5px',
                border: `1px solid ${alpha('#ffffff', 0.3)}`,
                backgroundColor: alpha('#ffffff', 0.1),
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.2),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: colors.primary,
                  color: colors.white,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 0.5,
                  minWidth: 160,
                  backgroundColor: colors.appBarBg,
                  backdropFilter: 'blur(10px)',
                  color: colors.textPrimary,
                  border: `1px solid ${alpha('#ffffff', 0.2)}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.8rem',
                    py: 0.5,
                    px: 1.25,
                    color: colors.textPrimary,
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.15),
                      color: colors.primary,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'inherit',
                      minWidth: 32,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{
                px: 1.25,
                py: 0.75,
                borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: colors.primary,
                    color: colors.white,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{
                    fontWeight: 600,
                    color: colors.textPrimary,
                    fontSize: '0.8rem',
                    lineHeight: 1.2,
                  }}>
                    {user?.name || 'Jenny Wilson'}
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: alpha(colors.textPrimary, 0.7),
                    fontSize: '0.7rem',
                    lineHeight: 1.2,
                  }}>
                    {user?.email || 'jennywilson@gmail.com'}
                  </Typography>
                </Box>
              </Box>
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <User size={16} color={colors.textPrimary} />
                </ListItemIcon>
                <Typography sx={{ fontSize: '0.8rem', color: 'inherit' }}>Profile</Typography>
              </MenuItem>
              <Divider sx={{
                my: 0.5,
                borderColor: alpha('#ffffff', 0.2),
              }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut size={16} color={colors.textPrimary} />
                </ListItemIcon>
                <Typography sx={{ fontSize: '0.8rem', color: 'inherit' }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </DesktopActionsContainer>

          <MobileActionsContainer>
            <MobileSearchButton onClick={toggleMobileSearch}>
              <Search size={16} />
            </MobileSearchButton>

            <IconButton
              sx={{
                color: colors.textPrimary,
                backgroundColor: alpha('#ffffff', 0.1),
                borderRadius: '5px',
                border: `1px solid ${alpha('#ffffff', 0.3)}`,
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.2),
                  color: colors.primary,
                },
              }}
            >
              <Badge
                badgeContent={3}
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    fontSize: '0.55rem',
                    height: '14px',
                    minWidth: '14px',
                  }
                }}
              >
                <Bell size={16} />
              </Badge>
            </IconButton>

            <IconButton
              onClick={handleMenuOpen}
              sx={{
                p: 0.5,
                borderRadius: '5px',
                border: `1px solid ${alpha('#ffffff', 0.3)}`,
                backgroundColor: alpha('#ffffff', 0.1),
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.2),
                },
              }}
            >
              <Avatar
                sx={{
                  width: 28,
                  height: 28,
                  bgcolor: colors.primary,
                  color: colors.white,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {getInitials(user?.name)}
              </Avatar>
            </IconButton>

            <Menu
              anchorEl={menuAnchorEl}
              open={Boolean(menuAnchorEl)}
              onClose={handleMenuClose}
              PaperProps={{
                sx: {
                  mt: 0.5,
                  minWidth: 160,
                  backgroundColor: colors.appBarBg,
                  backdropFilter: 'blur(10px)',
                  color: colors.textPrimary,
                  border: `1px solid ${alpha('#ffffff', 0.2)}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  '& .MuiMenuItem-root': {
                    fontSize: '0.8rem',
                    py: 0.5,
                    px: 1.25,
                    color: colors.textPrimary,
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.15),
                      color: colors.primary,
                    },
                    '& .MuiListItemIcon-root': {
                      color: 'inherit',
                      minWidth: 32,
                    },
                  },
                },
              }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
            >
              <Box sx={{
                px: 1.25,
                py: 0.75,
                borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}>
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: colors.primary,
                    color: colors.white,
                    fontSize: '0.75rem',
                    fontWeight: 600,
                  }}
                >
                  {getInitials(user?.name)}
                </Avatar>
                <Box>
                  <Typography variant="subtitle2" sx={{
                    fontWeight: 600,
                    color: colors.textPrimary,
                    fontSize: '0.8rem',
                    lineHeight: 1.2,
                  }}>
                    {user?.name || 'Jenny Wilson'}
                  </Typography>
                  <Typography variant="caption" sx={{
                    color: alpha(colors.textPrimary, 0.7),
                    fontSize: '0.7rem',
                    lineHeight: 1.2,
                  }}>
                    {user?.email || 'jennywilson@gmail.com'}
                  </Typography>
                </Box>
              </Box>
              <MenuItem onClick={handleProfileClick}>
                <ListItemIcon>
                  <User size={16} color={colors.textPrimary} />
                </ListItemIcon>
                <Typography sx={{ fontSize: '0.8rem', color: 'inherit' }}>Profile</Typography>
              </MenuItem>
              <Divider sx={{
                my: 0.5,
                borderColor: alpha('#ffffff', 0.2),
              }} />
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogOut size={16} color={colors.textPrimary} />
                </ListItemIcon>
                <Typography sx={{ fontSize: '0.8rem', color: 'inherit' }}>Logout</Typography>
              </MenuItem>
            </Menu>
          </MobileActionsContainer>
        </Toolbar>
      </AppBar>

      {mobileSearchOpen && (
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: theme.zIndex.appBar + 4,
          backgroundColor: colors.appBarBg,
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          animation: 'slideDown 0.2s ease-out',
          '@keyframes slideDown': {
            from: {
              transform: 'translateY(-100%)',
            },
            to: {
              transform: 'translateY(0)',
            },
          },
        }}>
          <Box sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}>
            <SearchContainer sx={{ flex: 1 }}>
              <Search size={16} color={alpha(colors.textPrimary, 0.7)} />
              <SearchInput
                placeholder="Search everything..."
                inputProps={{ 'aria-label': 'search' }}
                autoFocus
              />
            </SearchContainer>
            <IconButton
              onClick={handleMobileSearchClose}
              sx={{
                color: colors.textPrimary,
                backgroundColor: alpha('#ffffff', 0.1),
                borderRadius: '5px',
                border: `1px solid ${alpha('#ffffff', 0.3)}`,
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.2),
                  color: colors.primary,
                },
              }}
            >
              <X size={16} />
            </IconButton>
          </Box>
        </Box>
      )}

      {isMobile ? (
        <MuiDrawer
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              width: mobileDrawerWidth,
              backgroundColor: colors.drawerBg,
              borderRight: `1px solid ${colors.borderLight}`,
              '&::-webkit-scrollbar': {
                display: 'none',
              },
              msOverflowStyle: 'none',
              scrollbarWidth: 'none',
              top: 0,
              height: '100%',
              zIndex: theme.zIndex.drawer + 10,
            },
            '& .MuiBackdrop-root': {
              zIndex: theme.zIndex.drawer + 9,
            },
          }}
        >
          {renderDrawerContent()}
        </MuiDrawer>
      ) : (
        <PermanentDrawer variant="permanent" open={open}>
          {renderDrawerContent()}
        </PermanentDrawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          backgroundColor: '#f7fafc',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <DrawerHeader />

        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            p: { xs: 1, sm: 1 },
            pt: { xs: 3, md: 2.5 },
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: colors.white,
              borderRadius: '6px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              border: `1px solid ${colors.borderLight}`,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: { xs: 1, sm: 2 },
                overflowY: 'auto',
                overflowX: 'hidden',
                '&::-webkit-scrollbar': {
                  width: '5px',
                  height: '5px',
                },
                '&::-webkit-scrollbar-track': {
                  background: '#f1f5f9',
                  borderRadius: '2px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: '#cbd5e0',
                  borderRadius: '2px',
                  '&:hover': {
                    background: '#a0aec0',
                  },
                },
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e0 #f1f5f9',
              }}
            >
              {children}
            </Box>
          </Box>
        </Box>

        <Box sx={{
          borderTop: `1px solid ${colors.borderLight}`,
          backgroundColor: colors.white,
          py: 1,
          px: { xs: 1, sm: 2 }
        }}>
          <DashboardFooter />
        </Box>
      </Box>

      <ProfileDialog
        open={profileDialogOpen}
        onClose={handleProfileDialogClose}
        user={user}
        userRole={userRole}
      />
    </Box>
  );
}