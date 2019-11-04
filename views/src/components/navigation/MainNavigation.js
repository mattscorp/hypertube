import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Account from '../Account.js';
import './MainNavigation.css';

class MainNavigation extends Component {

    // Elements from the advance search
    constructor(props) {
        super(props);
        this.watching = React.createRef();
        this.seen = React.createRef();
        this.gender = React.createRef();
        this.forAll = React.createRef();
        this.rating = React.createRef();
        this.duration = React.createRef();
        this.awards = React.createRef();
        this.decade = React.createRef();
        this.actor = React.createRef();
        this.director = React.createRef();
    }

    // SETS THE ADVANCED SEARCH
    advanceSearchFunction = (event) => {
        this.props.modifAdvancedSearch({
            seen: this.watching.current.value,
            watching: this.seen.current.value,
            gender: this.gender.current.value,
            forAll: this.forAll.current.value,
            rating: this.rating.current.value,
            duration: this.duration.current.value,
            awards: this.awards.current.value,
            decade: this.decade.current.value,
            actor: this.actor.current.value,
            director: this.director.current.value
        });
        this.setSearch(event);
    }

    // RESET THE ADVANCED SEARCH
    clearAdvancedSearch = (event) => {
        event.preventDefault();
        this.props.resetAdvancedSearch();
        this.gender.current.value = 'All';
        this.setSearch(event);
    }

    state = {
        isAccount: false,
        isAdvanced: 0,
        seen: 0
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
            return {isAdvanced: (this.state.isAdvanced == 1) ? 2 : 1};
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
        let genderSearch = "";
        // casse la recherche par titre si actif
        // alert('ICI ' + this.gender.current.value);
        if (this.gender.current !== null) {
            if (this.gender.current.value !== '0')
                genderSearch = `&category=${this.gender.current.value}`;
        }
        if (document.forms[0].querySelector('input[name="search_query"]').value !== '') {
            this.props.changeHomeSearch(document.forms[0].querySelector('input[name="search_query"]').value);
            // this.props.resetFilmsBeforeSearch();
            this.setState(this.props.resetFilmsBeforeSearch());
            let search_query = (document.forms[0].querySelector('input[name="search_query"]').value);
            let URL = `http://localhost:8000/moviedb?action=search&page=${this.props.page}&movie_name=${search_query}${genderSearch}`;
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
            let URL = `http://localhost:8000/moviedb?action=popular&page=${this.props.page}${genderSearch}`;
            alert(URL);
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
                    (this.state.isAdvanced === 1) ?
                    <div className="AdvancedSearchDiv col-md-2">
                        <div className="card-body">
                            <h2>Advanced search</h2>
                            <form>
                                <div>
                                    <label>Seen</label>
                                    <select onChange={this.advanceSearchFunction} ref={this.seen} name="seen">
                                        <option defaultValue>All movies</option>
                                        <option>Seen</option>
                                        <option>Not seen yet</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Watching</label>
                                    <select type="checkbox" name="watching" value="watching" ref={this.watching}>
                                        <option defaultValue>All movies</option>
                                        <option>Watching</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Gender</label>
                                    <select onChange={this.advanceSearchFunction} ref={this.gender}>
                                        <option defaultValue value="All">All</option>
                                        <option value="Action">Action</option>
                                        <option value="Adventure">Adventure</option>
                                        <option value="Animation">Animation</option>
                                        <option value="Comedy">Comedy</option>
                                        <option value="Crime">Crime</option>
                                        <option value="Documentary">Documentary</option>
                                        <option value="Drama">Drama</option>
                                        <option value="Family">Family</option>
                                        <option value="Fantasy">Fantasy</option>
                                        <option value="History">History</option>
                                        <option value="Horror">Horror</option>
                                        <option value="Music">Music</option>
                                        <option value="Mystery">Mystery</option>
                                        <option value="Romance">Romance</option>
                                        <option value="Science Fiction">Science Fiction</option>
                                        <option value="TV Movie">TV Movie</option>
                                        <option value="Thriller">Thriller</option>
                                        <option value="War">War</option>
                                        <option value="Western">Western</option>
                                    </select>
                                </div>
                                <div>
                                    <label>For all</label>
                                    <input ref={this.forAll} type="checkbox" name="forAll" value="forAll"/>
                                </div>
                                <div>
                                    <label>Minimun rating</label>
                                    <input ref={this.rating} type="range" defaultValue="1" name="rating" min="1" max="10"/>
                                </div>
                                <div>
                                    <label>Maximum duration</label>
                                    <select ref={this.duration} name="duration">
                                        <option defaultValue></option>
                                        <option>Less than 1 hour</option>
                                        <option>Less than 2 hours</option>
                                        <option>More than 2 hours</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Awards</label>
                                    <input ref={this.awards} type="checkbox" name="awards" value="awards"/>
                                </div>
                                <div>
                                    <label>Decade</label>
                                    <select ref={this.decade} name="decade">
                                        <option></option>
                                        <option>2010</option>
                                        <option>2000</option>
                                        <option>1990</option>
                                        <option>1980</option>
                                        <option>1970</option>
                                        <option>1960</option>
                                        <option>1950</option>
                                        <option>1940</option>
                                        <option>1930</option>
                                    </select>
                                </div>
                                <div>
                                    <label>Actor</label>
                                    <input ref={this.actor} type="text" name="actor"/>
                                </div>
                                <div>
                                    <label>Director</label>
                                    <input ref={this.director} type="text" name="director"/>
                                </div>
                                <button onClick={this.clearAdvancedSearch}>Clear search</button>
                            </form>
                        </div>
                    </div>
                    : this.state.isAdvanced === 2 ?
                    <div className="DisappearSearchDiv col-md-2">
                        <div className="card-body">
                            <form>
                                <input type="text"/>
                            </form>
                        </div>
                    </div>
                    : null
                }
            </React.Fragment>
        )
    }
}
export default MainNavigation;