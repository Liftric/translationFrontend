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
        if(translation.Approved) {
            return <div className="circleBase green"></div>
        } else {
            return <div className="circleBase red"></div>
        }
    }
    return <div className="circleBase grey"></div>
}

function NeedsImprovement(props) {
    var translation = props.translation || null;
    if (translation) {
        if(translation.NeedsImprovement) {
            return <div className="circleBase red"></div>
        } else {
            return <div className="circleBase green"></div>
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
            translation: {Translation: "", Approved: false, NeedsImprovement: false},
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
        const target = event.target;
        const value = target.value;

        this.setState({
            "translation": {"Translation": value}
        });
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
            .catch((error) => {
                console.log(error)
            });
    }

    render() {
        return (
            <TableRow key={this.state.identifier.Id}>
                <TableCell>{this.state.identifier.Identifier}</TableCell>
                <TableCell><TranslationString translation={this.baseTranslation()}/></TableCell>
                <TableCell><Approved translation={this.state.translation}/></TableCell>
                <TableCell><NeedsImprovement translation={this.state.translation}/></TableCell>
                <TableCell><TextField multiline={true} name="translationString" value={this.state.translation.Translation}
                                     onChange={this.handleTranslationChange} style={{minWidth: 400}}/></TableCell>
                <TableCell>
                    <Button onClick={this.updateTranslation}>Update</Button>
                </TableCell>
            </TableRow>
        )
    }
}

export default String