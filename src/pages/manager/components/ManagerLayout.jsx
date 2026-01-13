import React from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import DashboardLayout from '../../../components/DashboardLayout';
import { ManagerMenuComponent } from './ManagerMenuComponent';

export const ManagerLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleMenuItemClick = (path) => {
        if (path && path !== '#') {
            navigate(path);
        }
    };

    const structuredMenuItems = ManagerMenuComponent({ onMenuItemClick: handleMenuItemClick });

    const getPageTitle = () => {
        const currentPath = location.pathname;

        // Helper function to find item in a section
        const findItemInSection = (section) => {
            // Check main items
            for (const item of section.items || []) {
                if (currentPath === item.path) return item.text;
                if (currentPath.startsWith(item.path + '/') && item.path !== '/') return item.text;
                
                // Check sub-items
                if (item.subItems) {
                    for (const subItem of item.subItems) {
                        if (currentPath === subItem.path) return subItem.text;
                        if (currentPath.startsWith(subItem.path + '/') && subItem.path !== '/') return subItem.text;
                    }
                }
            }
            return null;
        };

        // Search through all sections
        for (const section of structuredMenuItems) {
            const foundTitle = findItemInSection(section);
            if (foundTitle) return foundTitle;
        }

        // Fallback titles for common routes
        if (currentPath === '/manager-dashboard') return 'Dashboard';
        if (currentPath === '/manager-dashboard/overview') return 'Overview';
        
        // Generic fallbacks based on path segments
        const pathSegments = currentPath.split('/').filter(segment => segment);
        if (pathSegments.length > 1) {
            const lastSegment = pathSegments[pathSegments.length - 1];
            // Convert kebab-case to Title Case
            return lastSegment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }

        return 'Manager Dashboard';
    };

    return (
        <DashboardLayout
            title={getPageTitle()}
            menuItems={structuredMenuItems}
        >
            <Outlet />
        </DashboardLayout>
    );
};