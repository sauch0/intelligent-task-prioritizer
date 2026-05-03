import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="logo">IntelligentTaskPrioritizer</Link>
            <div className="nav-actions">
                <Link to="/login" className="login-link">Log in</Link>
                <Link to="/signup" className="signup-btn">Start for free</Link>
            </div>
        </nav>
    );
};

export default Navbar;
