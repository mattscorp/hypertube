const userConnectReducer = (state = {
    uuid: "",
    first_name: "",
    last_name: "",
    login: "",
    photo_URL: "",
    language: "",
    email: "",
    email_confirmation: "",
    insta: "",
    facebook: "",
    github: "",
    google: "",
    ft: "",
    nb_views: "",
    nb_ratings: "",
    nb_comments: ""
}, action) => {
    switch (action.type) {
        case "USER_CONNECT":
            state = {
                uuid: (action.payload.uuid !== null) ? action.payload.uuid : "",
                first_name: (action.payload.first_name !== null) ? action.payload.first_name : "",
                last_name: (action.payload.last_name !== null) ? action.payload.last_name : "",
                login: (action.payload.login !== null) ? action.payload.login : "",
                photo_URL: (action.payload.profile_picture !== null) ? action.payload.profile_picture : "",
                language: (action.payload.language !== null) ? action.payload.language : "",
                email: (action.payload.email !== null) ? action.payload.email : "",
                email_confirmation: (action.payload.email_confirmation !== null) ? action.payload.email_confirmation : "",
                insta: (action.payload.insta !== null) ? action.payload.insta : "",
                facebook: (action.payload.facebook !== null) ? action.payload.facebook : "",
                github: (action.payload.github !== null) ? action.payload.github : "",
                google: (action.payload.google !== null) ? action.payload.google : "",
                ft: (action.payload.ft !== null) ? action.payload.ft : "",
                nb_views: (action.payload.nb_views !== null) ? action.payload.nb_views : "",
                nb_ratings: (action.payload.nb_ratings !== null) ? action.payload.nb_ratings : "",
                nb_comments: (action.payload.nb_comments !== null) ? action.payload.nb_comments : "",
            }
            break;
        case "USER_DISCONNECT":
            state = {
                uuid: "",
                first_name: "",
                last_name: "",
                login: "",
                photo_URL: "",
                language: "",
                email: "",
                email_confirmation: "",
                insta: "",
                facebook: "",
                github: "",
                google: "",
                ft: "",
                nb_views: "",
                nb_ratings: "",
                nb_comments: ""
            }
            break;
        default:
    }
    return state;
};
export default userConnectReducer;