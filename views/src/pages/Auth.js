import React, { Component } from 'react';

import './Auth.css'

import axios from "axios";

axios.create({
  baseURL: "http://localhost:8000/",
  responseType: "json"
});

class AuthPage extends Component {
    
    constructor(props) {
        super(props);
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();

    }

    submitHandler = async (event) => {
        event.preventDefault();
        const email = this.emailEl.current.value;
        const password = this.passwordEl.current.value;

        if (email.trim().length === 0 || password.trim().length === 0) {
            return;
        } else {
            // const requestBody = `{password:"${password}",
            //         email: "${email}"
            //     }` 
          
          
            // fetch('http://localhost:8000/test', {
            //     method: 'GET',
            //     query: {
            //         "password": password,
            //         "email": email
            //     },
            //     headers: {'Content-Type': 'text/plain'}
            // });

            try {
                const response = await axios.post('http://localhost:8000/test', { email: email });
                console.log('👉 Returned data:', response);
              } catch (e) {
                console.log(`😱 Axios request failed: ${e}`);
              }
            
        }
    };
    
    render () {
        return <form className="auth-form" onSubmit={this.submitHandler}>
            <div className="form-control">
                <label htmlFor="email">Email</label>
                <input type="email" id="email" ref={this.emailEl}></input>
            </div>
            <div className="form-control">
                <label htmlFor="password">Password</label>
                <input type="password" id="password" ref={this.passwordEl}></input>
            </div>
            <div className="form-actions">
                <button type="submit">Submit</button>
                <button type="button">Switch to sign up</button>
            </div>
        </form>;
    }
}

export default AuthPage;