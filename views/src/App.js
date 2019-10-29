import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import {connect} from 'react-redux';

import Home from './pages/Home.js';
import AuthPage from './pages/connection/Auth.js';
import OAuth_FT from './pages/connection/Oauth_FT.js';
import OAuth_Github from './pages/connection/Oauth_Github.js';
import AccountPage from './pages/connection/Account.js';
import MainNavigation from './components/navigation/MainNavigation';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation 
            changeHomeSearch={(searchQuery) => {this.props.setHomeSearch(searchQuery)}}
            changeHomeDiscover={() => {this.props.setHomeDiscover("Trending movies")}}
            homeSearch={this.props.homeSearch.name}
          />
          <main className="mt-2">
            <Switch>
              <Redirect from="/" to="/home" exact/>
              {/* <Redirect from="/" to="/auth" exact/>} */}
              {/* <Redirect from="/auth" to="/account" exact/> */}
              <Route path="/oauth_ft" component={ OAuth_FT }/>}
              <Route path="/oauth_github" component={ OAuth_Github }/>}
              <Route path="/auth" component={ AuthPage }/>}
              <Route path="/account" component={ AccountPage }/>
              {/* <Redirect from="/account" to="/auth" exact/> */}
              <Route path="/home" render={(props) => <Home {...props} homeSearch={this.props.homeSearch.name}/>}/>
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

const mapStateToProps  = (state) => {
  return {
    homeSearch: state.homeSearch
  };
}

const mapDispatchToProps  = (dispatch) => {
  return {
    setHomeSearch: (homeSearch) => {
      dispatch({
        type: "SET_HOME_SEARCH",
        payload: homeSearch
      });
    },
    setHomeDiscover: (homeDiscover) => {
      dispatch({
        type: "SET_HOME_DISCOVER",
        payload: homeDiscover
      });
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);