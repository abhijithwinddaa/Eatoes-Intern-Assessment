import React, { memo, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ClipboardList,
    BarChart3,
    ChevronLeft,
    Menu
} from 'lucide-react';
import './Sidebar.css';

const navItems = [
    {
        path: '/',
        label: 'Dashboard',
        icon: LayoutDashboard
    },
    {
        path: '/menu',
        label: 'Menu Management',
        icon: UtensilsCrossed
    },
    {
        path: '/orders',
        label: 'Orders',
        icon: ClipboardList
    },
    {
        path: '/analytics',
        label: 'Analytics',
        icon: BarChart3
    }
];

const Sidebar = memo(function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const location = useLocation();

    const toggleCollapse = () => setIsCollapsed(!isCollapsed);
    const toggleMobile = () => setIsMobileOpen(!isMobileOpen);

    const sidebarClasses = [
        'sidebar',
        isCollapsed && 'sidebar-collapsed',
        isMobileOpen && 'sidebar-mobile-open'
    ].filter(Boolean).join(' ');

    return (
        <>
            {/* Mobile Menu Button */}
            <button className="sidebar-mobile-toggle" onClick={toggleMobile}>
                <Menu size={24} />
            </button>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div className="sidebar-overlay" onClick={toggleMobile} />
            )}

            <aside className={sidebarClasses}>
                {/* Logo */}
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <span className="logo-icon">R</span>
                        {!isCollapsed && <span className="logo-text">Restaurant</span>}
                    </div>
                    <button
                        className="sidebar-collapse-btn"
                        onClick={toggleCollapse}
                        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        <ChevronLeft size={18} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="sidebar-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? 'sidebar-link-active' : ''}`
                            }
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <item.icon className="sidebar-link-icon" />
                            {!isCollapsed && <span className="sidebar-link-text">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="sidebar-footer">
                    {!isCollapsed && (
                        <p className="sidebar-footer-text">
                            Admin Dashboard
                            <span className="sidebar-version">v1.0.0</span>
                        </p>
                    )}
                </div>
            </aside>
        </>
    );
});

export default Sidebar;
