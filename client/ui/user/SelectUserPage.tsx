import * as React from "react";
import { Component, ReactElement, ComponentClass } from "react";
import { browserHistory } from "react-router";
import { CardTitle, Paper, Menu, MenuItem, AppBar, Divider, List, ListItem, TextField } from "material-ui";
import IconButton from "material-ui/IconButton";
import NavigationClose from "material-ui/svg-icons/navigation/close";
import { createContainer } from "react-meteor-data";

class SelectUserPage extends Component<{ users: Meteor.User[] }, { search: string }> {
    state = {
        search: ""
    }

    render() {
        let p = this.props,
            userId = Accounts.userId();
        return <div style={{ display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            <AppBar
                style={{ flexShrink: 0 }}
                title="Peer Assessment"
                iconElementLeft={<IconButton title="Log out"
                onClick={ () => Accounts.logout(() => browserHistory.push("/")) }><NavigationClose/></IconButton> as ReactElement<any>}/>
            <div style={{ overflowY: "scroll", width: "100%", flexGrow: 1 }}>
                <Paper zDepth={0} style={{ width: "1024px", margin: "0 auto" }}>
                    <CardTitle title="Choose an Employee" style={{ paddingLeft: "0", paddingRight: "0" }}/>
                    <TextField fullWidth={true} floatingLabelText="Employee name" hintText="Employee name" onChange={(e, value) => this.setState({ search: value.trim().replace(/\s+/g, " ").toLowerCase() })}/>
                    <List>
                        {p.users.filter(user => {
                            let userText = (user.profile.name + " " + user.profile.surname).toLowerCase();
                            return this.state.search.split(/\s/g).every(token => userText.includes(token));
                        }).sort((u1, u2) => {
                            let p1 = u1.profile,
                                p2 = u2.profile,
                                name1 = p1.name.toLowerCase(),
                                name2 = p2.name.toLowerCase();
                            if (name1 === name2) {
                                return p1.surname.toLowerCase() > p2.surname.toLowerCase() ? 1 : -1;
                            } else {
                                return name1 > name2 ? 1 : -1;
                            }
                        }).filter(user => user._id !== userId).map(user => {
                            return <ListItem key={user._id} onClick={() => browserHistory.push("/assessment/" + encodeURIComponent(user.username as string))}>{user.profile.name} {user.profile.surname}</ListItem>
                        })}
                    </List>
                </Paper>
            </div>
        </div>
    }

}

export default createContainer(() => {
    return {
        users: Meteor.users.find({ "profile.isAdmin": { $ne: true } }, {sort: {"profile.name": 1}}).fetch()
    };
}, SelectUserPage) as ComponentClass<{}>;