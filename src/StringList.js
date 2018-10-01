import {Component} from "react";
import React from "react";

/**
 * @return {string}
 */
function TranslationLanguage(props) {
    for (var i = 0; i < props.project.Languages.length; i++) {
        let lang = props.project.Languages[i];
        if (lang.IsoCode === props.language) {
            return lang.Name
        }
    }
    return ""
}

/**
 * @return {string}
 */
function String(props) {
    if (props.identifier.Translations == null) {
        return ""
    }
    for (var i = 0; i < props.identifier.Translations.length; i++) {
        let translation = props.identifier.Translations[i];
        if (translation.Language === props.language) {
            return translation.Translation
        }
    }
    return ""
}

class StringList extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="StringList" id="stringList">
                <table>
                    <thead>
                    <tr>
                        <th>Identifier</th>
                        <th>String {this.props.project.BaseLanguage.Name}</th>
                        <th>Translation <TranslationLanguage project={this.props.project}
                                                             language={this.props.language}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.project.Identifiers.map(identifier =>
                        <tr key={identifier.Id}>
                            <td>{identifier.Identifier}</td>
                            <td><String language={this.props.project.BaseLanguage.IsoCode} identifier={identifier}/>
                            </td>
                            <td><String language={this.props.language} identifier={identifier}/></td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default StringList