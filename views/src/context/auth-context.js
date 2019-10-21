import React from 'react'

export default React.createContext({
    token: null,
    user_ID: null,
    login: (token) => {},
    logout: () => {}
});