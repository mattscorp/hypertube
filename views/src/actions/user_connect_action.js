export function user_connect(userInfos) {
    return {
        type: "USER_CONNECT",
        payload: userInfos
    };
}

export function user_disconnect(userInfos) {
    return {
        type: "USER_DISCONNECT",
        payload: userInfos
    };
}