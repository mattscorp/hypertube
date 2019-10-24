import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import {connect} from 'react-redux';

import Home from './pages/Home.js';
import AuthPage from './pages/Auth.js';
import AccountPage from './pages/Account.js';
import MainNavigation from './components/navigation/MainNavigation';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation changeHomeSearch={() => this.props.setHomeSearch("CHANGED BY GO BUTTON YOLO")}/>
          <main className="mt-2">
            <Switch>
              <Redirect from="/" to="/home" exact/>
              {/* <Redirect from="/" to="/auth" exact/>} */}
              {/* <Redirect from="/auth" to="/account" exact/> */}
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
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(App);