import {Component} from "react";
import React from "react";
import TableRow from "@material-ui/core/TableRow/TableRow";
import Button from "@material-ui/core/Button/Button";
import TableCell from "@material-ui/core/TableCell/TableCell";
import Textarea from "@material-ui/core/InputBase/Textarea";

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
        return translation.Approved
    }
    return ""
}

function NeedsImprovement(props) {
    var translation = props.translation || null;
    if (translation) {
        return translation.NeedsImprovement
    }
    return ""
}

class String extends Component {
    constructor() {
        super();
        this.state = {
            isCreated: false,
            identifier: {Id: "", Identifier: ""},
            translation: {Translation: "", Approved: false, NeedsImprovement: false},
            language: ""
        };

        this.handleTranslationChange = this.handleTranslationChange.bind(this);
        this.updateTranslation = this.updateTranslation.bind(this);
    }

    componentDidMount() {
        this.setState({
            "identifier": this.props.identifier,
            "language": this.props.language
        });
        if (this.props.identifier != null && this.props.identifier.Translations != null) {
            for (var i = 0; i < this.props.identifier.Translations.length; i++) {
                let translation = this.props.identifier.Translations[i];
                if (translation.Language === this.props.language) {
                    this.setState({
                        "translation": translation
                    });
                }
            }
        }
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
        console.log(body)
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
                this.state.languages.push(result);
                this.setState({
                    "languages": this.state.languages
                });
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
                <TableCell><Approved translation={this.translation}/></TableCell>
                <TableCell><NeedsImprovement translation={this.translation}/></TableCell>
                <TableCell><Textarea name="translationString" value={this.state.translation.Translation} onChange={this.handleTranslationChange}/></TableCell>
                <TableCell>
                    <Button onClick={this.updateTranslation}>Update</Button>
                </TableCell>
            </TableRow>
        )
    }
}

export default String