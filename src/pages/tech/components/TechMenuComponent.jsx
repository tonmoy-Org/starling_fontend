import React from 'react';
import {
    Dashboard as DashboardIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Build as TechBoxIcon,
    AddCircle as AddIcon,
    History as HistoryIcon,
    Description as FormIcon,
    HealthAndSafety as HealthIcon,
    Security as RiskIcon,
    MenuBook as CourseIcon,
    AccountCircle as AccountIcon,
    PlayCircle as StartIcon,
    TrendingUp as ProgressIcon,
    Edit as EditIcon,
    CheckCircle as SubmitIcon
} from '@mui/icons-material';

export const TechMenuComponent = ({ onMenuItemClick }) => {
    const menuItems = [
        // Dashboard & Daily Work Section
        {
            sectionName: 'Dashboard & Daily Work',
            items: [
                {
                    text: 'Dashboard',
                    icon: <DashboardIcon />,
                    path: '/tech-dashboard'
                },
                {
                    text: 'My Tasks',
                    icon: <AssignmentIcon />,
                    path: '/tech-dashboard/my-tasks'
                },
                {
                    text: 'My Schedule',
                    icon: <ScheduleIcon />,
                    path: '/tech-dashboard/my-schedule'
                },
            ]
        },

        // Tech Box Section
        {
            sectionName: 'Tech Box',
            items: [
                {
                    text: 'Tech Box',
                    icon: <TechBoxIcon />,
                    path: '/tech-dashboard/tech-box'
                },
                {
                    text: 'Add to Tech Box',
                    icon: <AddIcon />,
                    path: '/tech-dashboard/tech-box/add'
                },
                {
                    text: 'Tech Box History',
                    icon: <HistoryIcon />,
                    path: '/tech-dashboard/tech-box/history'
                },
            ]
        },

        // Forms & Reports Section
        {
            sectionName: 'Forms & Reports',
            items: [
                {
                    text: 'Forms',
                    icon: <FormIcon />,
                    path: '/tech-dashboard/forms'
                },
                {
                    text: 'Submit Form',
                    icon: <SubmitIcon />,
                    path: '/tech-dashboard/forms/submit'
                },
                {
                    text: 'Health Department Reports',
                    icon: <HealthIcon />,
                    path: '/tech-dashboard/health-department-reports'
                },
                {
                    text: 'Submit Health Report',
                    icon: <HealthIcon />,
                    path: '/tech-dashboard/health-department-reports/submit'
                },
            ]
        },

        // Risk & Compliance Section
        {
            sectionName: 'Risk & Compliance',
            items: [
                {
                    text: 'Risk Management',
                    icon: <RiskIcon />,
                    path: '/tech-dashboard/risk-management'
                },
                {
                    text: 'Submit Risk Assessment',
                    icon: <SubmitIcon />,
                    path: '/tech-dashboard/risk-management/submit'
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
                    path: '/tech-dashboard/courses'
                },
                {
                    text: 'Course Progress',
                    icon: <ProgressIcon />,
                    path: '/tech-dashboard/courses/progress'
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
                    path: '/tech-dashboard/profile'
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