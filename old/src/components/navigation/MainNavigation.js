import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './MainNavigation.css';

class MainNavigation extends Component {

    setSearch = (event) => {
        event.preventDefault();
        if (document.forms[0].querySelector('input[name="search_query"]').value !== '') {
            this.props.changeHomeSearch(document.forms[0].querySelector('input[name="search_query"]').value);
            
        }
        else
            this.props.changeHomeDiscover();
    }

    clearSearch = (event) => {
        event.preventDefault();
        this.props.changeHomeDiscover();
    }

    logout = (event) => {
        event.preventDefault();
        console.log('ICI');
        fetch(`http://localhost:8000/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then(() => {
            window.location.reload();
        })
        .catch(err => {
            console.log(err);
        })
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
                                    <li className="nav-item" onClick={this.logout}><button>Logout</button></li>
                                </ul>
                            </div>
                        </nav>
                    </div>
                    <div className="col-sm-6"></div>
                    <div className="col-sm-3">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <div className="nav-item">
                                    <form className="form-inline" onClick={this.setSearch}>
                                        <input onChange={this.setSearch} 
                                            className="form-control mr-sm-2" type="text" placeholder="Search" 
                                            name="search_query"
                                        /> 
                                        <button className="btn btn-success" type="submit">
                                            Search
                                        </button>
                                    </form>
                                    {(this.props.homeSearch === "Trending movies") ? null :
                                        <button className="btn btn-success" type="submit" onClick={this.clearSearch}>
                                            Clear
                                        </button>
                                    }
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