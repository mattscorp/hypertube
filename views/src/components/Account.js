import React, { Component } from 'react';
import NoPhoto from '../resources/no_image.jpeg'
import axios from "axios";
import translations from '../translations.js';
import {fetch_post} from '../fetch.js';

class Account extends Component {

    constructor(props) {
        super(props);
        this.darkModeEl = React.createRef();
        this.loginEl = React.createRef();
        this.firstNameEl = React.createRef();
        this.lastNameEl = React.createRef();
        this.emailEl = React.createRef();
        this.passwordOldEl = React.createRef();
        this.passwordConfirmEl = React.createRef();
        this.passwordNewEl = React.createRef();
        this.profilePictureEl = React.createRef();
        this.language = React.createRef();
        this.state ={
            file: null
        };
        this.profilePictureForm = this.profilePictureForm.bind(this);
        this.onChangePicture = this.onChangePicture.bind(this);
    }

    // LOGOUT
    logout = (event) => {
        event.preventDefault();
        fetch(`http://localhost:8000/logout`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then(() => { window.location.assign('http://localhost:3000'); })
        .catch((err) => { console.log(err); });
    }

    // SWITCH ON/OFF DARK MODE
    setDarkMode = (event) => {
        this.props.darkModeState ? this.props.stopDarkMode() : this.props.setDarkMode();
        fetch(`http://localhost:8000/dark_mode`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'}
        })
        .then((res) => {
            if (res.status === 401)
                window.location.assign('/');
        })
        .catch((err) => { console.log(err); });
    }

