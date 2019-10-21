import React, { Component } from 'react';
import AuthContext from '../context/auth-context';


class AuthPage extends Component {
    
    state = {
        isLogin: true
    }

    static contextType = AuthContext;
     
    constructor(props) {
        super(props);
        this.loginEl = React.createRef();
        this.firstNameEl = React.createRef();
        this.lastNameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.passwordConfirmEl = React.createRef();

    }

    switchModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        });
    }

    submitHandler = event => {
        event.preventDefault();
        if (this.loginEl.current.value.trim().length === 0 || this.passwordEl.current.value.trim().length === 0) {
            return;
        } else {
            const login = this.loginEl.current.value;
            const password = this.passwordEl.current.value;
            let requestBody = '';
            if (this.state.isLogin) {
                requestBody = {
                    body: `{action: "login", login: "${login}", password: "${password}"}`
                };
            } else {
                const first_name =  this.firstNameEl.current.value;
                const last_name = this.lastNameEl.current.value;
                const email = this.emailEl.current.value;
                const confirm_password = this.passwordConfirmEl.current.value;
                requestBody = {
                    body: `{action: "creation", login: "${login}", password: "${password}", first_name: "${first_name}", last_name: "${last_name}", email: "${email}", confirm_password: "${confirm_password}"}`
                };
                if (password !== confirm_password) {
                    alert('Passwords don\'t match');
                    return;
                }
            }
            fetch('http://localhost:8000/auth', {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {'Content-Type': 'application/json'}
            })
                .then(res => {
                    if (res.status !== 200 && res.status !== 201)
                        throw new Error('Failed');
                    return res.json();
                })
                .then(resData => {
                    if (resData.token) {
                        this.context.login(resData.token);
                    }
                    console.log(resData);
                })
                .catch(err => {
                    console.log(err);
                });
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
                            <div className="col-md-10 mx-auto">
                                <h4 className="text-center">{this.state.isLogin ? 'Connect to your account' : "Create your account"}</h4>
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
                                {this.state.isLogin ? null : (
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="email">Email</label>
                                    <div className="col-md-6">
                                        <input required className="form-control" title="Enter a valid email" type="email" id="email" ref={this.emailEl}></input>
                                    </div>
                                </div>
                                )}
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