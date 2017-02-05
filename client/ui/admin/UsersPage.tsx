import * as React from "react";
import { Component, ComponentClass } from "react";
import { FloatingActionButton, Snackbar, Paper, CardTitle, FlatButton, Table, TableHeader, TableRow, TableBody, TableHeaderColumn, TableRowColumn } from "material-ui";
import ContentAdd from "material-ui/svg-icons/content/add";
import ActionDelete from "material-ui/svg-icons/action/delete";
import { createContainer } from "react-meteor-data";

import CreateUserDialog from "./CreateUserDialog";
import { Page, AdminMenuItem } from "./Page"

class UsersPage extends Component<{ users: Meteor.User[] }, { isCreateDialogOpen: boolean, userCreatedNotification: boolean, selection: number[], resetSelectionTag: string }> {
    state = {
        isCreateDialogOpen: false,
        userCreatedNotification: false,
        selection: [] as number[],
        // Hack to clear selection
        resetSelectionTag: "initial"
    }

    private removeUsers() {
        let users = this.props.users;
        
        this.state.selection.filter(index => users[index]).map(index => users[index]._id as string).forEach(id => {
            Meteor.users.remove(id);
        });

        this.setState({ "selection": [], resetSelectionTag: new Date().getTime().toString() });
    }

    render() {
        let s = this.state,
            p = this.props;

        return <Page value={AdminMenuItem.USERS} title="Users">
            {s.isCreateDialogOpen ? <CreateUserDialog open={ true } onClose={ () => this.setState({ isCreateDialogOpen: false }) } onCreateUser={() => this.setState({ userCreatedNotification: true })}/> : [] }
            <Paper style={{ margin: "8px 32px" }} zDepth={0}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <CardTitle title="Users" style={{ flexGrow: 1 }}/>
                    <FlatButton label="Create user" onClick={() => this.setState({ isCreateDialogOpen: true })} primary={true} icon={<ContentAdd/>}/>
                    <FlatButton label="Delete users" onClick={() => this.removeUsers()} secondary={true} disabled={!s.selection.length} icon={<ActionDelete/>}/>
                </div>
            </Paper>
            <div style={{ margin: "0 32px" }}>
                {[<Table key={s.resetSelectionTag} multiSelectable={true} onRowSelection={rows => this.setState({ selection: (Array.isArray(rows) && rows) || [] })}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                            <TableHeaderColumn>Email</TableHeaderColumn>
                            <TableHeaderColumn>Login</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                        {p.users.map((user, i) => {
                            return <TableRow key={user._id}>
                                <TableRowColumn>{user.profile.name} {user.profile.surname}</TableRowColumn>
                                <TableRowColumn>{user.profile.email || ""}</TableRowColumn>
                                <TableRowColumn>{user.username}</TableRowColumn>
                            </TableRow>;
                        })}
                    </TableBody>
                </Table>]}
            </div>
            <Snackbar
                open={ s.userCreatedNotification }
                message="New user successfuly created"
                autoHideDuration={ 4000 }
                onRequestClose={ () => this.setState({ userCreatedNotification: false }) }/>
        </Page>;
    }
}

export default createContainer(() => {
    return {
        users: Meteor.users.find({ "profile.isAdmin": { $ne: true } }, {sort: {"profile.name": 1}}).fetch()
    };
}, UsersPage) as ComponentClass<{}>;