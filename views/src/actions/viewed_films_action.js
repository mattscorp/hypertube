export function set_viewed_films(viewedFilms) {
    return {
        type: "SET_VIEWED_FILMS",
        payload: viewedFilms
    };
}