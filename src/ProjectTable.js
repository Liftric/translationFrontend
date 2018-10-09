import {Component} from "react";
import React from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import Button from "@material-ui/core/Button/Button";

function TranslationString(props) {
    if (props.identifier != null && props.identifier.Translations != null && props.language != null) {
        for (var i = 0; i < props.identifier.Translations.length; i++) {
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
        });
        this.state = {
            project: project
        };
        this.submitIdentifier = this.submitIdentifier.bind(this);
    }

    handleIdentifierChange(identifierId, event) {
        let t = this;
        this.state.project.Identifiers.forEach(function (identifier) {
            if (identifier.Id === identifierId) {
                identifier.NewIdentififer = event.target.value;
                identifier.Changed = true;
                t.setState(t.state);
                return;
            }
        });
    }

    componentWillReceiveProps(nextProps) {
        let project = nextProps.project;
        project.Identifiers.forEach(function (identifier) {
            identifier.NewIdentififer = identifier.Identifier;
            identifier.Changed = false;
        });
        this.setState({
            project: project
        });
    }

    submitIdentifier() {
        let project = this.state.project;
        project.Identifiers.forEach(function (identifier) {
            var body = {
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.project.Identifiers.map(identifier =>
                            <TableRow key={identifier.Id}>
                                <TableCell>
                                    <Input name="identifier" value={identifier.NewIdentififer}
                                           onChange={this.handleIdentifierChange.bind(this, identifier.Id)}/>
                                </TableCell>
                                {this.state.project.Languages.map(language =>
                                    <TableCell key={identifier.id + language.IsoCode}>
                                        <TranslationString identifier={identifier} language={language.IsoCode}/>
                                    </TableCell>
                                )}
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Button onClick={this.submitIdentifier}>Submit identifier changes</Button>
            </div>
        );
    }
}

export default ProjectTable