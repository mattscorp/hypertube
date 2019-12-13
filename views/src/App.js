import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import {connect} from 'react-redux';
// Redux actions
import { set_discover, set_search } from './actions/search_action.js'
import { load_films, reset_films_before_search, first_page_search, next_page_search, load_more } from './actions/reload_search_action.js'
import { user_connect, user_disconnect } from './actions/user_connect_action.js'
import { modif_advanced_search, reset_advanced_search } from './actions/advanced_search_action.js'
import { set_dark_mode, stop_dark_mode } from './actions/dark_mode_action.js'
import { film_infos, cast_infos, similar_movies, movie_in_db } from './actions/film_infos_action.js'
import "../node_modules/video-react/dist/video-react.css"; // import css

// BOOTSTRAP


// Main pages
import Home from './pages/Home.js';
import Play from './pages/Play.js';
import MainNavigation from './components/navigation/MainNavigation';
import ResetPassword from './components/connection/ResetPassword.js';
import ConfirmEmail from './components/connection/ConfirmEmail.js';
// Authentification pages
import AuthPage from './components/connection/Auth.js';
import OAuth_FT from './components/connection/Oauth_FT.js';
import OAuth_Insta from './components/connection/Oauth_Insta.js';
import OAuth_Github from './components/connection/Oauth_Github.js';
import OAuth_Google from './components/connection/Oauth_Google.js';
import OAuth_Facebook from './components/connection/Oauth_Facebook.js';
// Error 404
import NotFound from './pages/NotFound.js';
// import Error_404 from '.pages/Error404.js'

class App extends Component {

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation 
            changeHomeSearch={(searchQuery) => {this.props.setHomeSearch(searchQuery)}}
            changeHomeDiscover={() => {this.props.setHomeDiscover("Trending movies")}}
            reloadSearch = {this.props.reloadSearch}
            loadFilms={(resData) => {this.props.loadFilms(resData)}}
            resetFilmsBeforeSearch={() => {this.props.resetFilmsBeforeSearch()}}
            firstPageSearch={(resData) => {this.props.firstPageSearch(resData)}}
            homeSearch={this.props.homeSearch.name}
            setUserConnect={(resData) => {this.props.setUserConnect(resData)}}
            setUserDisconnect={(resData) => {this.props.setUserDisconnect(resData)}}
            userConnectState={this.props.userConnect}
            advancedSearchState={this.props.advancedSearch}
            modifAdvancedSearch={(resData) => {this.props.modifAdvancedSearch(resData)}}
            resetAdvancedSearch={() => {this.props.resetAdvancedSearch()}}
            setDarkMode={() => {this.props.setDarkMode()}}
            stopDarkMode={() => {this.props.stopDarkMode()}}
            darkModeState = {this.props.darkModeState.dark_mode}
          />
          <main className={this.props.darkModeState.dark_mode ? " bg-secondary main-all " : "main-all"}>
            <Switch>
              {this.props.userConnect.uuid ? (this.props.userConnect.email_confirmation !== "" ? <Redirect from="/" to="/confirm_email" exact/> : <Redirect from="/" to="/home" exact/>) : <Redirect from="/" to="/auth" exact/>}
              {this.props.userConnect.uuid ? (this.props.userConnect.email_confirmation ? <Redirect from="/auth" to="/confirm_email" exact/> : <Redirect from="/auth" to="/home" exact/>) : <Redirect from="/home" to="/auth" exact/>}
              <Route path="/oauth_insta" component={ OAuth_Insta }/>}
              <Route path="/oauth_ft" component={ OAuth_FT }/>}
              <Route path="/oauth_github" component={ OAuth_Github }/>}
              <Route path="/oauth_google" component={ OAuth_Google }/>}
              <Route path="/oauth_facebook" component={ OAuth_Facebook }/>}
              <Route path="/auth" component={ AuthPage }/>}
              <Route path="/reset_password" component={ ResetPassword }/>}
              <Route path="/confirm_email" component={ ConfirmEmail }/>}
              <Route path="/play" render={
                (props) =>
                  <Play {...props}
                    filmInfosState={this.props.filmInfosState}
                    setFilmInfos={(resData) => {this.props.setFilmInfos(resData)}}
                    setCastInfos={(resData) => {this.props.setCastInfos(resData)}}
                    setSimilarMovies={(resData) => {this.props.setSimilarMovies(resData)}}
                    setMovieInDb={(resData) => {this.props.setMovieInDb(resData)}}
                    darkModeState = {this.props.darkModeState.dark_mode}
                    userConnectState={this.props.userConnect}
                    />
              }/>
              <Route path="/home" render={
                (props) => 
                  <Home {...props} 
                    homeSearch={this.props.homeSearch.name}
                    films={this.props.reloadSearch.films}
                    page={this.props.reloadSearch.page}
                    scrolling={this.props.reloadSearch.scrolling}
                    totalPage={this.props.reloadSearch.totalPage}
                    mode={this.props.reloadSearch.mode}
                    loadFilms={(resData) => {this.props.loadFilms(resData)}}
                    resetFilmsBeforeSearch={() => {this.props.resetFilmsBeforeSearch()}}
                    firstPageSearch={(resData) => {this.props.firstPageSearch(resData)}}
                    nextPageSearch={(resData) => {this.props.nextPageSearch(resData)}}
                    loadMore={(prevState) => {this.props.loadMore(prevState)}}
                    advancedSearchState={this.props.advancedSearch}
                    darkModeState = {this.props.darkModeState.dark_mode}
                    />
                }/>
                <Route path="*" component={NotFound} />
            </Switch>
          </main>
          <div className='footer'>
                <p>Created by mascorpi and pvictor as part of school 42's curriculum, 2019</p>
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

