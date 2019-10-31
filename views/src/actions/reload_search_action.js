export function load_films(loadFilms) {
    return {
        type: "LOAD_FILMS",
        payload: loadFilms
    };
}

export function reset_films_before_search(resetFilmsBeforeSearch) {
    return {
        type: "RESET_FILMS_BEFORE_SEARCH",
        payload: resetFilmsBeforeSearch
    };
}

export function first_page_search(firstPageSearch) {
    return {
        type: "FIRST_PAGE_SEARCH",
        payload: firstPageSearch
    };
}

export function next_page_search(nextPageSearch) {
    return {
        type: "NEXT_PAGE_SEARCH",
        payload: nextPageSearch
    };
}

export function load_more(loadMore) {
    return {
        type: "LOAD_MORE",
        payload: loadMore
    };
}