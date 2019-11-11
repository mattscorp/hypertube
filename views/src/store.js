import { createStore, combineReducers, applyMiddleware } from 'redux';
import { logger } from 'redux-logger';
import homeSearchReducer from './reducers/search_reducer.js';
import reloadSearchReducer from './reducers/reload_search_reducer.js';
import userConnectReducer from './reducers/user_connect_reducer.js';
import advancedSearchReducer from './reducers/advanced_search_reducer.js';
import darkModeReducer from './reducers/dark_mode_reducer.js';

export default createStore(
    combineReducers({
        homeSearch: homeSearchReducer,
        reloadSearch: reloadSearchReducer,
        userConnect: userConnectReducer,
        advancedSearch: advancedSearchReducer,
        darkMode: darkModeReducer
    }),
    {},
    applyMiddleware(logger)
);