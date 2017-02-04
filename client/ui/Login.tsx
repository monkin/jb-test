import * as React from "react";
import { Component, ReactElement } from "react";
import { Dialog, FlatButton, TextField } from "material-ui";
import { browserHistory } from 'react-router';

export class Login extends Component<{}, { name: string, password: string, nameMessage: string, passwordMessage: string }> {

    state = {
        name: "",
        password: "",
        nameMessage: "",
        passwordMessage: ""
    };

    public render() {
        let actions = [
                <div style={{ padding: "0 16px 8px 16px" }}>
                    <FlatButton
                        style={{ textAlign: "center", display: "block", width: "100%" }}
                        label="Log in"
                        primary={true}
                        onClick={() => this.login(this.state.name, this.state.password)}/>
                </div>
            ] as ReactElement<any>[];
        return <Dialog open={true} title="Login" actions={actions}>
            <TextField
                hintText="Name or Email"
                floatingLabelText="Name or Email"
                fullWidth={true}
                onChange={(e, name) => this.setState({ name })}
                errorText={this.state.nameMessage}/>
            <TextField
                hintText="Password"
                floatingLabelText="Password"
                fullWidth={true}
                onChange={(e, password) => this.setState({ password })}
                type="password"
                errorText={this.state.passwordMessage}/>
        </Dialog>;
    }

    private login(name: string, password: string) {
        if (!name) {
            this.setState({ nameMessage: "User name is required", passwordMessage: "" });
        } else if (!password) {
            this.setState({ nameMessage: "", passwordMessage: "Password is required" });
        } else {
            Meteor.loginWithPassword(name, password, (error, data) => {
                if (error) {
                    console.error(error);
                    this.setState({ nameMessage: "Invalid password or user name", passwordMessage: "" })
                } else {
                    this.setState({ nameMessage: "", passwordMessage: "" });
                    let profile = Accounts.user().profile;
                    if (profile.isAdmin) {
                        this.props["router"].push("/admin/");
                    } else {
                        this.props["router"].push("/assessment/");
                    }
                }
            });
        }
    }

}