import {Component} from "react";
import React from "react";
import String from "./String"
import ImportFile from "./ImportFile"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Button from "@material-ui/core/Button/Button";
import {Link} from "react-router-dom";

/**
 * @return {string}
 */
function TranslationLanguage(props) {
    for (let i = 0; i < props.project.Languages.length; i++) {
        let lang = props.project.Languages[i];
        if (lang.IsoCode === props.language) {
            return lang.Name
        }
    }
    return ""
}

class StringList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: props.match.params.id,
            language: props.match.params.language,
            project: {Languages: [], BaseLanguage: {}, Identifiers: []},
            sortParam: "id",
            desc: false
        };

        this.sortBy = this.sortBy.bind(this);
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.projectId)
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json()
            })
            .then(project => {
                this.setState({project});
            })
            .catch((error) => console.log(error));
    }

    sortBy(property) {
        let language = this.state.language;
        let project = this.state.project;
        let baseLanguage = project.BaseLanguage.IsoCode;
        var identifiers = project.Identifiers;
        var desc = true;
        if (this.state.sortParam === property) {
            desc = !this.state.desc
        }
        switch (property) {
            case "identifier":
                identifiers.sort(function (a, b) {
                    if (desc) {
                        return a.Identifier.localeCompare(b.Identifier);
                    } else {
                        return b.Identifier.localeCompare(a.Identifier);
                    }
                });
                break;
            case "baselanguage":
                identifiers.sort(function (a, b) {
                    return compareTranslationStrings(a, b, baseLanguage, desc);
                });
                break;
            case "approved":
                identifiers.sort(function (a, b) {
                    return compareApproved(a, b, language, desc);
                });
                break;
            case "improvementNeeded":
                identifiers.sort(function (a, b) {
                    return compareNeedsImprovement(a, b, language, desc);
                });
                break;
            case "translation":
                identifiers.sort(function (a, b) {
                    return compareTranslationStrings(a, b, language, desc);
                });
                break;
            default:
                identifiers.sort(function (a, b) {
                    return a.Id - b.Id;
                });
        }
        project.Identifiers = identifiers;
        this.setState({
            "project": project,
            "sortParam": property,
            "desc": desc
        });
    }

    render() {
        return (
            <div className="StringList" id="stringList">
                <Link to={"/project/" + this.state.projectId}><Button>Back</Button></Link><br/>
                <Button
                    href={process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.projectId + '/android/' + this.state.language}>Download
                    Android xml</Button>
                <Button
                    href={process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.projectId + '/ios/' + this.state.language}>Download
                    iOS string file</Button>
                <ImportFile projectId={this.state.project.Id} languageCode={this.state.language}/>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell onClick={this.sortBy.bind(this, "identifier")} style={{cursor: "pointer"}}>Identifier</TableCell>
                            <TableCell
                                onClick={this.sortBy.bind(this, "baselanguage")} style={{cursor: "pointer"}}>String {this.state.project.BaseLanguage.Name}</TableCell>
                            <TableCell onClick={this.sortBy.bind(this, "approved")} style={{cursor: "pointer"}}>Approved</TableCell>
                            <TableCell onClick={this.sortBy.bind(this, "improvementNeeded")} style={{cursor: "pointer"}}>Improvement
                                needed</TableCell>
                            <TableCell onClick={this.sortBy.bind(this, "translation")} style={{cursor: "pointer"}}>Translation <TranslationLanguage
                                project={this.state.project}
                                language={this.state.language}/></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.project.Identifiers.map(identifier =>
                            <String key={identifier.Id} identifier={identifier} language={this.state.language}
                                    baseLanguage={this.state.project.BaseLanguage.IsoCode}/>
                        )}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

function compareNeedsImprovement(identifierA, identifierB, language, desc) {
    let translationA = getTranslation(identifierA, language);
    let translationB = getTranslation(identifierB, language);
    let translationNull = checkForNull(translationA, translationB, desc);
    if (translationNull !== 0) {
        return translationNull
    }
    if (desc) {
        return (translationA.ImprovementNeeded === translationB.ImprovementNeeded) ? 0 : translationA.ImprovementNeeded ? -1 : 1;
    } else {
        return (translationA.ImprovementNeeded === translationB.ImprovementNeeded) ? 0 : translationB.ImprovementNeeded ? -1 : 1;
    }
}

function compareApproved(identifierA, identifierB, language, desc) {
    let translationA = getTranslation(identifierA, language);
    let translationB = getTranslation(identifierB, language);
    let translationNull = checkForNull(translationA, translationB, desc);
    if (translationNull !== 0) {
        return translationNull
    }
    if (desc) {
        return (translationA.Approved === translationB.Approved) ? 0 : translationA.Approved ? -1 : 1;
    } else {
        return (translationA.Approved === translationB.Approved) ? 0 : translationB.Approved ? -1 : 1;
    }
}

function checkForNull(translationA, translationB, desc) {
    if (translationA === null && translationB === null) {
        return 0
    } else if (translationA === null && translationB != null) {
        if (desc) {
            return -1;
        } else {
            return 1;
        }
    } else if (translationB === null && translationA != null) {
        if (desc) {
            return 1;
        } else {
            return -1;
        }
    }
    return 0;
}

function compareTranslationStrings(identifierA, identifierB, language, desc) {
    let translationA = getTranslation(identifierA, language);
    let translationB = getTranslation(identifierB, language);
    var translationStringA = "";
    if (translationA != null) {
        translationStringA = translationA.Translation;
    }
    var translationStringB = "";
    if (translationB != null) {
        translationStringB = translationB.Translation;
    }
    if (desc) {
        return translationStringA.localeCompare(translationStringB);
    } else {
        return translationStringB.localeCompare(translationStringA);
    }
}

function getTranslation(identifier, language) {
    for (let i = 0; i < identifier.Translations.length; i++) {
        let translation = identifier.Translations[i];
        if (translation.Language === language) {
            return translation;
        }
    }
    return null;
}

export default StringList
