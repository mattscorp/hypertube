const homeSearchReducer = (state = {
    name: "Trending movies"
}, action) => {
    switch (action.type) {
        case "SET_HOME_SEARCH":
            if (action.payload !== '') {
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
        default:
    }
    return state;
};
export default homeSearchReducer;