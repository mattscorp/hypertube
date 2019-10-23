import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

import './MainNavigation.css';

class MainNavigation extends Component {

    submitHandler = (event) => {
        event.preventDefault();
    }

    render() {
        return (
            <div className="row sticky-top">
                        <header className="col-sm-12 navbar navbar-perso navbar-expand-sm bg-light navbar-light ">
                    <div className="col-sm-3"><NavLink to="/">
                            <h1 className="navbar-brand abs main-navigation-logo">HYPERTUBE</h1></NavLink>
                        <nav className="main-navigation-item">
                            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#collapsingNavbar">
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="navbar-collapse collapse" id="collapsingNavbar">
                                <ul className="navbar-nav">
                                    <li className="nav-item"><NavLink to="/home">Home</NavLink></li>
                                    <li className="nav-item"><NavLink to="/auth">Authentification</NavLink></li>
                                    <li className="nav-item"><NavLink to="/account">Account</NavLink></li>
                                    <div>Logout</div>
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div className="col-sm-6"></div>
                    <div className="col-sm-3">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <div className="nav-item">
                                <form className="form-inline" onClick={this.submitHandler}>
                                        <input className="form-control mr-sm-2" type="text" placeholder="Search" /> 
                                        <button className="btn btn-success" type="submit">GO</button>
                                    </form>
                                </div>
                            </li>
                        </ul>
                    </div>
                </header>
            </div>
        )
    }
}
export default MainNavigation;