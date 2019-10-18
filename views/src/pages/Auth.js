import React, { Component } from 'react';

// import './Auth.css'

import axios from "axios";

axios.create({
  baseURL: "http://localhost:8000/",
  responseType: "json"
});

class AuthPage extends Component {
    
    state = {
        isLogin: true
    }

    constructor(props) {
        super(props);
        this.loginEl = React.createRef();
        this.passwordEl = React.createRef();

    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        });
    }

    submitHandler = async (event) => {
        event.preventDefault();
        const first_name = this.firstNameEl.current.value;
        const last_name = this.lastNameEl.current.value;
        const login = this.loginEl.current.value;
        const password = this.passwordEl.current.value;
        const confirm_password = this.confirmPasswordEl.current.value;

        if (login.trim().length === 0 || password.trim().length === 0) {
            return;
        } else {
            try {
                const response = await axios.post('http://localhost:8000/auth', { action:"creation", first_name: first_name, last_name: last_name, login: login, password: password, confirm_password: confirm_password });
                console.log('👉 Returned data:', response);
              } catch (e) {
                console.log(`😱 Axios request failed: ${e}`);
              }
            
        }
    };
    
    render () {
        return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header col-md-10 mx-auto mt-2">
                            <div className="row mx-auto">
                                <div className="row mx-auto">
                                    <button className="btn btn-secondary" type="button" onClick={this.switchModeHandler}>{this.state.isLogin ? 'Create an account' : "Sign in to your account"}</button>
                                </div>
                            </div>
                            <div className="col-md-6 mx-auto">
                                <h4 className="text-center">Connect</h4>
                            </div>    
                        </div>
                        <div className="card-body">
                            <form onSubmit={this.submitHandler}>
                                {this.state.isLogin ? null : (
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="firstName">First name</label>
                                    <div className="col-md-6">
                                        <input required className="form-control" title="Only letters, '-' and '_', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="firstName" ref={this.firstNameEl}></input>
                                    </div>
                                </div>
                                )}
                                {this.state.isLogin ? null : (
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="lastName">Last name</label>
                                    <div className="col-md-6">
                                        <input required className="form-control" title="Only letters, '-' and '_'" type="text" pattern="[A-Za-z-]+" id="lastName" ref={this.lastNameEl}></input>
                                    </div>
                                </div>
                                )}
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="login">Login</label>
                                    <div className="col-md-6">
                                        <input required className="form-control" title="Only letters, '-' and '_', minimum 4" type="login" pattern="(?=^.{4,}$)[A-Za-z0-9-_]+" id="login" ref={this.loginEl}></input>
                                    </div>
                                </div>
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="password">Password</label>
                                    <div className="col-md-6">
                                        <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password" ref={this.passwordEl}></input>
                                    </div>
                                </div>
                                {this.state.isLogin ? null : (
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="password_confirm">Confirm your password</label>
                                    <div className="col-md-6">
                                        <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_confirm" ref={this.passwordConfirmEl}></input>
                                    </div>
                                </div>
                                )}
                                <div className="form-actions row">
                                    <div className="mx-auto">
                                        <button className="btn btn-dark" type="submit">{this.state.isLogin ? 'Connect to your account' : "Create your account"}</button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}

export default AuthPage;