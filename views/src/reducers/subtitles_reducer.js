const subtitlesReducer = (state = {
    subtitles: []
}, action) => {
    switch (action.type) {
        case "SET_SUBTITLES":
            state = {
                ...state,
                subtitles: action.payload
            }
            break;
        case "REMOVE_SUBTITLES":
            state = {
                ...state,
                subtitles: []
            }
            break;
    }
    return state;
}
export default subtitlesReducer;