import {Component} from "react";
import React from "react";
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import CustomTableCell from "./styles";

class ProjectList extends Component {
    constructor() {
        super();
        this.state = {
            languages: [],
            name: '',
            languageCode: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_BACKEND_URL + '/languages')
            .then(result => result.json())
            .then(languages => this.setState({languages}));
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        this.newLanguage();
        event.preventDefault();
    }

    newLanguage() {
        const body = {
            "languageCode": this.state.languageCode,
            "name": this.state.name
        };
        fetch(process.env.REACT_APP_BACKEND_URL + '/language', {
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
            })
    }

    render() {
        return (
            <div className="LanguageList" id="languageList">
                <Table>
                    <TableHead>
                    <TableRow>
                        <CustomTableCell>IsoCode</CustomTableCell>
                        <CustomTableCell>Name</CustomTableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.languages.map(language =>
                        <TableRow key={language.IsoCode}>
                            <CustomTableCell>{language.IsoCode}</CustomTableCell>
                            <CustomTableCell>{language.Name}</CustomTableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        Name: <Input type="text" name="name" value={this.state.name} onChange={this.handleChange}
                                     required/>
                        Iso-Code: <Input type="text" name="languageCode" value={this.state.languageCode}
                                         onChange={this.handleChange} required/>
                        <Button type="submit">Add language</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default ProjectList;
