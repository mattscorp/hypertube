import { fileURLToPath } from "url";

export function set_subtitles(subtitles) {
    return {
        type: "SET_SUBTITLES",
        payload: subtitles
    };
}

export function remove_subtitles() {
    return {
        type: "REMOVE_SUBTITLES",
        payload: ""
    };
}