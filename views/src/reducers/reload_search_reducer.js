const reloadSearchReducer = (state = {
    films: [],
    totalPage: null,
    page: 1,
    scrolling: false,
    mode: null
}, action) => {
    switch (action.type) {
        case "LOAD_FILMS":
            state = {
                ...state,
                films: [...state.films, ...action.payload],
                scrolling: false,
                totalPage: action.payload.totalPage
            }
            break;
        case "RESET_FILMS_BEFORE_SEARCH":
            state = {
                ...state,
                films: [],
                page: 1,
                scrolling: false,
                mode: null
            }
            break;
        case "FIRST_PAGE_SEARCH":
            state = {
                ...state,
                films: [...action.payload],
                page: 1,
                scrolling: false,
                totalPage: action.payload.totalPage
            }
            break;
        case "NEXT_PAGE_SEARCH":
            state = {
                ...state,
                films: [...state.films, ...action.payload],
                scrolling: false,
                totalPage: action.payload.totalPage
            }
            break;
        case "LOAD_MORE":
            state = {
                ...state,
                page : action.payload.page + 1,
                scrolling: true
            }
            break;
    }
    return state;
};
export default reloadSearchReducer;