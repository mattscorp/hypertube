import React, { Component } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
// import { createStore } from 'redux'; 

// const reducer = (state, action) => {
//   switch (action.type) {
//       case "ADD"
//         break;
//       case "SUBSTRACT"
//         break;
//   }
//   return state;
// }
// const store = createStore(reducer, 1);

import home from './pages/Home.js';
import AuthPage from './pages/Auth.js';
import AccountPage from './pages/Account.js';
import MainNavigation from './components/navigation/MainNavigation';
import AuthContext from './context/auth-context';


class App extends Component {
  state = {
    token: null
  };

  login = (token) => {
    this.setState({token: token});
  };

  logout = () => {
    this.setState({token: null});
  };

  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AuthContext.Provider
            value={{
              token: this.state.token,
              login: this.login,
              logout: this.logout
              }}>
            <MainNavigation />
            <main className="mt-2">
              <Switch>
                {this.state.token && <Redirect from="/" to="/home" exact/>}
                {/* {!this.state.token && <Redirect from="/" to="/auth" exact/>} */}
                {this.state.token && <Redirect from="/auth" to="/account" exact/>}
                {!this.state.token && <Route path="/auth" component={ AuthPage }/>} 
                {this.state.token && <Route path="/account" component={ AccountPage }/>}
                {!this.state.token && <Redirect from="/account" to="/auth" exact/>}
                <Route path="/home" component={ home }/>
              </Switch>
            </main>
          </AuthContext.Provider>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
