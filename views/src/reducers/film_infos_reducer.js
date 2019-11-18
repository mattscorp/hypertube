const filmInfosReducer = (state = {
    film_infos: "",
    cast_infos: "",
    similar_movies: ""
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
        case "SET_SIMILAR_MOVIES":
            state ={
                ...state,
                similar_movies: action.payload
            }
    }
    return state;
}
export default filmInfosReducer;