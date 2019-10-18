import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

const MainNavigation = props => {
    return (
        <header className="main-navigation">
            <div className="main-navigation-logo">
                <h1>The nav bar</h1>
            </div>
            <nav className="main-navigation-item">
                <ul>
                    <li><NavLink to="/auth">Authentification</NavLink></li>
                    <li><NavLink to="/account">Account</NavLink></li>
                </ul>
            </nav>
        </header>
    );
};
export default MainNavigation;