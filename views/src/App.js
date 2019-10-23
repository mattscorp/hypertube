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


class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <React.Fragment>
          <MainNavigation />
          <main className="mt-2">
            <Switch>
              <Redirect from="/" to="/home" exact/>
              {/* <Redirect from="/" to="/auth" exact/>} */}
              {/* <Redirect from="/auth" to="/account" exact/> */}
              <Route path="/auth" component={ AuthPage }/>}
              <Route path="/account" component={ AccountPage }/>
              {/* <Redirect from="/account" to="/auth" exact/> */}
              <Route path="/home" component={ home }/>
            </Switch>
          </main>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}

export default App;
