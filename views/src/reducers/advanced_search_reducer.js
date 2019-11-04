const advancedSearchReducer = (state = {
    seen: 'all',
    watching: 'all',
    gender: 'all',
    forAll: 'all',
    rating: '1',
    duration: 'all',
    awards: 'all',
    decade: 'all',
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
                forAll: action.payload.forAll,
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
                seen: 'all',
                watching: 'all',
                gender: 'all',
                forAll: 'all',
                rating: '1',
                duration: 'all',
                awards: 'all',
                decade: 'all',
                actor: '',
                director: ''
            }
            break;
    }
    return state;
}
export default advancedSearchReducer;