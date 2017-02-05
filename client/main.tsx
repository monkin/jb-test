
/// <reference types="@types/meteor" />

import "es6-shim";
import * as React from 'react';
import { render } from 'react-dom';
import { Criteria } from "./lib/Criteria";

import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";

import * as injectTapEventPlugin from "react-tap-event-plugin";
injectTapEventPlugin();

import { App } from './ui/App';

Meteor.startup(() => {
    Criteria.subscribe();
    Meteor.subscribe("allUsers");
    render(<MuiThemeProvider><App/></MuiThemeProvider>, document.getElementById('render-target'));
});
