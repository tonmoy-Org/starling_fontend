import React from 'react';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    AccountCircle as AccountIcon,
    Settings as SettingsIcon,
    LocationOn as LocationIcon,
    HealthAndSafety as HealthIcon,
    Security as SecurityIcon,
    MenuBook as CourseIcon,
    Description as FormIcon,
    Notifications as NotificationIcon,
    NotificationsActive as ReminderIcon,
    Assignment as ReportIcon,
    History as HistoryIcon,
    Storage as SystemIcon
} from '@mui/icons-material';

export const SuperAdminMenuComponent = ({ onMenuItemClick }) => {
    const menuItems = [
        // Main Section
        {
            sectionName: 'Main',
            items: [
                {
                    text: 'Dashboard',
                    icon: <DashboardIcon />,
                    path: '/superadmin-dashboard'
                },
                {
                    text: 'Users',
                    icon: <PeopleIcon />,
                    path: '/superadmin-dashboard/users'
                },
            ]
        },

        // System & Configuration Section
        {
            sectionName: 'System & Configuration',
            items: [
                {
                    text: 'Tech Box',
                    icon: <SettingsIcon />,
                    path: '/superadmin-dashboard/tech-box'
                },
                {
                    text: 'Locations',
                    icon: <LocationIcon />,
                    path: '/superadmin-dashboard/locations'
                },
                {
                    text: 'Health Department Report Tracking',
                    icon: <HealthIcon />,
                    path: '/superadmin-dashboard/health-department-report-tracking'
                },
                {
                    text: 'Risk Management',
                    icon: <SecurityIcon />,
                    path: '/superadmin-dashboard/risk-management'
                },
                {
                    text: 'Courses',
                    icon: <CourseIcon />,
                    path: '/superadmin-dashboard/courses'
                },
                {
                    text: 'Forms',
                    icon: <FormIcon />,
                    path: '/superadmin-dashboard/forms'
                },
                {
                    text: 'Company Notifications',
                    icon: <NotificationIcon />,
                    path: '/superadmin-dashboard/company-notifications'
                },
                {
                    text: 'Reminders',
                    icon: <ReminderIcon />,
                    path: '/superadmin-dashboard/reminders'
                },
            ]
        },

        // Reports & Logs Section
        {
            sectionName: 'Reports & Logs',
            items: [
                {
                    text: 'Audit Logs',
                    icon: <HistoryIcon />,
                    path: '/superadmin-dashboard/audit-logs'
                },
                {
                    text: 'System Reports',
                    icon: <SystemIcon />,
                    path: '/superadmin-dashboard/system-reports'
                },
                {
                    text: 'Activity History',
                    icon: <ReportIcon />,
                    path: '/superadmin-dashboard/activity-history'
                },
            ]
        },

        // Profile Section
        {
            sectionName: 'Profile',
            items: [
                {
                    text: 'My Profile',
                    icon: <AccountIcon />,
                    path: '/superadmin-dashboard/profile'
                },
            ]
        },
    ];

    // Return structured menu items with section information
    return menuItems.map(section => ({
        ...section,
        items: section.items.map(item => ({
            ...item,
            onClick: () => onMenuItemClick(item.path)
        }))
    }));
};