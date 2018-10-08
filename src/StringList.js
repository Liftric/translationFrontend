import {Component} from "react";
import React from "react";
import String from "./String"
import ImportFile from "./ImportFile"
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

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
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Identifier</TableCell>
                        <TableCell>String {this.props.project.BaseLanguage.Name}</TableCell>
                        <TableCell>Approved</TableCell>
                        <TableCell>Improvement needed</TableCell>
                        <TableCell>Translation <TranslationLanguage project={this.props.project}
                                                             language={this.props.language}/></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.props.project.Identifiers.map(identifier =>
                        <String key={identifier.Id} identifier={identifier} language={this.props.language} baseLanguage={this.props.project.BaseLanguage.IsoCode}/>
                    )}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default StringList