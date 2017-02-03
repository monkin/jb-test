import * as React from 'react';
import { Component, ReactElement } from 'react';
import { Paper, Menu, MenuItem, AppBar, Divider, List, ListItem } from 'material-ui';

const titleLayoutStyle = {
        display: "flex",
        flexDirection: "column",
        height: "100%"
    },
    contentLayoutStyle = {
        display: "flex",
        alignItems: "stretch",
        alignContent: "stretch",
        flexGrow: 1
    };

export enum AdminMenuItem {
    USERS,
    CRITERIA,
    ASSESSMENT
}

export class Page extends Component<{ value?: AdminMenuItem, children?: any }, {}> {
    render() {
        let props = this.props;
        return <div style={titleLayoutStyle}>
            <AppBar title="Users" iconElementLeft={<div style={{ display: "none" }}/> as ReactElement<any>}/>
            <div style={contentLayoutStyle}>
                <Paper style={{ width: "25%", maxWidth: "300px" }}>
                    <div style={{ overflow: "hidden", maxWidth: "100%" }}>
                        <Menu value={props.value ? AdminMenuItem[props.value] : "USERS"} onChange={ (e, value) => props["router"].push(`/admin/${value.toLowerCase()}`) }>
                            <MenuItem primaryText="Users" value="USERS"/>
                            <MenuItem primaryText="Criteria" value="CRITERIA"/>
                            <MenuItem primaryText="Assessment" value="ASSESSMENT"/>
                        </Menu>
                        <Divider/>
                        <List>
                            <ListItem  primaryText="Log out" onClick={() => this.logout()}/>
                        </List>
                    </div>
                </Paper>
                <div style={{ flexGrow: 1 }}>
                    {props.children || []}
                </div>
            </div>
        </div>;
    }

    private logout() {
        Accounts.logout(() => {
            this.props["router"].push(`/login`);
        });
    }
}