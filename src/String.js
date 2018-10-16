import {Component} from "react";
import React from "react";
import TableRow from "@material-ui/core/TableRow/TableRow";
import Button from "@material-ui/core/Button/Button";
import TableCell from "@material-ui/core/TableCell/TableCell";
import TextField from "@material-ui/core/TextField/TextField";

function TranslationString(props) {
    var translation = props.translation || null;
    if (translation) {
        return translation.Translation
    }
    return ""
}

function Approved(props) {
    var translation = props.translation || null;
    if (translation) {
        if (translation.Approved) {
            return <div className="circleBase green"></div>
        } else {
            return <div className="circleBase red" onClick={props.onClick} style={{cursor: "pointer"}}></div>
        }
    }
    return <div className="circleBase grey"></div>
}

function NeedsImprovement(props) {
    var translation = props.translation || null;
    if (translation) {
        if (translation.ImprovementNeeded) {
            return <div className="circleBase red" onClick={props.onClick} style={{cursor: "pointer"}}></div>
        } else {
            return <div className="circleBase green" onClick={props.onClick} style={{cursor: "pointer"}}></div>
        }
    }
    return <div className="circleBase grey"></div>
}

class String extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCreated: false,
            identifier: props.identifier,
            translation: {Translation: "", Approved: false, ImprovementNeeded: false, Id: 0},
            language: props.language
        };

        if (props.identifier != null && props.identifier.Translations != null) {
            for (var i = 0; i < props.identifier.Translations.length; i++) {
                let translation = props.identifier.Translations[i];
                if (translation.Language === props.language) {
                    this.state.translation = translation;
                }
            }
        }

        this.handleTranslationChange = this.handleTranslationChange.bind(this);
        this.updateTranslation = this.updateTranslation.bind(this);
        this.toggleNeedsImprovement = this.toggleNeedsImprovement.bind(this);
        this.setApproved = this.setApproved.bind(this);
    }

    baseTranslation() {
        if (this.state.identifier == null || this.state.identifier.Translations == null) {
            return null;
        }
        for (var i = 0; i < this.state.identifier.Translations.length; i++) {
            let translation = this.state.identifier.Translations[i];
            if (translation.Language === this.props.baseLanguage) {
                return translation;
            }
        }
        return null;
    }

    handleTranslationChange(event) {
        let translation = this.state.translation;
        translation.Translation = event.target.value;
        this.setState({"translation": translation});
    }

    updateTranslation() {
        var body = {
            "keyId": this.state.identifier.Id,
            "translation": this.state.translation.Translation,
            "languageCode": this.state.language
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
            .then(result => {
                this.setState({"translation": result});
            })
            .catch((error) => {
                console.log(error)
            });
    }

    toggleNeedsImprovement() {
        console.log(this.state.translation)
        fetch(process.env.REACT_APP_BACKEND_URL + '/translation/improvement/' + this.state.translation.Id, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                let translation = this.state.translation;
                translation.ImprovementNeeded = !translation.ImprovementNeeded;
                this.setState({translation: translation});
            })
            .catch((error) => {
                console.log(error)
            });
    }

    setApproved() {
        console.log(this.state.translation)
        console.log(process.env.REACT_APP_BACKEND_URL + '/translation/approve/' + this.state.translation.Id)
        fetch(process.env.REACT_APP_BACKEND_URL + '/translation/approve/' + this.state.translation.Id, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'}
        })
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                let translation = this.state.translation;
                translation.Approved = true;
                this.setState({translation: translation});
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {
        return (
            <TableRow key={this.state.identifier.Id}>
                <TableCell>{this.state.identifier.Identifier}</TableCell>
                <TableCell><TranslationString translation={this.baseTranslation()}/></TableCell>
                <TableCell><Approved translation={this.state.translation} onClick={this.setApproved}/></TableCell>
                <TableCell><NeedsImprovement translation={this.state.translation}
                                             onClick={this.toggleNeedsImprovement}/></TableCell>
                <TableCell><TextField multiline={true} name="translationString"
                                      value={this.state.translation.Translation}
                                      onChange={this.handleTranslationChange} style={{minWidth: 400}}/></TableCell>
                <TableCell>
                    <Button onClick={this.updateTranslation}>Update</Button>
                </TableCell>
            </TableRow>
        )
    }
}

export default String