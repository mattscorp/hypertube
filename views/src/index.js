/*
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
            if (action.payload != '') {
                state = {
                    ...state,
                    name: "Research: " + action.payload,
                };
            }
            break;
        case "SET_HOME_DISCOVER":
            state = {
                ...state,
                name: action.payload
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
*/

import {createStore} from "redux";

const initialState ={
    result : 1,
    lastValues: [] 
};

const reducer = (state = initialState, action) => {
    switch(action.type){
        case "ADD":
            state ={
                ...state,
                result: state.result + action.payload,
            }
            break;
        case "SUB":
            break;
    }
    return state;
};

const store = createStore(reducer);

store.subscribe(() => {
    console.log("store updated", store.getState());
});

store.dispatch({
    type:"ADD",
    payload: 2
});

store.dispatch({
    type:"ADD",
    payload: 10
});

