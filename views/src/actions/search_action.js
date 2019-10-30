export function set_search(homeSearch) {
    return {
        type: "SET_HOME_SEARCH",
        payload: homeSearch
    };
}

export function set_discover(homeDiscover) {
    return {
        type: "SET_HOME_DISCOVER",
        payload: homeDiscover
    };
}