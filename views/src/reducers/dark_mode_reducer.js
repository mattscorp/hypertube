const darkModeReducer = (state = {
    dark_mode: false
}, action) => {
    switch(action.type) {
        case "SET_DARK_MODE":
            state = {
                dark_mode: true
            }
            break;
        case "STOP_DARK_MODE":
            state = {
                dark_mode: false
            }
            break;
        default:
    }
    return state;
};
export default darkModeReducer;