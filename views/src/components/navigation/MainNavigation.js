import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import Account from '../Account.js';
import './MainNavigation.css';
import AdvancedSearch from '../AdvancedSearch.js';

class MainNavigation extends Component {

    // Elements from the advance search
    constructor(props) {
        super(props);
        this.watching = React.createRef();
        this.seen = React.createRef();
        this.gender = React.createRef();
        this.public = React.createRef();
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
            public: this.public.current.value,
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
        this.props.resetFilmsBeforeSearch()
        this.props.resetAdvancedSearch();
        this.seen.current.value = 'All movies';
        this.gender.current.value = 'All';
        this.watching.current.value = 'All movies';
        this.public.current.value = 'All movies';
        this.rating.current.value = '1';
        this.duration.current.value = '';
        this.awards.current.value = '';
        this.decade.current.value = '';
        this.actor.current.value = '';
        this.director.current.value = '';
        this.setSearch(event);
    }

    state = {
        isAccount: 0,
        isAdvanced: 0,
        seen: 0
    }

    // SWITCH ON/OFF FOR ACCOUNT DIV
    accountModeHandler = () => {
        this.setState(prevState => {
            return {isAccount: (this.state.isAccount === 1) ? 2 : 1};
        });
    }

    // SWITCH ON/OFF FOR ADVANCED SEARCH DIV
    advancedSearch = () => {
        this.setState(prevState => {
            return {isAdvanced: (this.state.isAdvanced === 1) ? 2 : 1};
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
        let public_category = "";
        let rating = "";
        let duration = "";
        let decade = "";
        // casse la recherche par titre si actif
        // alert('ICI ' + this.gender.current.value);
        if (this.gender.current !== null) {
            if (this.gender.current.value !== '0')
                genderSearch = `&category=${this.gender.current.value}`;
        }
        if (this.public.current !== null) {
            if(this.public.current.value !== 'All movies')
                public_category = `&public=G`;
        }
        if (this.rating.current !== null) {
            if(this.rating.current.value !== 'All movies')
                rating = `&rating=${this.rating.current.value}`;
        }
        if (this.duration.current !== null) {
            if(this.duration.current.value !== '')
                duration = `&duration=${this.duration.current.value}`;
        }
        if (this.decade.current !== null) {
            if(this.decade.current.value !== '')
                decade = `&decade=${this.decade.current.value}`;
        }
        if (document.forms[0].querySelector('input[name="search_query"]').value !== '') {
            this.props.changeHomeSearch(document.forms[0].querySelector('input[name="search_query"]').value);
            // this.props.resetFilmsBeforeSearch();
            this.setState(this.props.resetFilmsBeforeSearch());
            let search_query = (document.forms[0].querySelector('input[name="search_query"]').value);
            let URL = `http://localhost:8000/moviedb?action=search&page=${this.props.reloadSearch.page}&movie_name=${search_query}${decade}${genderSearch}${public_category}${rating}${duration}`;
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
            // this.setState(this.props.resetFilmsBeforeSearch());
            this.props.resetFilmsBeforeSearch();
            let URL = `http://localhost:8000/moviedb?action=popular&page=1${genderSearch}${public_category}${rating}${duration}${decade}`;
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
        this.props.resetFilmsBeforeSearch();
        let URL = `http://localhost:8000/moviedb?action=popular&page=${this.props.reloadSearch.page}`;
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
                            <div className="navbar">
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
                            </div>
                        </div>
                        <div className="col-sm-6 mx-auto">
                            <div className=" col-12 mx-auto">
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
                        </div>
                        <div className="col-sm-3 float-right float-right">
                            {this.props.userConnectState.uuid ? null : <div className="float-right"><NavLink to="/auth" className="text-center">Authentification</NavLink></div>}
                            {this.props.userConnectState.uuid ? <div className="float-right" onClick={this.accountModeHandler}>
                            {(this.props.userConnectState.photo_URL === undefined || this.props.userConnectState.photo_URL === '') ? <button>Account</button> : <button><img title="Account" className="navlink_picture rounded-circle" src={this.props.userConnectState.photo_URL}/></button>}
                            </div> : null}
                        </div>
                    </header>
                </div>
                {/* ACCOUNT SIDEBAR (Onclick on the profile picture - or if not the account <li>) */}
                {this.state.isAccount === 1 || this.state.isAccount === 2 ? 
                    <div className={this.state.isAccount === 1 ? "AccountDiv col-md-2" : "DisappearAccountDiv col-md-2"}>
                        <Account
                            userConnectState={this.props.userConnectState}
                            isAccount={this.state.isAccount}
                        />
                    </div>
                    : null
                }
                {/* ADVANCE SEARCH OPTIONS */}
                {(this.state.isAdvanced === 1 || this.state.isAdvanced === 2) ?
                    <div className={this.state.isAdvanced === 1 ? "AdvancedSearchDiv col-md-2 sticky-top" : "DisappearSearchDiv col-md-2"}>
                        <AdvancedSearch
                            advanceSearchFunction={this.advanceSearchFunction}
                            seen={this.seen}
                            watching={this.watching}
                            gender={this.gender}
                            public={this.public}
                            rating={this.rating}
                            duration={this.duration}
                            awards={this.awards}
                            decade={this.decade}
                            actor={this.actor}
                            director={this.director}
                            clearAdvancedSearch={this.clearAdvancedSearch}
                        />
                    </div>
                : null}
            </React.Fragment>
        )
    }
}
export default MainNavigation;