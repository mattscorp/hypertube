import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Account from '../Account.js';
import './MainNavigation.css';

class MainNavigation extends Component {

    state = {
        isAccount: false,
        isAdvanced: false
    }

    // SWITCH ON/OFF FOR ACCOUNT DIV
    accountModeHandler = () => {
        this.setState(prevState => {
            return {isAccount: !prevState.isAccount};
        });
    }


    // SWITCH ON/OFF FOR ADVANCED SEARCH DIV
    advancedSearch = () => {
        this.setState(prevState => {
            return {isAdvanced: !prevState.isAdvanced};
        });
    }

    componentDidMount = async () => {
        let URL = 'http://localhost:8000/user_infos';
        fetch(URL, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include'
        })
        .then(res => {
            if (res.status !== 200) {
                this.props.setUserDisconnect()
            } else {
                return res.json();
            }
        })
        .then(resData => {
            if (resData) {
                this.props.setUserConnect(resData[0])
            }
            
        })
    }

    setSearch = (event) => {
        event.preventDefault();
        if (document.forms[0].querySelector('input[name="search_query"]').value !== '') {
            this.props.changeHomeSearch(document.forms[0].querySelector('input[name="search_query"]').value);
            // this.props.resetFilmsBeforeSearch();
            this.setState(this.props.resetFilmsBeforeSearch())
            let search_query = (document.forms[0].querySelector('input[name="search_query"]').value);
            let URL = `http://localhost:8000/moviedb?action=search&page=${this.props.page}&movie_name=${search_query}`;
            fetch(URL, {
                method: 'GET',
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status !== 200 && res.status !== 201)
                    throw new Error('Failed');
                return res.json();
            })
            // CASE FIRST_PAGE_SEARCH
            .then(resData => {this.setState(this.props.firstPageSearch(resData))})
            .catch(err => {
                console.log(err);
            });
        }
        else {
            this.props.changeHomeDiscover();
            this.setState(this.props.resetFilmsBeforeSearch())
            let URL = `http://localhost:8000/moviedb?action=popular&page=${this.props.page}`;
            fetch(URL, {
                method: 'GET',
                credentials: 'include',
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status !== 200 && res.status !== 201)
                    throw new Error('Failed');
                return res.json();
            })
            // CASE LOAD_FILMS
            .then((resData => {this.props.loadFilms(resData)}))
            .catch(err => {
                console.log(err);
            });
            document.getElementById("searchInput").value = "";
        }
    }

    // Clear the searchbar
    clearSearch = () => {
        this.props.changeHomeDiscover();
        this.setState(this.props.resetFilmsBeforeSearch())
        let URL = `http://localhost:8000/moviedb?action=popular&page=${this.props.page}`;
        fetch(URL, {
            method: 'GET',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then(res => {
            if (res.status !== 200 && res.status !== 201)
                throw new Error('Failed');
            return res.json();
        })
        // CASE LOAD_FILMS
        .then((resData => {this.props.loadFilms(resData)}))
        .catch(err => {
            console.log(err);
        });
        document.getElementById("searchInput").value = "";
    }

    render() {
        return (
            <React.Fragment>
                {/* NAVBAR */}
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
                                        <li>
                                            <select>
                                                <option value="en">🇬🇧&emsp;English</option>
                                                <option value="fr">🇫🇷&emsp;French</option>
                                                <option value="es">🇪🇸&emsp;Español</option>
                                                <option value="ru">🇷🇺&emsp;русский</option>
                                                <option value="de">🇩🇪&emsp;Deutsch</option>
                                                <option value="nl">🇳🇱&emsp;Nederlands</option>
                                                <option value="jp">🇯🇵&emsp;日本語</option>
                                                <option value="cn">🇨🇳&emsp;中文</option>
                                            </select>
                                        </li>
                                    </ul>
                                </div>
                            </nav>
                        </div>
                        <div className="col-sm-6 mx-auto">
                            <ul className="navbar-nav row col-12 mx-auto">
                                <li className="nav-item col-12 mx-auto">
                                    <div className="nav-item col-12 mx-auto">
                                        <form id="myForm" className="form-inline mx-auto col-12">
                                            <input onChange={this.setSearch} 
                                                className="form-control col-sm-5 text-center mx-auto" type="text" placeholder="Search" 
                                                name="search_query"
                                                id="searchInput"
                                            />
                                        </form>
                                        <div className="mx-auto flex-row">
                                            <div className="mx-auto">
                                                <button className="btn btn-success mx-auto col-sm-2 text-center" type="submit" onClick={this.advancedSearch}>
                                                    Advanced search
                                                </button>
                                                {(this.props.homeSearch === "Trending movies") ? null :
                                                    <button className="btn btn-success mx-auto col-sm-1 text-center" type="submit" onClick={this.clearSearch}>
                                                        Clear
                                                    </button>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="col-sm-3 float-right float-right">
                            {this.props.userConnectState.uuid ? null : <div className="nav-item float-right"><NavLink to="/auth" className="text-center">Authentification</NavLink></div>}
                            {this.props.userConnectState.uuid ? <div className="nav-item float-right" onClick={this.accountModeHandler}>
                            {(this.props.userConnectState.photo_URL === undefined || this.props.userConnectState.photo_URL === '') ? <button>Account</button> : <button><img title="Account" className="navlink_picture rounded-circle" src={this.props.userConnectState.photo_URL}/></button>}
                            </div> : null}
                        </div>
                    </header>
                </div>
                {/* ACCOUNT SIDEBAR (Onclick on the profile picture - or if not the account <li>) */}
                {this.state.isAccount ? 
                    <Account userConnectState={this.props.userConnectState}/>
                    : null
                }
                {/* ADVANCE SEARCH OPTIONS */}
                {
                    this.state.isAdvanced ?
                    <div className="AdvancedSearchDiv col-md-2">
                        <div className="card-body">
                            Advanced search
                        </div>
                    </div>
                    : null
                }
            </React.Fragment>
        )
    }
}
export default MainNavigation;