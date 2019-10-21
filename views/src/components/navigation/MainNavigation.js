import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';
import AuthContext from '../../context/auth-context'

const MainNavigation = props => {
    return (
        <AuthContext.Consumer>
            {() => {
                return (
                    <header className="navbar navbar-perso navbar-expand-sm bg-light navbar-light sticky-top">
                        <div>
                            <NavLink to="/"><h1 className="navbar-brand abs">HYPERTUBE</h1></NavLink>
                        </div>
                        <nav className="main-navigation-item">
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="navbar-collapse collapse" id="collapsingNavbar">
                                <ul className="navbar-nav">
                                    <li className="nav-item"><NavLink to="/auth">Authentification</NavLink></li>
                                    <li className="nav-item"><NavLink to="/account">Account</NavLink></li>
                                </ul>
                            </div>
                        </nav>
                    </header>
                )
            }}
        </AuthContext.Consumer>
    );
};
export default MainNavigation;