const translationReducer = (state = {
    language: "en",
}, action) => {
    switch (action.type) {
        case "SET_ENGLISH":
            state = {
                ...state,
                language: "en"
            }
            break;
        case "SET_FRENCH":
            state = {
                ...state,
                language: "fr"
            }
            break;
    }
    return state;
}
export default translationReducer;