    // UPDATE ACCOUNT DATA (login, email, first and last names)
    submitAccountForm = (event) => {
        event.preventDefault();
        if (this.loginEl.current.value.trim().length === 0 || this.emailEl.current.value.trim().length === 0 || this.firstNameEl.current.value.trim().length === 0 || this.lastNameEl.current.value.trim().length === 0) {
            alert("Values can't be empty");
            return;
        } else {
            let URL = 'http://localhost:8000/update_account';
            let requestBody = {
                body: `{login: "${this.loginEl.current.value.trim()}", email: "${this.emailEl.current.value.trim()}", first_name: "${this.firstNameEl.current.value.trim()}", last_name: "${this.lastNameEl.current.value.trim()}"}`
            };
            fetch(URL, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status === 401)
                    window.location.assign('/');
                else if (res.status === 201)
                    alert('Information updated');
                else
                    alert('An error has occured');
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    // CHANGE PASSWORD
    submitPasswordForm = (event) => {
        event.preventDefault();
        if (this.passwordConfirmEl.current.value.trim().length === 0 || this.passwordNewEl.current.value.trim().length === 0 || this.passwordOldEl.current.value.trim().length === 0) {
            alert("Values can't be empty");
            return;
        } if (this.passwordConfirmEl.current.value.trim() !== this.passwordNewEl.current.value.trim()) {
            alert('Passwords don\'t match');
            return;
        } else {
            const URL = 'http://localhost:8000/update_password';
            const requestBody = {
                body: `{login: "${this.props.userConnectState.login}", new_password: "${this.passwordNewEl.current.value.trim()}", confirm_password: "${this.passwordConfirmEl.current.value.trim()}", old_password: "${this.passwordOldEl.current.value.trim()}"}`
            };
            fetch(URL, {
                credentials: 'include',
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {'Content-Type': 'application/json'}
            })
            .then(res => {
                if (res.status === 201)
                    alert('Password has been successfully changed');
                else if (res.status === 418)
                    alert('Passwords don\'t match');
                else if (res.status === 401)
                    alert('The old password is incorrect')
                else
                    alert('An error has occured');
            })
            .catch(err => {
                console.log(err);
            })
        }
    }

    // CHANGE PHOTO
    onChangePicture(e) {
        this.setState({file:e.target.files[0]});
    }
    profilePictureForm = (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('myImage',this.state.file);
        const URL = 'http://localhost:8000/profile_picture';
        const config = {
            withCredentials: true,
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        axios.post(URL, formData, config)
        .then(res => {
            if (res.status === 401) {
                alert('Error : you need to reconnect');
                window.location.assign('/');
            } else if (res.status === 400) {
                alert('Only jpeg, jpg and png files are supported.');
            } else if (res.status === 200) {
                let URL = 'http://localhost:8000/user_infos';
                fetch(URL, {
                    method: 'POST',
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include'
                })
                .then(res => {
                    if (res.status === 401)
                        window.location.assign('/');
                    else if (res.status !== 200) {
                        this.props.setUserDisconnect()
                    } else {
                        return res.json();
                    }
                })
                .then(resData => {
                    if (resData) {
                        this.props.setUserConnect(resData[0]);
                        if (resData[0].dark_mode === 1)
                            this.props.setDarkMode();
                    }
                })
                alert('Your profile picture has been successfully updated');
            }
        })
    }

    change_language = (event) => {
        event.preventDefault();
        let body = {};
        if (this.language.current.value === "en") {
            this.props.setEnglish();
            body = {'language': "en"}
        }
        else if (this.language.current.value === "fr") {
            this.props.setFrench();
            body = {'language': "fr"}
        }
        fetch_post('/update_language', body)
    }

    render() {
        return (
            <div className="AccountContainer-fluid">
                <br />
                {this.props.userConnectState.uuid ? <div className="nav-item overflow-auto col-xs-12 mt-2" onClick={this.logout}><button className="btn btn-outline-danger btn-lg">Logout</button></div> : null}
                {/* Title */}

                    {/*<h1 className="text-muted">{translations[this.props.translationState].account.header}</h1>*/}
                {/* Dark mode toggle */}
                        <label htmlFor="darkMode">{translations[this.props.translationState].account.dark_mode}</label>
                        <label className="switch">
                            <input onClick={this.setDarkMode} type="checkbox" ref={this.darkModeEl} defaultChecked={this.props.darkModeState}/>
                            <span className="slider round"></span>
                        </label>
                {/* Change language */}
                    <select className="selectpicker show-tick" defaultValue={this.props.translationState} onChange={this.change_language}  ref={this.language}>
                        <option value="en">{translations[this.props.translationState].main_navigation.english}</option>
                        <option value="fr">{translations[this.props.translationState].main_navigation.french}</option>
                    </select>
                {/* Profile picture */}
                    <label  htmlFor="darkMode">{translations[this.props.translationState].account.profile_picture}</label>
                    {!this.props.userConnectState.photo_URL ? <img alt="" className="profile_picture" src={NoPhoto}/> : <img alt="" className="profile_picture" src={this.props.userConnectState.photo_URL.replace('views/public', '.')}/>}
                    {/* Update profile picture */}
                    <form onSubmit={this.profilePictureForm}>
                          <br /> <input onChange={this.onChangePicture} required type="file" accept="image/png, image/jpeg, image/jpg" title="Update picture" ref={this.profilePictureEl}/>
                           <br /><button className="btn btn-outline-success">{translations[this.props.translationState].account.update_profile_picture}</button>
                    </form>
                
                {/* Accout form (always available) */}
                <form onSubmit={this.submitAccountForm}>
                        <label className="col-form-label text-md-center" htmlFor="firstName">{translations[this.props.translationState].account.first_name}</label><br />
                            <input required className="form-control" title="Only letters and '-', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="firstName" ref={this.firstNameEl} defaultValue={this.props.userConnectState.first_name}/>
                        <label className="col-form-label text-md-center" htmlFor="lastName">{translations[this.props.translationState].account.last_name}</label>
                            <input required className="form-control" title="Only letters and '-', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="lastName" ref={this.lastNameEl} defaultValue={this.props.userConnectState.last_name}/>
                        <label className="col-form-label text-md-center" htmlFor="Login">{translations[this.props.translationState].account.login}</label>
                            <input required className="form-control" title="Only letters and numbres, minimum 4" type="text" pattern="(?=^.{4,}$)[A-Za-z0-9]+" id="login" ref={this.loginEl} defaultValue={this.props.userConnectState.login}/>
                        <label className="col-form-label text-md-center" htmlFor="email">{translations[this.props.translationState].account.email}</label>
                            <input required className="form-control" title="Valid email" type="email" id="email" ref={this.emailEl} defaultValue={this.props.userConnectState.email}/>
                       <button className="btn btn-outline-success" type="submit">{translations[this.props.translationState].account.update_your_information}</button>
                </form>
                {/* Password section (not available for Oauth2 accounts) */}
                {(this.props.userConnectState.insta === "" && this.props.userConnectState.google === "" && this.props.userConnectState.facebook === "" && this.props.userConnectState.github === "" && this.props.userConnectState.ft === "") ?
                <form className="row" onSubmit={this.submitPasswordForm}>
                    <div className="form-group col-xs-12">
                        <label className="col-xs-6 col-form-label text-md-right" htmlFor="password_confirm">{translations[this.props.translationState].account.new_password}</label>
                        <div className="col-xs-6">
                            <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" autoComplete="on" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_new" ref={this.passwordNewEl}/>
                        </div>
                    </div>
                    <div className="form-group col-xs-12">
                        <label className="col-xs-6 col-form-label text-md-right" htmlFor="password_confirm">{translations[this.props.translationState].account.confirm_password}</label>
                        <div className="col-xs-6">
                            <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" autoComplete="on" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_confirm" ref={this.passwordConfirmEl}/>
                        </div>
                    </div>
                    <div className="form-group col-xs-12">
                        <label className="col-xs-6 col-form-label text-md-right" htmlFor="password_confirm">{translations[this.props.translationState].account.old_password}</label>
                        <div className="col-xs-6">
                            <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" autoComplete="on" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_old" ref={this.passwordOldEl}/>
                        </div>
                    </div>
                    <div className="form-actions col-xs-12">
                        <div className="">
                            <button className="btn btn-dark">{translations[this.props.translationState].account.change_password}</button>
                        </div>
                    </div>
                </form> : null}
            </div>
        )
    }
}
export default Account;