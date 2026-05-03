import React from 'react';
import { Link } from 'react-router-dom';
import appScreenshot from '../assets/app_page.png';

const Landing = () => {
    return (
        <main className="hero">
            <h1>Organize your work <br /> and life, finally.</h1>
            <p>
                Become focused, organized, and calm with the world's first
                task manager that uses intelligence to rank your priorities.
            </p>
            <Link to="/signup" className="cta-main-link">
                <button className="cta-main">Start for free</button>
            </Link>

            {/* This represents your app's dashboard image */}
            <img
                className="app-screenshot"
                src={appScreenshot}
                alt="App Preview"
            />
        </main>
    );
};

export default Landing;
