import React, { useState } from 'react';
import {
    LayoutDashboard,
    Users,
    ClipboardList,
    BarChart3,
    Briefcase,
    Truck,
    Map,
    MapPin,
    ListChecks,
    FileText,
    Car,
    GraduationCap,
    LibraryBig,
    ChevronDown,
    ChevronUp,
    Database,
    SignalHigh,
} from 'lucide-react';

export const ManagerMenuComponent = ({ onMenuItemClick }) => {
    const [expandedSections, setExpandedSections] = useState({
        'general-section': false,
        'management-section': false,
        'system-section': false,
        'resources-section': false,
        'operations-subsection': false,
        'workorders-subsection': false,
        'assets-subsection': false,
        'reports-subsection': false,
    });

    const toggleSection = (sectionId) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionId]: !prev[sectionId],
        }));
    };

    const menuItems = [
        // 🧭 GENERAL
        {
            sectionName: 'General',
            sectionId: 'general-section',
            isExpandable: true,
            items: [
                {
                    text: 'Dashboard',
                    icon: <LayoutDashboard size={18} />,
                    path: '/manager-dashboard',
                },
                {
                    text: 'Overview',
                    icon: <BarChart3 size={18} />,
                    path: '/manager-dashboard/overview',
                },
                {
                    text: 'Operations',
                    icon: <Briefcase size={18} />,
                    isExpandable: true,
                    sectionId: 'operations-subsection',
                    subItems: [
                        {
                            text: 'Dispatch',
                            icon: <Truck size={16} />,
                            path: '/manager-dashboard/dispatch',
                        },
                        {
                            text: 'Logistics Map',
                            icon: <Map size={16} />,
                            path: '/manager-dashboard/logistics-map',
                        },
                        {
                            text: 'Locates',
                            icon: <MapPin size={16} />,
                            path: '/manager-dashboard/locates',
                        },
                    ],
                },
                {
                    text: 'Work Orders',
                    icon: <ListChecks size={18} />,
                    isExpandable: true,
                    sectionId: 'workorders-subsection',
                    subItems: [], // ✅ empty sub items
                },
            ],
        },

        // 🛠️ MANAGEMENT
        {
            sectionName: 'Management',
            sectionId: 'management-section',
            isExpandable: true,
            items: [
                {
                    text: 'Technicians',
                    icon: <Users size={18} />,
                    path: '/manager-dashboard/technicians',
                },
                {
                    text: 'Sales',
                    icon: <ClipboardList size={18} />,
                    path: '/manager-dashboard/sales',
                },
            ],
        },

        // ⚙️ SYSTEM
        {
            sectionName: 'System',
            sectionId: 'system-section',
            isExpandable: true,
            items: [
                {
                    text: 'Assets',
                    icon: <Database size={18} />,
                    isExpandable: true,
                    sectionId: 'assets-subsection',
                    subItems: [], // ✅ empty sub items
                },
                {
                    text: 'Reports',
                    icon: <SignalHigh size={18} />, 
                    isExpandable: true,
                    sectionId: 'reports-subsection',
                    subItems: [], // ✅ empty sub items
                },
                {
                    text: 'Forms',
                    icon: <FileText size={18} />,
                    path: '/manager-dashboard/forms',
                },
            ],
        },

        // 📚 RESOURCES
        {
            sectionName: 'Resources',
            sectionId: 'resources-section',
            isExpandable: true,
            items: [
                {
                    text: 'Training',
                    icon: <GraduationCap size={18} />,
                    path: '/manager-dashboard/training',
                },
                {
                    text: 'Tasks',
                    icon: <ClipboardList size={18} />,
                    path: '/manager-dashboard/tasks',
                },
                {
                    text: 'Library',
                    icon: <LibraryBig size={18} />,
                    path: '/manager-dashboard/library',
                },
            ],
        },
    ];

    // 🔄 Process menu items
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
                    subItems: item.subItems.map(subItem => ({
                        ...subItem,
                        onClick: () => onMenuItemClick(subItem.path),
                    })),
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
