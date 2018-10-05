import {Component} from "react";
import React from "react";
import String from "./String"
import ImportFile from "./ImportFile"
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

class StringList extends Component {

    render() {
        return (
            <div className="StringList" id="stringList">
                <ImportFile projectId={this.props.project.Id} languageCode={this.props.language} />
                <table>
                    <thead>
                    <tr>
                        <th>Identifier</th>
                        <th>String {this.props.project.BaseLanguage.Name}</th>
                        <th>Approved</th>
                        <th>Improvement needed</th>
                        <th>Translation <TranslationLanguage project={this.props.project}
                                                             language={this.props.language}/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.project.Identifiers.map(identifier =>
                        <String key={identifier.Id} identifier={identifier} language={this.props.language} baseLanguage={this.props.project.BaseLanguage.IsoCode}/>
                    )}
                    </tbody>
                </table>
            </div>
        )
    }
}

export default StringList