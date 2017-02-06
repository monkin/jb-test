import * as React from "react";
import { Component, ComponentClass } from "react";
import { FloatingActionButton, Snackbar, Paper, CardTitle, FlatButton, Table, TableHeader, TableRow, TableBody, TableHeaderColumn, TableRowColumn } from "material-ui";
import ContentAdd from "material-ui/svg-icons/content/add";
import ActionDelete from "material-ui/svg-icons/action/delete";
import { createContainer } from "react-meteor-data";
import { Criteria } from "../../lib/Criteria";
import CreateCriterionDialog from "./CreateCriterionDialog";
import { Page, AdminMenuItem } from "./Page"

class CriteriaPage extends Component<{ criteria: { _id: string, name: string }[] }, { isCreateDialogOpen: boolean, criterionCreatedNotification: boolean, selection: number[], resetSelectionTag: string }> {
    state = {
        isCreateDialogOpen: false,
        criterionCreatedNotification: false,
        selection: [] as number[],
        // Hack to clear selection
        resetSelectionTag: "initial"
    }

    private removeCriteria() {
        let criteria = this.props.criteria;
        
        this.state.selection.filter(index => criteria[index]).map(index => criteria[index]._id).forEach(id => {
            Criteria.collection.remove(id);
        });

        this.setState({ "selection": [], resetSelectionTag: new Date().getTime().toString() });
    }

    render() {
        let s = this.state,
            p = this.props;

        return <Page value={AdminMenuItem.CRITERIA} title="Criteria">
            {s.isCreateDialogOpen ? <CreateCriterionDialog open={ true } onClose={ () => this.setState({ isCreateDialogOpen: false }) } onCreateCriterion={() => this.setState({ criterionCreatedNotification: true })}/> : [] }
            <Paper style={{ margin: "8px 32px" }} zDepth={0}>
                <div style={{ display: "flex", alignItems: "center" }}>
                    <CardTitle title="Criteria" style={{ flexGrow: 1 }}/>
                    <FlatButton label="Create criterion" onClick={() => this.setState({ isCreateDialogOpen: true })} primary={true} icon={<ContentAdd/>}/>
                    <FlatButton label="Delete criteria" onClick={() => this.removeCriteria()} secondary={true} disabled={!s.selection.length} icon={<ActionDelete/>}/>
                </div>
            </Paper>
            <div style={{ margin: "0 32px" }}>
                {[<Table key={s.resetSelectionTag} multiSelectable={true} onRowSelection={rows => this.setState({ selection: (Array.isArray(rows) && rows) || [] })}>
                    <TableHeader>
                        <TableRow>
                            <TableHeaderColumn>Name</TableHeaderColumn>
                        </TableRow>
                    </TableHeader>
                    <TableBody deselectOnClickaway={false}>
                        {p.criteria.map((criterion, i) => {
                            return <TableRow key={criterion._id}>
                                <TableRowColumn>{criterion.name}</TableRowColumn>
                            </TableRow>;
                        })}
                    </TableBody>
                </Table>]}
            </div>
            <Snackbar
                open={ s.criterionCreatedNotification }
                message="New criterion successfuly created"
                autoHideDuration={ 4000 }
                onRequestClose={ () => this.setState({ criterionCreatedNotification: false }) }/>
        </Page>;
    }
}

export default createContainer(() => {
    return {
        criteria: Criteria.collection.find({}).fetch()
    };
}, CriteriaPage) as ComponentClass<{}>;