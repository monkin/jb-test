import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Dialog, FlatButton, TextField } from 'material-ui';

interface DialogState {
    name: string;
    nameMessage?: string;
    surname: string;
    surnameMessage?: string;
    email: string;
    emailMessage?: string;
    login: string;
    loginMessage?: string;
    password: string;
    passwordMessage?: string;
}

export default class CreateUserDialog extends Component<{ open: boolean, onClose?: () => void, onCreateUser?: () => void }, DialogState> {
    state: DialogState = {
        name: "",
        surname: "",
        email: "",
        login: "",
        password: ""
    }

    render() {
        let actions = [
                <FlatButton label="Cancel" primary={ true } onClick={ this.props.onClose }/>,
                <FlatButton label="Create user" primary={ true } onClick={ () => this.createUser() }/>
            ] as ReactElement<any>[],
            s = this.state;
        return <Dialog open={ this.props.open } title="Create user" actions={ actions }>
            <TextField
                hintText="Name"
                floatingLabelText="Name"
                onChange={(e, name) => this.setState({ name: name.trim() })}
                errorText={ s.nameMessage }
                fullWidth={true}/>
            <TextField
                hintText="Surname"
                floatingLabelText="Surname"
                onChange={(e, surname) => this.setState({ surname: surname.trim() })}
                errorText={ s.surnameMessage }
                fullWidth={true}/>
            <TextField
                hintText="Email"
                floatingLabelText="Email"
                onChange={(e, email) => this.setState({ email: email.trim() })}
                errorText={ s.emailMessage }
                fullWidth={true}/>
            <TextField
                hintText="Login"
                floatingLabelText="Login"
                onChange={(e, login) => this.setState({ login: login.trim() })}
                errorText={ s.loginMessage }
                fullWidth={true}/>
            <TextField
                hintText="Password"
                floatingLabelText="Password"
                type="password"
                onChange={(e, password) => this.setState({ password: password.trim() })}
                errorText={ s.passwordMessage }
                fullWidth={true}/>
        </Dialog>;
    }
    private createUser() {
        let s = this.state,
            nameMessage = "",
            surnameMessage = "",
            emailMessage = "",
            loginMessage = "",
            passwordMessage = "";
                
        if (!s.name) { nameMessage = "User name is required"; }
        if (!s.surname) { surnameMessage = "User surname is required"; }
        if (!s.email) {
            emailMessage = "Email is required";
        } else if (!/.+@.+/.test(s.email)) {
            emailMessage = "Email should contain '@'";
        }
        if (!s.login) { loginMessage = "Login name is required"; }
        if (!s.password) { passwordMessage = "Password is required"; }

        this.setState({ nameMessage, surnameMessage, emailMessage, loginMessage, passwordMessage });

        if (!(nameMessage || surnameMessage || emailMessage || loginMessage || passwordMessage)) {
            Meteor.call("createUserWithoutLogin", {
                    username: s.login,
                    password: s.password,
                    email: s.email,
                    profile: {
                        name: s.name,
                        surname: s.surname,
                        email: s.email
                    }
                }, error => {
                    if (error) {
                        this.setState({
                            loginMessage: "Login should be unique",
                            emailMessage: "Email should be unique"
                        });
                    } else {
                        if (this.props.onCreateUser) {
                            this.props.onCreateUser();
                        }
                        if (this.props.onClose) {
                            this.props.onClose();
                        }
                    }
                });
        }
    }
}