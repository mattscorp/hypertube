const viewedFilmsReducer = (state = {
    viewed: []
}, action) => {
    switch (action.type) {
        case "SET_VIEWED_FILMS":
            state = {
                ...state,
                viewed: action.payload
            }
            break;
    }
    return state;
}
export default viewedFilmsReducer;