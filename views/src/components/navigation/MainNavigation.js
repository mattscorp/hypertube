import React from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';
import AuthContext from '../../context/auth-context'

const MainNavigation = props => {
    return (
        <AuthContext.Consumer>
            {(context) => {
                return (
                    <header className="navbar navbar-perso navbar-expand-sm bg-light navbar-light sticky-top">
                        <div>
                            <NavLink to="/"><h1 className="navbar-brand abs main-navigation-logo">HYPERTUBE</h1></NavLink>
                        </div>
                        <nav className="main-navigation-item">
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <p>{context.token}</p>
                            <div className="navbar-collapse collapse" id="collapsingNavbar">
                                <ul className="navbar-nav" style={{ display: 'flex', alignItems: 'center' }}>
                                    <li className="nav-item" style={{border: '1px solid blue'}}><NavLink to="/home">Home</NavLink></li>
                                    {!context.token && (
                                        <li className="nav-item" style={{border: '1px solid red'}}><NavLink to="/auth">Authentification</NavLink></li>
                                    )}
                                    {context.token && (
                                        <li className="nav-item" style={{border: '1px solid green'}}><NavLink to="/account">Account</NavLink></li>
                                    )}
                                    {context.token && (
                                        <div onClick={context.logout} style={{border: '1px solid pink'}}>Logout</div>
                                    )}
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