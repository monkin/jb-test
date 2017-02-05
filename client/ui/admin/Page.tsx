import * as React from "react";
import { Component, ReactElement } from "react";
import { browserHistory } from "react-router";
import { Paper, Menu, MenuItem, AppBar, Divider, List, ListItem } from "material-ui";
import IconButton from "material-ui/IconButton";
import NavigationClose from "material-ui/svg-icons/navigation/close";

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

export class Page extends Component<{ value?: AdminMenuItem, children?: any, title: string }, {}> {
    public constructor(props?: { value?: AdminMenuItem, children?: any, title: string }, context?: any) {
        super(props, context);
    }
    private selectMenuItem(item: AdminMenuItem) {
        browserHistory.push(`/admin/${AdminMenuItem[item].toLowerCase()}`);
        this.setState({ value: item });
    }
    render() {
        let props = this.props;
        return <div style={titleLayoutStyle}>
            <AppBar style={{ flexShrink: 0 }} title={props.title} iconElementLeft={<IconButton title="Log out" onClick={ () => this.logout() }><NavigationClose/></IconButton> as ReactElement<any>}/>
            <div style={contentLayoutStyle}>
                <Paper style={{ width: "25%", maxWidth: "300px", minWidth: "200px" }}>
                    <div style={{ overflow: "hidden", maxWidth: "100%" }}>
                        <Menu value={(typeof props.value === "number") ? AdminMenuItem[props.value] : ""} onChange={ (e, value: string) => this.selectMenuItem(AdminMenuItem[value]) }>
                            <MenuItem primaryText="Users" value="USERS"/>
                            <MenuItem primaryText="Criteria" value="CRITERIA"/>
                            <MenuItem primaryText="Assessment" value="ASSESSMENT"/>
                        </Menu>
                    </div>
                </Paper>
                <div style={{ flexGrow: 1, position: "relative", overflowY: "scroll" }}>
                    {props.children || []}
                </div>
            </div>
        </div>;
    }

    private logout() {
        Accounts.logout(() => {
            browserHistory.push(`/login`);
        });
    }
}