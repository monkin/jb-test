import * as React from "react";
import { Component, ReactElement, ComponentClass } from "react";
import { browserHistory } from "react-router";
import { Subheader, CardTitle, Paper, Menu, MenuItem, AppBar, Divider, List, ListItem, TextField, RaisedButton } from "material-ui";
import IconButton from "material-ui/IconButton";
import NavigationBack from "material-ui/svg-icons/navigation/arrow-back";
import { createContainer } from "react-meteor-data";

import CriteriaMultiselect from "./CriteriaMultiselect";

class AssessmentPage extends Component<{ toUser?: Meteor.User }, { }> {
    state = {
        
    }

    render() {
        let p = this.props,
            toUser = p.toUser,
            userText = toUser ? toUser.profile.name + " " + toUser.profile.surname : "User"
        return <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
            <AppBar
                title="Peer Assessment"
                style={{ flexShrink: 0 }}
                iconElementLeft={<IconButton  title="Log out" onClick={ () => browserHistory.push("/assessment") }><NavigationBack/></IconButton> as ReactElement<any>}/>
            <div style={{ overflowY: "scroll", flexGrow: 1 }}>
                <Paper zDepth={0} style={{ margin: "0 auto", maxWidth: "1024px" }}>
                    <CardTitle title={ "Make Assessment for " + userText } style={{ paddingLeft: "0", paddingRight: "0" }}/>
                    <h3 style={{ fontWeight: "normal" }}>Excellent</h3>
                    {toUser ? <CriteriaMultiselect mark={4} toUser={ toUser._id as string }/> : []}
                    <h3 style={{ fontWeight: "normal" }}>Good</h3>
                    {toUser ? <CriteriaMultiselect mark={3} toUser={ toUser._id as string }/> : []}
                    <h3 style={{ fontWeight: "normal" }}>Average</h3>
                    {toUser ? <CriteriaMultiselect mark={2} toUser={ toUser._id as string }/> : []}
                    <h3 style={{ fontWeight: "normal" }}>Poor</h3>
                    {toUser ? <CriteriaMultiselect mark={1} toUser={ toUser._id as string }/> : []}
                    <div style={{ textAlign: "center" }}>
                        <RaisedButton
                            onClick={ () => browserHistory.push("/assessment") }
                            style={{ display: "inline-block", margin: "32px auto" }}
                            label="Go back to user list"/>
                    </div>
                </Paper>
            </div>
        </div>
    }
}

export default createContainer((props: { params: { username: string } }) => {
    return {
        toUser: Meteor.users.findOne({ "profile.isAdmin": { $ne: true }, username: props.params.username })
    };
}, AssessmentPage) as ComponentClass<{ username: string }>;
