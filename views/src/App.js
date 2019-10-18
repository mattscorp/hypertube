import React from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';

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
            <Redirect from="/" to="/auth" exact/>
            <Route path="/auth" component={ AuthPage }/>
            <Route path="/account" component={ AccountPage }/>
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
