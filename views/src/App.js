import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import AuthPage from './pages/Auth.js';
import AccountPage from './pages/Account.js';
import MainNavigation from './components/navigation/MainNavigation';
import AuthContext from './context/auth-context';

function App() {
  state = {
    token: null
  }

  login = (token) => {
    this.setState({token: token});
  };

  logout = () => {
    this.setState({token: null});
  }

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider value={{token: this.state.token, login: this.login, logout: this.logout }}>
          <MainNavigation />
          <main className="mt-2">
            <Switch>
              <Redirect from="/" to="/auth" exact/>
              <Route path="/auth" component={ AuthPage }/>
              <Route path="/account" component={ AccountPage }/>
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
