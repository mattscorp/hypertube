const advancedSearchReducer = (state = {
    seen: 'All movies',
    watching: 'All movies',
    gender: 'All',
    public: 'All movies',
    rating: '1',
    duration: '',
    awards: '',
    decade: '',
    actor: '',
    director: ''
}, action) => {
    switch (action.type) {
        case "MODIF_ADVANCED_SEARCH":
            state = {
                ...state,
                seen: action.payload.seen,
                watching: action.payload.watching,
                gender: action.payload.gender,
                public: action.payload.public,
                rating: action.payload.rating,
                duration: action.payload.duration,
                awards: action.payload.awards,
                decade: action.payload.decade,
                actor: action.payload.actor,
                director: action.payload.director
            }
            break;
        case "RESET_ADVANCED_SEARCH":
            state = {
                ...state,
                seen: 'All movies',
                watching: 'All movies',
                gender: 'All',
                public: 'All movies',
                rating: '1',
                duration: '',
                awards: '',
                decade: '',
                actor: '',
                director: ''
            }
            break;
    }
    return state;
}
export default advancedSearchReducer;