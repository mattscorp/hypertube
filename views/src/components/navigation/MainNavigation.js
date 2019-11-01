import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { FrenchFlag } from '../../resources/french_flag.png';
import './MainNavigation.css';

class MainNavigation extends Component {

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

    logout = (event) => {
        event.preventDefault();
        console.log('ICI');
        fetch(`http://localhost:8000/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then(() => { window.location.assign('http://localhost:3000'); })
        .catch((err) => { console.log(err); });
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
                                    {this.props.userConnectState.uuid ? null : <li className="nav-item"><NavLink to="/auth">Authentification</NavLink></li>}
                                    {this.props.userConnectState.uuid ? <li className="nav-item">
                                        {this.props.userConnectState.photo_URL == undefined ? <NavLink to="/account">Account</NavLink> : <NavLink to="/account"><img className="navlink_picture" src={this.props.userConnectState.photo_URL}/></NavLink>}
                                        </li> : null}
                                    {this.props.userConnectState.uuid ? <li className="nav-item" onClick={this.logout}><button>Logout</button></li> : null}
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
                    <div className="col-sm-6"></div>
                    <div className="col-sm-3">
                        <ul className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <div className="nav-item">
                                    <form id="myForm" className="form-inline" onClick={this.setSearch}>
                                        <input onChange={this.setSearch} 
                                            className="form-control mr-sm-2" type="text" placeholder="Search" 
                                            name="search_query"
                                            id="searchInput"
                                        />
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