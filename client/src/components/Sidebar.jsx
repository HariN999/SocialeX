import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BiHomeAlt, BiHash, BiMessageSquareDetail, BiUser, BiLogOut, BiMoon, BiSun } from 'react-icons/bi';
import { AuthenticationContext } from '../context/AuthenticationContextProvider';
import { useTheme } from '../context/ThemeContextProvider';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const { logout } = useContext(AuthenticationContext);
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const userId = localStorage.getItem('userId');

    const handleLogoutClick = async () => {
        await logout();
        navigate('/landing');
    };

    return (
        <div className="sidebar-left">
            <div className="sidebar-logo" onClick={() => navigate('/')}>
                <h2>SOCIALEX</h2>
            </div>

            <nav className="sidebar-nav">
                <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <BiHomeAlt className="sidebar-icon" />
                    <span className="sidebar-text">Home</span>
                </NavLink>

                <NavLink to="/explore" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <BiHash className="sidebar-icon" />
                    <span className="sidebar-text">Explore</span>
                </NavLink>

                <NavLink to="/chat" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <BiMessageSquareDetail className="sidebar-icon" />
                    <span className="sidebar-text">Messages</span>
                </NavLink>

                <NavLink to={`/profile/${userId}`} className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                    <BiUser className="sidebar-icon" />
                    <span className="sidebar-text">Profile</span>
                </NavLink>

                <button type="button" className="sidebar-theme-toggle" onClick={toggleTheme}>
                    {isDark ? <BiSun className="sidebar-icon" /> : <BiMoon className="sidebar-icon" />}
                    <span className="sidebar-text">{isDark ? 'Light mode' : 'Dark mode'}</span>
                </button>
            </nav>

            <button className="sidebar-logout" onClick={handleLogoutClick}>
                <BiLogOut className="sidebar-icon" />
                <span className="sidebar-text">Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
