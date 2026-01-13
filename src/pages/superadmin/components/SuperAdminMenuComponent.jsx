import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    MapPin,
    FileText,
    Bell,
    BellRing,
    ClipboardList,
    History,
    Database,
    User,
    BarChart3,
    AlertTriangle,
    ClipboardCheck,
    Activity,
    ChevronDown,
    ChevronUp,
} from 'lucide-react';

export const SuperAdminMenuComponent = ({ onMenuItemClick }) => {
    const [expandedSections, setExpandedSections] = useState({
        'health-reports': false,
    });

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const menuItems = [
        // 🎯 MAIN SECTION
        {
            sectionName: 'Main',
            sectionId: 'main-section',
            isExpandable: true,
            items: [
                {
                    text: 'Dashboard',
                    icon: <LayoutDashboard size={18} />,
                    path: '/superadmin-dashboard',
                },
                {
                    text: 'Users',
                    icon: <Users size={18} />,
                    path: '/superadmin-dashboard/users',
                },
            ],
        },

        // ⚙️ SYSTEM & CONFIGURATION
        {
            sectionName: 'System & Configuration',
            sectionId: 'system-config-section',
            isExpandable: true,
            items: [
                {
                    text: 'Locations',
                    icon: <MapPin size={18} />,
                    path: '/superadmin-dashboard/locations',
                },
                {
                    text: 'Health Department Reports',
                    icon: <AlertTriangle size={18} />,
                    isExpandable: true,
                    sectionId: 'health-reports',
                    subItems: [
                        {
                            text: 'RME Reports',
                            icon: <ClipboardCheck size={16} />,
                            path: '/superadmin-dashboard/health-department-report-tracking/rme',
                        },
                        {
                            text: 'RSS Reports',
                            icon: <Activity size={16} />,
                            path: '/superadmin-dashboard/health-department-report-tracking/rss',
                        },
                        {
                            text: 'TOS Reports',
                            icon: <BarChart3 size={16} />,
                            path: '/superadmin-dashboard/health-department-report-tracking/tos',
                        },
                    ],
                },
                {
                    text: 'Forms',
                    icon: <FileText size={18} />,
                    path: '/superadmin-dashboard/forms',
                },
                {
                    text: 'Company Notifications',
                    icon: <Bell size={18} />,
                    path: '/superadmin-dashboard/company-notifications',
                },
                {
                    text: 'Reminders',
                    icon: <BellRing size={18} />,
                    path: '/superadmin-dashboard/reminders',
                },
            ],
        },

        // 📊 REPORTS & LOGS
        {
            sectionName: 'Reports & Logs',
            sectionId: 'reports-logs-section',
            isExpandable: true,
            items: [
                {
                    text: 'Audit Logs',
                    icon: <History size={18} />,
                    path: '/superadmin-dashboard/audit-logs',
                },
                {
                    text: 'System Reports',
                    icon: <Database size={18} />,
                    path: '/superadmin-dashboard/system-reports',
                },
                {
                    text: 'Activity History',
                    icon: <ClipboardList size={18} />,
                    path: '/superadmin-dashboard/activity-history',
                },
            ],
        },

        // 👤 PROFILE
        {
            sectionName: 'Profile',
            sectionId: 'profile-section',
            isExpandable: true,
            items: [
                {
                    text: 'My Profile',
                    icon: <User size={18} />,
                    path: '/superadmin-dashboard/profile',
                },
            ],
        },
    ];

    // 🔄 Process menu items (matching ManagerMenuComponent pattern)
    const processedMenuItems = menuItems.map(section => {
        const processedItems = section.items.map(item => {
            if (item.isExpandable) {
                return {
                    ...item,
                    onClick: () => toggleSection(item.sectionId),
                    expanded: expandedSections[item.sectionId] || false,
                    expandIcon: expandedSections[item.sectionId]
                        ? <ChevronUp size={16} />
                        : <ChevronDown size={16} />,
                    subItems: item.subItems?.map(subItem => ({
                        ...subItem,
                        onClick: () => onMenuItemClick(subItem.path),
                    })) || [],
                };
            }

            return {
                ...item,
                onClick: () => onMenuItemClick(item.path),
            };
        });

        return {
            ...section,
            onClick: () => toggleSection(section.sectionId),
            expanded: expandedSections[section.sectionId] || false,
            expandIcon: expandedSections[section.sectionId]
                ? <ChevronUp size={16} />
                : <ChevronDown size={16} />,
            items: processedItems,
        };
    });

    return processedMenuItems;
};