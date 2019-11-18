export function film_infos(filmInfos) {
    return {
        type: "SET_FILM_INFOS",
        payload: filmInfos
    };
}

export function cast_infos(castInfos) {
    return {
        type: "SET_CAST_INFOS",
        payload: castInfos
    };
}

export function similar_movies(similarMovies) {
    return {
        type: "SET_SIMILAR_MOVIES",
        payload: similarMovies
    };
}