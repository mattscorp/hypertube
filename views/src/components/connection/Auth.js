import React, { Component } from 'react';
import instagram from '../../resources/instagram.png';
import forty_two from '../../resources/42.svg';
import facebook from '../../resources/facebook.png';
import google from '../../resources/google.png';
import github from '../../resources/github.png';
import {uuid_42} from '../../config_views';
import {client_github} from '../../config_views';
import {client_google} from '../../config_views';
import {client_instagram} from '../../config_views';
import {client_facebook} from '../../config_views';
import {google_recaptcha_public} from '../../config_views';
import ReCAPTCHA from 'react-google-recaptcha'

class AuthPage extends Component {
    
    state = {
        isLogin: true,
        forgottenPassword: false,
        recaptchaResponse: 0,
    }
    
    constructor(props) {
        super(props);
        this.loginEl = React.createRef();
        this.firstNameEl = React.createRef();
        this.lastNameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordEl = React.createRef();
        this.passwordConfirmEl = React.createRef();
        this.forgottenPasswordEl = React.createRef();
        this.recaptchaEl = React.createRef();
        this.handleCaptchaResponseChange = this.handleCaptchaResponseChange.bind(this);
    }

    /**** CONNECTION WITH OAUTH2 ****/
    // FACEBOOK
    connect_facebook = (event) => {
        event.preventDefault();
        let URI= `https://www.facebook.com/v5.0/dialog/oauth?client_id=${client_facebook}&redirect_uri=http://localhost:3000/oauth_facebook`;
        window.location.assign(URI);
    }
    // INSTAGRAM
    connect_instagram = (event) => {
        event.preventDefault();
        let URI = `https://api.instagram.com/oauth/authorize/?client_id=${client_instagram}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth_insta&response_type=code`;
        window.location.assign(URI);
    }
    // 42
    connect_forty_two = (event, next) => {
        event.preventDefault();
        let URI = `https://api.intra.42.fr/oauth/authorize?client_id=${uuid_42}&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth_ft&response_type=code`;
        window.location.assign(URI);
    }
    // GITHUB
    connect_github = (event) => {
        event.preventDefault();
        let URI = `https://github.com/login/oauth/authorize?client_id=${client_github}&redirect_uri=http://localhost:3000/oauth_github`;
        window.location.assign(URI);
    }
    // GOOGLE
    connect_google = (event) => {
        event.preventDefault();
        let scope = 'https://www.googleapis.com/auth/userinfo.email';
        let URI = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_google}&redirect_uri=http://localhost:3000/oauth_google&scope=${scope}&response_type=code`;
        window.location.assign(URI);
    }

    // SWITCH FROM CONNECTION TO CREATION
    switchModeHandler = () => {
        this.setState(prevState => {
            return {isLogin: !prevState.isLogin};
        });
    }

    // SWITCH FROM CONNECTION TO CREATION
    switchModePassword = (event) => {
        event.preventDefault();
        this.setState(prevState => {
            return {forgottenPassword: !prevState.forgottenPassword};
        });
    }

    // FORGOTTEN PASSWORD
    forgottenPassword = (event) => {
        event.preventDefault();
        if (this.forgottenPasswordEl.current.value.trim() === null || this.forgottenPasswordEl.current.value.trim() === undefined || this.forgottenPasswordEl.current.value.trim() === "")
            alert('Invalid email address');
        else {
            const requestBody = {
                body: `{email: ${this.forgottenPasswordEl.current.value.trim()}}`
            };
            fetch('http://localhost:8000/forgotten_password', {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status === 401)
                  alert("Your email address is not in our database, please create an account.");
                else if (res.status === 200)
                   alert("Please check your mailbox to reset your password.");
                else
                    alert("An error has occured, please try again later");
            })
            .catch(err => {
                alert("An error has occured, please try again later");
            }); 
        }
    }

    handleCaptchaResponseChange(response) {
        this.setState({
          recaptchaResponse: response,
        });
    }

    // MANUAL CONNECTION OR CREATION
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
                if (this.state.recaptchaResponse === 0) {
                    alert('Please tick the Google Recaptcha to prove you are not a robot');
                    return ;
                } else {
                    const first_name = this.firstNameEl.current.value;
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
            }
            fetch('http://localhost:8000/auth', {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status === 201) {
                    alert('Account successfully created');
                    this.switchModeHandler();
                } else if (res.status === 200) {
                    window.location.assign('http://localhost:3000');
                } else if (res.status === 418) {
                    alert('This email is already used');
                } else if (res.status === 419) {
                    alert('This login is already used');
                } else if (res.status === 401) {
                    alert('Invalid login or password');
                } else
                    alert('An error has occured. Please try again later');
            })
            .catch(err => {
                console.log(err);
            });
        }
    };
    
    render () {
        return (
        <div className="container">
            <div className="row justify-content-center under">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header col-md-10 mx-auto mt-2">
                            <div className="row mx-auto">
                                <div className="row mx-auto">
                                    <button className="btn btn-secondary" type="button" onClick={this.switchModeHandler}>{this.state.isLogin ? 'Create an account' : "Sign in to your account"}</button>
                                </div>
                            </div>
                            <div className="col-10 mx-auto pt-2">
                                <h4 className="text-center">{this.state.isLogin ? 'Connect to your account' : "Create your account"}</h4>
                            </div>    
                        </div>
                        <div className="card-body">
                            <form onSubmit={this.submitHandler}>
                                {/* First Name */}
                                {this.state.isLogin ? null : (
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="firstName">First name</label>
                                    <div className="col-md-6">
                                        <input required className="form-control" title="Only letters, '-' and '_', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="firstName" ref={this.firstNameEl}/>
                                    </div>
                                </div>
                                )}
                                {/* Last Name */}
                                {this.state.isLogin ? null : (
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="lastName">Last name</label>
                                    <div className="col-md-6">
                                        <input required className="form-control" title="Only letters, '-' and '_'" type="text" pattern="[A-Za-z-]+" id="lastName" ref={this.lastNameEl}/>
                                    </div>
                                </div>
                                )}
                                {/* Login */}
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="login">Login</label>
                                    <div className="col-md-6">
                                        <input required className="form-control" title="Only letters, '-' and '_', minimum 4" type="login" pattern="(?=^.{4,}$)[A-Za-z0-9-_]+" id="login" ref={this.loginEl}/>
                                    </div>
                                </div>
                                {/* Email */}
                                {this.state.isLogin ? null : (
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="email">Email</label>
                                    <div className="col-md-6">
                                        <input required className="form-control" title="Enter a valid email" type="email" id="email" ref={this.emailEl}/>
                                    </div>
                                </div>
                                )}
                                {/* Password */}
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="password">Password</label>
                                    <div className="col-md-6">
                                        <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password" ref={this.passwordEl}/>
                                    </div>
                                </div>
                                {/* Confirm password */}
                                {this.state.isLogin ? null : (
                                <div className="form-group row">
                                    <label className="col-md-4 col-form-label text-md-right" htmlFor="password_confirm">Confirm your password</label>
                                    <div className="col-md-6">
                                        <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_confirm" ref={this.passwordConfirmEl}/>
                                    </div>
                                </div>
                                )}
                                {/* GOOGLE RECAPTCHA V2 */}
                                {this.state.isLogin ? null : (
                                    <div className="mx-auto">
                                        <ReCAPTCHA
                                            ref={this.recaptchaEl}
                                            sitekey={google_recaptcha_public}
                                            onChange={this.handleCaptchaResponseChange}
                                        />
                                    </div>
                                )}
                                {/* Submit button */}
                                <div className="form-actions row">
                                    <div className="mx-auto">
                                        <button className="btn btn-dark m-2" type="submit">{this.state.isLogin ? 'Connect to your account' : "Create your account"}</button>
                                    </div>
                                </div>
                                {/* Oauth strategies */}
                                <div className="row mx-auto mt-3">
                                    <div onClick={this.connect_facebook} className="mx-auto p-2" >
                                        <img className="img_auth" src={facebook} alt="Connect with Facebook"/>
                                    </div>
                                    <div onClick={this.connect_instagram} className="mx-auto p-2" >
                                        <img className="img_auth" src={instagram} alt="Connect with Instagram"/>
                                    </div>
                                    <div onClick={this.connect_forty_two} className="mx-auto p-2" >
                                        <img className="img_auth p-1" src={forty_two} alt="Connect with 42"/>
                                    </div>
                                    <div onClick={this.connect_github} className="mx-auto p-2" >
                                        <img className="img_auth" src={github} alt="Connect with github"/>
                                    </div>
                                    <div onClick={this.connect_google} className="mx-auto p-2" >
                                        <img className="img_auth" src={google} alt="Connect with google"/>
                                    </div>
                                </div>
                            </form>
                            {/* Reset password button */}
                            <div className="form-actions row">
                                <div className="mx-auto">
                                    {this.state.isLogin ? <button onClick={this.switchModePassword} className="btn btn-dark m-2" type="submit">Forgotten password</button> : null}
                                </div>
                            </div>
                            <form onSubmit={this.forgottenPassword} >
                                {/* Reset password email input */}
                                {this.state.forgottenPassword ? (
                                    <div className="form-actions row">
                                        <div className="mx-auto">
                                            <label className="col-md-4 col-form-label text-md-right" htmlFor="email">Email</label>
                                            <div className="col-md-6">
                                                <input required className="form-control" title="Enter a valid email" type="email" id="email" ref={this.forgottenPasswordEl}/>
                                            </div>
                                            <div className="form-group row">
                                                <div className="mx-auto">
                                                    <button className="btn btn-dark m-2" type="submit">Validate</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : null}
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