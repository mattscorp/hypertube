export function modif_advanced_search(modifAdvancedSearch) {
    return {
        type: "MODIF_ADVANCED_SEARCH",
        payload: modifAdvancedSearch
    }
}

export function reset_advanced_search(resetAdvancedSearch) {
    return {
        type: "RESET_ADVANCED_SEARCH",
        payload: resetAdvancedSearch
    }
}