const mapStateToProps  = (state) => {
  return {
    homeSearch: state.homeSearch,
    reloadSearch: state.reloadSearch,
    userConnect: state.userConnect,
    advancedSearch: state.advancedSearch,
    darkModeState: state.darkMode,
    filmInfosState: state.filmInfo
  };
}

const mapDispatchToProps  = (dispatch) => {
  return {
    setHomeSearch: (homeSearch) => {
      dispatch(set_search(homeSearch));
    },
    setHomeDiscover: (homeDiscover) => {
      dispatch(set_discover(homeDiscover));
    }, 
    loadFilms: (loadFilms) => {
      dispatch(load_films(loadFilms));
    }, 
    resetFilmsBeforeSearch: (resetFilmsBeforeSearch) => {
      dispatch(reset_films_before_search(resetFilmsBeforeSearch));
    }, 
    firstPageSearch: (firstPageSearch) => {
      dispatch(first_page_search(firstPageSearch));
    }, 
    nextPageSearch: (nextPageSearch) => {
      dispatch(next_page_search(nextPageSearch));
    }, 
    loadMore: (loadMore) => {
      dispatch(load_more(loadMore));
    },
    setUserConnect: (userInfos) => {
      dispatch(user_connect(userInfos));
    }, 
    setUserDisconnect: (userInfos) => {
      dispatch(user_disconnect(userInfos));
    },
    modifAdvancedSearch: (advancedSearch) => {
      dispatch(modif_advanced_search(advancedSearch));
    },
    resetAdvancedSearch: (advancedSearch) => {
      dispatch(reset_advanced_search(advancedSearch));
    },
    setDarkMode: () => {
      dispatch(set_dark_mode());
    },
    stopDarkMode: () => {
      dispatch(stop_dark_mode());
    },
    setFilmInfos: (filmInfos) => {
      dispatch(film_infos(filmInfos));
    },
    setCastInfos: (filmInfos) => {
      dispatch(cast_infos(filmInfos));
    },
    setSimilarMovies: (filmInfos) => {
      dispatch(similar_movies(filmInfos));
    },
    setMovieInDb: (movieInDb) => {
      dispatch(movie_in_db(movieInDb));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);