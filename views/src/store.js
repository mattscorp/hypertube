import { createStore, combineReducers, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import homeSearchReducer from './reducers/search_reducer.js';

export default createStore(
    combineReducers({homeSearch: homeSearchReducer}),
    {},
    applyMiddleware(logger)
);