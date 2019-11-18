const filmInfosReducer = (state = {
    film_infos: "",
    cast_infos: ""
}, action) => {
    switch (action.type) {
        case "SET_FILM_INFOS":
            state = {
                ...state,
                film_infos: action.payload
            }
            break;
        case "SET_CAST_INFOS":
            state = {
                ...state,
                cast_infos: action.payload
            }
            break;
    }
    return state;
}
export default filmInfosReducer;