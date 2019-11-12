import React, { Component } from 'react';
import NoPhoto from '../resources/no_image.jpeg'
import axios from "axios";

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
        this.state ={
            file: null
        };
        this.profilePictureForm = this.profilePictureForm.bind(this);
        this.onChangePicture = this.onChangePicture.bind(this);
    }

    // state = {
    //     photo: ''
    // }

    // componentDidMount = async () => {
    //     this.setState(prevState => {
    //         // return {photo: this.props.userConnectState.photo_URL.replace('views/src', './..')};
    //         return {photo: './favicon.ico'};
    //     });
    // }

    // LOGOUT
    logout = (event) => {
        event.preventDefault();
        console.log('ICI');
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
        .then((res) => { console.log(res) })
        .catch((err) => { console.log(err); });
        console.log('dark mode value : ' + this.darkModeEl.current.value);
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
                if (res.status === 201)
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
                window.location.assign('http://localhost:3000');
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
                    if (res.status !== 200) {
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

    render() {
        return (
            <div>
                {this.props.userConnectState.uuid ? <div className="nav-item overflow-auto" onClick={this.logout}><button>Logout</button></div> : null}
                {/* Title */}
                <div className="form-group row">
                    <h1 className="mb-2 mx-auto">Your account</h1>
                </div>
                {/* Profile picture */}
                <div className="form-group profile_picture_row row account_input">
                    <label className="col-md-5 col-form-label text-md-right" htmlFor="darkMode">Profile picture</label>
                    <div className="profile_picture_div col-md-5">
                        {!this.props.userConnectState.photo_URL ? <img className="profile_picture" src={NoPhoto}/> : <img className="profile_picture" src={this.props.userConnectState.photo_URL.replace('views/public', '.')}/>}
                    </div>
                    {/* Update profile picture */}
                    <form onSubmit={this.profilePictureForm}>
                        <div className="mx-auto m-1">
                            <input onChange={this.onChangePicture} required type="file" accept="image/png, image/jpeg, image/jpg" title="Update picture" ref={this.profilePictureEl}/>
                        </div>
                        <div className="mx-auto">
                            <button className="btn btn-dark" type="submit">Update your profile picture</button>
                        </div>
                    </form>
                </div>
                {/* Dark mode toggle */}
                <div className="form-group row account_input">
                    <label className="col-md-5 col-form-label text-md-right" htmlFor="darkMode">Dark mode</label>
                    <div className="col-md-5">
                        <label className="switch">
                            <input onClick={this.setDarkMode} type="checkbox" ref={this.darkModeEl} defaultChecked={this.props.darkModeState}/>
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
                {/* Accout form (always available) */}
                <form onSubmit={this.submitAccountForm}>
                    <div className="form-group row account_input">
                        <label className="col-md-5 col-form-label text-md-right" htmlFor="firstName">First name</label>
                        <div className="col-md-6">
                            <input required className="form-control" title="Only letters and '-', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="firstName" ref={this.firstNameEl} defaultValue={this.props.userConnectState.first_name}/>
                        </div>
                    </div>
                    <div className="form-group row account_input">
                        <label className="col-md-5 col-form-label text-md-right" htmlFor="lastName">Last name</label>
                        <div className="col-md-6">
                            <input required className="form-control" title="Only letters and '-', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="lastName" ref={this.lastNameEl} defaultValue={this.props.userConnectState.last_name}/>
                        </div>
                    </div>
                    <div className="form-group row account_input">
                        <label className="col-md-5 col-form-label text-md-right" htmlFor="Login">Login</label>
                        <div className="col-md-6">
                            <input required className="form-control" title="Only letters and numbres, minimum 4" type="text" pattern="(?=^.{4,}$)[A-Za-z0-9]+" id="login" ref={this.loginEl} defaultValue={this.props.userConnectState.login}/>
                        </div>
                    </div>
                    <div className="form-group row account_input">
                        <label className="col-md-5 col-form-label text-md-right" htmlFor="email">Email</label>
                        <div className="col-md-6">
                            <input required className="form-control" title="Valid email" type="email" id="email" ref={this.emailEl} defaultValue={this.props.userConnectState.email}/>
                        </div>
                    </div>
                    <div className="form-actions row">
                        <div className="mx-auto">
                            <button className="btn btn-dark" type="submit">Update your information</button>
                        </div>
                    </div>
                </form>
                {/* Password section (not available for Oauth2 accounts) */}
                {(this.props.userConnectState.insta === "" && this.props.userConnectState.google === "" && this.props.userConnectState.facebook === "" && this.props.userConnectState.github === "" && this.props.userConnectState.ft === "") ?
                <form onSubmit={this.submitPasswordForm}>
                    <div className="form-group row">
                        <label className="col-md-5 col-form-label text-md-right" htmlFor="password_confirm">New password</label>
                        <div className="col-md-6">
                            <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_new" ref={this.passwordNewEl}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-md-5 col-form-label text-md-right" htmlFor="password_confirm">Confirm password</label>
                        <div className="col-md-6">
                            <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_confirm" ref={this.passwordConfirmEl}/>
                        </div>
                    </div>
                    <div className="form-group row">
                        <label className="col-md-5 col-form-label text-md-right" htmlFor="password_confirm">Old password</label>
                        <div className="col-md-6">
                            <input title="Must containe 8 characters, small and capital letters, numbers and special characters." required className="form-control" type="password" pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$" id="password_old" ref={this.passwordOldEl}/>
                        </div>
                    </div>
                    <div className="form-actions row">
                        <div className="mx-auto">
                            <button className="btn btn-dark" type="submit">Change your password</button>
                        </div>
                    </div>
                </form> : null}
            </div>
        )
    }
}
export default Account;