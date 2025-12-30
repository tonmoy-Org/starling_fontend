import React from 'react';
import {
    Dashboard as DashboardIcon,
    People as PeopleIcon,
    Assignment as AssignmentIcon,
    AccountCircle as AccountIcon,
    Notifications as NotificationsIcon,
    HealthAndSafety as HealthIcon,
    Security as SecurityIcon,
    Schedule as ScheduleIcon,
    TrendingUp as PerformanceIcon,
    History as HistoryIcon,
    Description as FormIcon,
    MenuBook as CourseIcon,
    Task as TaskIcon,
    Visibility as ReviewIcon,
    CheckCircle as ApprovalIcon,
    Assessment as AssessmentIcon,
    PersonAdd as AssignIcon
} from '@mui/icons-material';

export const ManagerMenuComponent = ({ onMenuItemClick }) => {
    const menuItems = [
        // Dashboard & Overview Section
        {
            sectionName: 'Dashboard & Overview',
            items: [
                {
                    text: 'Dashboard',
                    icon: <DashboardIcon />,
                    path: '/manager-dashboard'
                },
                {
                    text: 'Overview',
                    icon: <AssessmentIcon />,
                    path: '/manager-dashboard/overview'
                },
                {
                    text: 'Notifications',
                    icon: <NotificationsIcon />,
                    path: '/manager-dashboard/notifications'
                },
            ]
        },

        // Reports & Tracking Section
        {
            sectionName: 'Reports & Tracking',
            items: [
                {
                    text: 'Health Department Reports',
                    icon: <HealthIcon />,
                    path: '/manager-dashboard/health-department-reports'
                },
                {
                    text: 'Risk Management',
                    icon: <SecurityIcon />,
                    path: '/manager-dashboard/risk-management'
                },
            ]
        },

        // Technician Management Section
        {
            sectionName: 'Technician Management',
            items: [
                {
                    text: 'Technicians',
                    icon: <PeopleIcon />,
                    path: '/manager-dashboard/techs'
                },
                {
                    text: 'Scheduling',
                    icon: <ScheduleIcon />,
                    path: '/manager-dashboard/techs/schedule'
                },
                {
                    text: 'Performance',
                    icon: <PerformanceIcon />,
                    path: '/manager-dashboard/techs/performance'
                },
                {
                    text: 'Tech History',
                    icon: <HistoryIcon />,
                    path: '/manager-dashboard/techs/history'
                },
            ]
        },

        // Forms & Compliance Section
        {
            sectionName: 'Forms & Compliance',
            items: [
                {
                    text: 'Forms',
                    icon: <FormIcon />,
                    path: '/manager-dashboard/forms'
                },
                {
                    text: 'Review Forms',
                    icon: <ReviewIcon />,
                    path: '/manager-dashboard/forms/review'
                },
                {
                    text: 'Form Approval',
                    icon: <ApprovalIcon />,
                    path: '/manager-dashboard/forms/approval'
                },
            ]
        },

        // Courses & Training Section
        {
            sectionName: 'Courses & Training',
            items: [
                {
                    text: 'Courses',
                    icon: <CourseIcon />,
                    path: '/manager-dashboard/courses'
                },
                {
                    text: 'Assign Courses',
                    icon: <AssignIcon />,
                    path: '/manager-dashboard/courses/assign'
                },
                {
                    text: 'Progress Tracking',
                    icon: <TaskIcon />,
                    path: '/manager-dashboard/courses/progress'
                },
            ]
        },

        // Tasks Section
        {
            sectionName: 'Tasks',
            items: [
                {
                    text: 'Tasks',
                    icon: <AssignmentIcon />,
                    path: '/manager-dashboard/tasks'
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
                    path: '/manager-dashboard/profile'
                },
            ]
        },
    ];

    // Return structured menu items with onClick handlers
    return menuItems.map(section => ({
        ...section,
        items: section.items.map(item => ({
            ...item,
            onClick: () => onMenuItemClick(item.path)
        }))
    }));
};