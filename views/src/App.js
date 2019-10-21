import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

import home from './pages/Home.js';
import AuthPage from './pages/Auth.js';
import AccountPage from './pages/Account.js';
import MainNavigation from './components/navigation/MainNavigation';


function App() {
  return (
    <BrowserRouter>
      <React.Fragment>
        <MainNavigation />
        <main className="mt-2">
          <Switch>
            <Redirect from="/" to="/home" exact/>
            <Route path="/auth" component={ AuthPage }/>
            <Route path="/account" component={ AccountPage }/>
            <Route path="/home" component={ home }/>
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
