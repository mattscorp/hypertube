import React, { Component } from 'react';

class AccountPage extends Component {
    render () {
        return (
            <div className="container">
                <div className="card-body">
                    <h1>Your account</h1>
                    <form>
                        <div className="form-group row">
                            <label className="col-md-4 col-form-label text-md-right" htmlFor="firstName">First name</label>
                            <div className="col-md-6">
                                <input required className="form-control" title="Only letters, '-' and '_', minimum 3" type="text" pattern="(?=^.{3,}$)[A-Za-z-]+" id="firstName" defaultValue={this.props.userConnectState.first_name}/>
                            </div>
                        </div>

                    </form>
                </div>
            </div>
        );
    }
}

export default AccountPage;