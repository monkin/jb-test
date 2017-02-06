import * as React from "react";
import { Component, ReactElement, ComponentClass, CSSProperties } from "react";
import { Divider, List, ListItem, Popover, Chip } from "material-ui";
import { MuiTheme } from "material-ui/styles";
import muiThemeable from 'material-ui/styles/muiThemeable';
import NavigationCheck from "material-ui/svg-icons/navigation/check";

import { createContainer } from "react-meteor-data";
import { Criteria } from "../../lib/Criteria";
import { Marks } from "../../lib/Marks";

interface CriteriaMultiselectItem {
    label: string;
    value: string;
    mark: number;
}

const hiddenChip: CSSProperties = {
        display: "block",
        opacity: 0,
        maxWidth: 0,
        overflow: "hidden",
        margin: "0",
        transitionProperty: "opacity, max-width",
        transitionDuration: "0.3s"
    },
    visibleChip: CSSProperties = {
        display: "block",
        opacity: 1,
        maxWidth: 256,
        overflow: "hidden",
        margin: "0 4px",
        transitionProperty: "opacity, max-width",
        transitionDuration: "0.3s",
        overflowX: "hidden"
    },
    hiddenMenuItem: CSSProperties = {
        maxHeight: 0,
        opacity: 0,
        transitionProperty: "opacity, max-height",
        transitionDuration: "0.3s",
        overflowY: "hidden"
    },
    visibleMenuItem: CSSProperties = {
        maxHeight: 48,
        opacity: 1,
        transitionProperty: "opacity, max-height",
        transitionDuration: "0.3s",
        overflowY: "hidden"
    };

class CriteriaMultiselect extends Component<{ criteria: Criteria[], mark: number, marks: Marks[], toUser: string, muiTheme: MuiTheme }, { open: boolean, anchor?: Element }> {

    constructor(props, context) {
        super(props, context);
    }

    state = {
        open: false,
        anchor: undefined as Element | undefined
    }

    render() {
        let s = this.state,
            p = this.props,
            theme = p.muiTheme,
            palette = theme.palette,
            spacing = theme.spacing,
            anchor: Element | undefined,
            emptyMessage: Element | undefined,
            markByCriterion = p.marks.reduce((r, mark) => {
                r[mark.criterion] = mark.mark;
                return r;
            }, {} as { [criterion: string]: number });

        if (palette && spacing) {
            return <div style={{ position: "relative", borderBottom: "solid 1px", borderColor: palette.borderColor }}>
                <div
                    ref={ element => anchor = element }
                    style={{ color: palette["secondaryTextColor"], padding: spacing.desktopGutterMini, cursor: "pointer", height: 32, display: "flex" }}
                    onClick={ event => {
                        if (event.target === anchor || event.target === emptyMessage) {
                            this.setState({ open: true, anchor });
                        }
                    } }>
                    { p.criteria.every(c => markByCriterion[c._id] !== p.mark)
                            ? <span
                                ref={ element => emptyMessage = element }
                                style={{ position: "absolute", bottom: "8px" }}>Click to select criteria</span>
                            : [] }
                    { p.criteria.map(criterion => {
                        return <div
                                key={ "chips_" + criterion._id }
                                style={ markByCriterion[criterion._id] === p.mark ? visibleChip : hiddenChip }>
                            <Chip onRequestDelete={ event => { this.toggleMark(criterion, true); event.stopPropagation(); } }>{ criterion.name }</Chip>
                        </div>
                    }) }
                </div>
                <Popover
                        style={ s.anchor ? { width: s.anchor.clientWidth + "px" } : {} }
                        anchorEl={ s.anchor }
                        open={ s.open }
                        onRequestClose={ () => this.setState({ open: false }) }>
                    <List>
                        {p.criteria.map(criterion => {
                            let mark = markByCriterion[criterion._id],
                                checked = mark === p.mark;
                            return <ListItem
                                style={ (mark === p.mark || !mark) ? visibleMenuItem : hiddenMenuItem }
                                onClick={() => this.toggleMark(criterion, checked)}
                                key={criterion._id} primaryText={criterion.name}
                                insetChildren={ !checked }
                                leftIcon={checked ? <NavigationCheck/> as ReactElement<any> : undefined}/>;
                        })}
                        <Divider style={p.criteria.some(c => markByCriterion[c._id] === p.mark || !markByCriterion[c._id]) && p.criteria.some(c => markByCriterion[c._id] !== p.mark && !!markByCriterion[c._id]) ? {} : { display: "none" }}/>
                        {p.criteria.map(criterion => {
                            let mark = markByCriterion[criterion._id],
                                checked = mark === p.mark;
                            return <ListItem
                                style={ (mark !== p.mark && mark) ? visibleMenuItem : hiddenMenuItem }
                                onClick={() => this.toggleMark(criterion, checked)}
                                key={criterion._id} primaryText={criterion.name}
                                insetChildren={ !checked }
                                leftIcon={checked ? <NavigationCheck/> as ReactElement<any> : undefined}/>;
                        })}
                    </List>
                </Popover>
            </div>;
        } else {
            throw new Error(`Palette or spacing is not defined`);
        }
    }

    private toggleMark(criterion: Criteria, currentState: boolean) {
        Meteor.call("putMark", {
            from: Meteor.userId(),
            to: this.props.toUser,
            mark: currentState ? 0 : this.props.mark,
            criterion: criterion._id
        });
    }
}

export default muiThemeable()(createContainer((props: { mark: number, toUser: string }) => {
    
    Criteria.subscribe();
    Marks.subscribe({ from: Meteor.userId(), to: props.toUser });

    return {
        criteria: Criteria.collection.find({}, { sort: { name: 1 } }).fetch(),
        marks: Marks.collection.find({ from: Meteor.userId(), to: props.toUser }).fetch()
    };
}, CriteriaMultiselect)) as ComponentClass<{ mark: number, toUser: string }>;

