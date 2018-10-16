import {Component} from "react";
import React from "react";
import Button from "@material-ui/core/Button/Button";
import Table from "@material-ui/core/Table/Table";
import TableHead from "@material-ui/core/TableHead/TableHead";
import TableRow from "@material-ui/core/TableRow/TableRow";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TableBody from "@material-ui/core/TableBody/TableBody";
import Checkbox from '@material-ui/core/Checkbox';
import Input from "@material-ui/core/Input/Input";


class ImportFile extends Component {

    constructor() {
        super();

        this.state = {
            translationDiffs: [],
            sortParam: "id",
            desc: false
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDiffToggle = this.handleDiffToggle.bind(this);
        this.submit = this.submit.bind(this);
        this.updateTranslation = this.updateTranslation.bind(this);
    }

    handleChange(event) {
        var fd = new FormData();
        let file = event.target.files[0];
        fd.append('file', file);

        fetch(process.env.REACT_APP_BACKEND_URL + '/project/' + this.props.projectId + '/android/' + this.props.languageCode, {
            method: 'POST',
            body: file
        })
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json()
            })
            .then(result => {
                this.setState({translationDiffs: result});
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleDiffToggle(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const identifier = target.name;
        let diffs = this.state.translationDiffs;
        diffs.forEach(function (diff) {
            if (diff.Identifier === identifier) {
                diff.ToChange = value;
            }
        });
        this.setState({translationDiffs: diffs});
    }

    submit() {
        let projectId = this.props.projectId;
        let t = this
        this.state.translationDiffs.forEach(function (diff) {
            if (diff.ToChange) {
                if (diff.Create) {
                    var body = {
                        "projectId": projectId,
                        "identifier": diff.Identifier
                    };
                    fetch(process.env.REACT_APP_BACKEND_URL + '/identifier', {
                        method: 'PUT',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(body)
                    })
                        .then(result => {
                            if (!result.ok) {
                                throw Error(result.statusText);
                            }
                            return result.json()
                        })
                        .then(identifier => {
                            diff.IdentifierId = identifier.Id;
                            t.updateTranslation(diff);
                        })
                        .catch((error) => console.log(error));
                }
                if (diff.Update) {
                    t.updateTranslation(diff);
                }
            }
        });
        this.setState({translationDiffs: []});
    }

    updateTranslation(diff) {
        var body = {
            "keyId": diff.IdentifierId,
            "translation": diff.TranslationNew,
            "languageCode": this.props.languageCode
        };
        fetch(process.env.REACT_APP_BACKEND_URL + '/translation', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json()
            })
            .catch((error) => {
                console.log(error)
            });
    }

    sort(param) {
        var translationDiffs = this.state.translationDiffs;
        var desc = true;
        if (this.state.sortParam === param) {
            desc = !this.state.desc
        }
        switch (param) {
            case "Identifier":
                translationDiffs.sort(function (a, b) {
                    return a.Identifier.localeCompare(b.Identifier);
                });
                if(desc) {
                    translationDiffs.reverse();
                }
                break;
            case "Create":
                translationDiffs.sort(function (a, b) {
                    return (a.Create === b.Create) ? 0 : a.Create ? -1 : 1;
                });
                if(desc) {
                    translationDiffs.reverse();
                }
                break;
            case "Update":
                translationDiffs.sort(function (a, b) {
                    return (a.Update === b.Update) ? 0 : a.Update ? -1 : 1;
                });
                if(desc) {
                    translationDiffs.reverse();
                }
                break;
            case "TranslationOld":
                translationDiffs.sort(function (a, b) {
                    return a.TranslationOld.localeCompare(b.TranslationOld);
                });
                if(desc) {
                    translationDiffs.reverse();
                }
                break;
            case "TranslationNew":
                translationDiffs.sort(function (a, b) {
                    return a.TranslationNew.localeCompare(b.TranslationNew);
                });
                if(desc) {
                    translationDiffs.reverse();
                }
                break;
            case "Checkbox":
                translationDiffs.sort(function (a, b) {
                    return (a.ToChange === b.ToChange) ? 0 : a.ToChange ? -1 : 1;
                });
                if(desc) {
                    translationDiffs.reverse();
                }
                break;
            default:
                translationDiffs.sort(function (a, b) {
                    return a.Id - b.Id;
                });
        }
        this.setState({
            "translationDiffs": translationDiffs,
            "sortParam": param,
            "desc": desc
        });
    }

    render() {
        let diffTable;
        if (this.state.translationDiffs.length > 0) {
            diffTable = <div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={this.sort.bind(this, "Identifier")} style={{cursor: "pointer"}}>Identifier</TableCell>
                            <TableCell onClick={this.sort.bind(this, "Create")} style={{cursor: "pointer"}}>Create</TableCell>
                            <TableCell onClick={this.sort.bind(this, "Update")} style={{cursor: "pointer"}}>Update</TableCell>
                            <TableCell onClick={this.sort.bind(this, "TranslationOld")} style={{cursor: "pointer"}}>TranslationOld</TableCell>
                            <TableCell onClick={this.sort.bind(this, "TranslationNew")} style={{cursor: "pointer"}}>TranslationNew</TableCell>
                            <TableCell onClick={this.sort.bind(this, "Checkbox")} style={{cursor: "pointer"}}>Update in backend</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.translationDiffs.map(diff =>
                            <TableRow key={diff.Identifier}>
                                <TableCell>{diff.Identifier}</TableCell>
                                <TableCell><Checkbox checked={diff.Create} disabled/></TableCell>
                                <TableCell><Checkbox checked={diff.Update} disabled/></TableCell>
                                <TableCell><code>{diff.TranslationOld}</code></TableCell>
                                <TableCell><code>{diff.TranslationNew}</code></TableCell>
                                <TableCell><Checkbox name={diff.Identifier} checked={diff.ToChange}
                                                  onChange={this.handleDiffToggle}/></TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <Button onClick={this.submit}>Submit changes to backend</Button>
            </div>;
        } else {
            diffTable = ""
        }

        return (
            <div className="ImportFile">
                <Input type="file" name="androidStringFile" onChange={this.handleChange}/>
                {diffTable}
            </div>
        )
    }
}

export default ImportFile