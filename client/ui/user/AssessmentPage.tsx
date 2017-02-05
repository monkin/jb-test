import * as React from "react";
import { Component, ReactElement, ComponentClass } from "react";
import { browserHistory } from "react-router";
import { CardTitle, Paper, Menu, MenuItem, AppBar, Divider, List, ListItem, TextField } from "material-ui";
import IconButton from "material-ui/IconButton";
import NavigationBack from "material-ui/svg-icons/navigation/arrow-back";
import { createContainer } from "react-meteor-data";

class AssessmentPage extends Component<{ users: Meteor.User[], params: { username: string } }, { }> {
    state = {
        
    }

    render() {
        let p = this.props,
            user = p.users.filter(user => user.username === this.props.params.username)[0],
            userText = user ? user.profile.name + " " + user.profile.surname : "User";
        return <div>
            <AppBar title="Peer Assessment" iconElementLeft={<IconButton  title="Log out" onClick={ () => browserHistory.push("/assessment") }><NavigationBack/></IconButton> as ReactElement<any>}/>
            <Paper zDepth={0} style={{ margin: "0 auto", maxWidth: "1024px" }}>
                <CardTitle title={ "Make Assessment for " + userText } style={{ paddingLeft: "0", paddingRight: "0" }}/>
            </Paper>
        </div>
    }
}

export default createContainer(() => {
    return {
        users: Meteor.users.find({ "profile.isAdmin": { $ne: true } }, {sort: {"profile.name": 1}}).fetch()
    };
}, AssessmentPage) as ComponentClass<{ username: string }>;
