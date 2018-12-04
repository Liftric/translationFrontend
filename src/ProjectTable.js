import {Component} from "react";
import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import Button from "@material-ui/core/Button/Button";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import FormControl from "@material-ui/core/FormControl/FormControl";

/**
 * @return {string}
 */
function TranslationString(props) {
    if (props.identifier != null && props.identifier.Translations != null && props.language != null) {
        for (let i = 0; i < props.identifier.Translations.length; i++) {
            let translation = props.identifier.Translations[i];
            if (translation.Language === props.language) {
                return translation.Translation;
            }
        }
    }
    return ""
}

class ProjectTable extends Component {
    constructor(props) {
        super(props);
        let project = props.project;
        project.Identifiers.forEach(function (identifier) {
            identifier.NewIdentififer = identifier.Identifier;
            identifier.Changed = false;
            identifier.newProjectId = project.Id
        });
        this.state = {
            project: project,
            projects: []
        };
        this.submitIdentifier = this.submitIdentifier.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleIdentifierChange(identifierId, event) {
        let t = this;
        this.state.project.Identifiers.forEach(function (identifier) {
            if (identifier.Id === identifierId) {
                identifier.NewIdentififer = event.target.value;
                identifier.Changed = true;
                t.setState(t.state);
            }
        });
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_BACKEND_URL + '/projects')
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json();
            })
            .then(projects => this.setState({projects}))
            .catch((error) => console.log(error));
    }

    componentWillReceiveProps(nextProps) {
        let project = nextProps.project;
        project.Identifiers.forEach(function (identifier) {
            identifier.NewIdentififer = identifier.Identifier;
            identifier.Changed = false;
            identifier.newProjectId = project.Id;
        });
        this.setState({
            project: project
        });
    }

    submitIdentifier() {
        let project = this.state.project;
        project.Identifiers.forEach(function (identifier) {
            const body = {
                "identifier": identifier.NewIdentififer
            };
            fetch(process.env.REACT_APP_BACKEND_URL + '/identifier/' + identifier.Id, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(body)
            })
                .then(result => {
                    if (!result.ok) {
                        throw Error(result.statusText);
                    }
                    return result.json()
                })
                .then(result => {
                    identifier.Identifier = result.Identifier;
                    identifier.Changed = false;
                })
                .catch((error) => {
                    console.log(error)
                });
        });
        this.setState({
            project: project
        });
    }

    deleteIdentifier(id) {
        let project = this.state.project;
        var index = -1;

        project.Identifiers.forEach(function (identifier, i) {
            if (identifier.Id === id) {
                index = i;
                fetch(process.env.REACT_APP_BACKEND_URL + '/identifier/' + identifier.Id, {
                    method: 'DELETE'
                })
                    .then(result => {
                        if (!result.ok) {
                            throw Error(result.statusText);
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            }
        });
        if (index > -1) {
            project.Identifiers.splice(index, 1);
        }
        this.setState({
            project: project
        });
    }

    handleChange(identifierId, event) {
        let project = this.state.project;
        project.Identifiers.forEach(function (identifier) {
            if (identifier.Id === identifierId) {
                identifier.newProjectId = event.target.value;
            }
        });
        this.setState({project: project});
    }

    move(identifierId) {
        let t = this;
        let project = this.state.project;
        project.Identifiers.forEach(function (identifier, i) {
            if (identifier.Id === identifierId) {
                if (identifier.newProjectId === t.state.project.Id) {
                    return
                }

                fetch(process.env.REACT_APP_BACKEND_URL + '/identifier/' + identifier.Id + "/move/" + identifier.newProjectId, {
                    method: 'POST'
                })
                    .then(result => {
                        if (!result.ok) {
                            console.log(result);
                            throw Error(result.statusText);
                        }
                        project.Identifiers.splice(i, 1);
                        t.setState({project});
                    })
                    .catch((error) => {
                        alert(error);
                    });
            }
        });
    }

    render() {
        return (
            <div>
                Identifiers:
                <Table className="Identifiers">
                    <TableHead>
                        <TableRow>
                            <TableCell>Identifier</TableCell>
                            {this.state.project.Languages.map(language =>
                                <TableCell key={language.IsoCode}>
                                    {language.Name}
                                </TableCell>
                            )}
                            <TableCell/>
                            <TableCell/>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.project.Identifiers.map(identifier =>
                            <TableRow key={identifier.Id}>
                                <TableCell>
                                    <Input name="identifier" value={identifier.NewIdentififer} style={{minWidth: 250}}
                                           onChange={this.handleIdentifierChange.bind(this, identifier.Id)}/>
                                </TableCell>
                                {this.state.project.Languages.map(language =>
                                    <TableCell key={identifier.Id + language.IsoCode}>
                                        <TranslationString identifier={identifier} language={language.IsoCode}/>
                                    </TableCell>
                                )}
                                <TableCell>
                                    <Button onClick={this.deleteIdentifier.bind(this, identifier.Id)}>Delete</Button>
                                </TableCell>
                                <TableCell>
                                    <FormControl className="projectSelect">
                                        <InputLabel htmlFor="project">Project</InputLabel>
                                        <Select
                                            value={identifier.newProjectId}
                                            onChange={this.handleChange.bind(this, identifier.Id)}
                                            inputProps={{
                                                name: 'project',
                                                id: 'project',
                                            }}>
                                            {this.state.projects.map(project =>
                                                <MenuItem key={project.Id} value={project.Id}>{project.Name}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                    <MoveButton projectId={this.state.project.Id} newProjectId={identifier.newProjectId} onClick={this.move.bind(this, identifier.Id)} />
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Button onClick={this.submitIdentifier}>Submit identifier changes</Button>
            </div>
        );
    }
}

/**
 * @return {string}
 */
function MoveButton(props) {
    if (props.projectId === props.newProjectId) {
        return ""
    }
    return <Button onClick={props.onClick}>Move</Button>
}

export default ProjectTable
