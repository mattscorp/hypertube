// REACT
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// REDUX
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import {Provider} from 'react-redux';

const homeSearchReducer = (state = {
    name: "Trending movies"
}, action) => {
    switch (action.type) {
        case "SET_HOME_SEARCH":
            state = {
                ...state,
                name: action.payload,
            };
            break;
    }
    return state;
};

const store = createStore(
    combineReducers({homeSearch: homeSearchReducer}),
    {},
    applyMiddleware(logger)
);

store.subscribe(() => {

});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root')
);

