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
    for (var i = 0; i < props.project.Languages.length; i++) {
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
            project: {Languages: [], BaseLanguage: {}, Identifiers: []}
        };
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

    render() {
        return (
            <div className="StringList" id="stringList">
                <Link to={"/project/" + this.state.projectId}><Button>Back</Button></Link><br/>
                <Button href={process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.projectId + '/android/' + this.state.language}>Download Android xml</Button>
                <Button href={process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.projectId + '/ios/' + this.state.language}>Download iOS string file</Button>
                <ImportFile projectId={this.state.project.Id} languageCode={this.state.language} />
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Identifier</TableCell>
                        <TableCell>String {this.state.project.BaseLanguage.Name}</TableCell>
                        <TableCell>Approved</TableCell>
                        <TableCell>Improvement needed</TableCell>
                        <TableCell>Translation <TranslationLanguage project={this.state.project}
                                                             language={this.state.language}/></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.project.Identifiers.map(identifier =>
                        <String key={identifier.Id} identifier={identifier} language={this.state.language} baseLanguage={this.state.project.BaseLanguage.IsoCode}/>
                    )}
                    </TableBody>
                </Table>
            </div>
        )
    }
}

export default StringList