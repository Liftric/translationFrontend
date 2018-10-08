import {Component} from "react";
import React from "react";
import ReactDOM from "react-dom";
import Project from "./Project"
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';

class ProjectList extends Component {
    constructor() {
        super();
        this.state = {
            projects: [],
            languages: []
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.baseLanguageSelect = React.createRef();
        this.nameInput = React.createRef();
    }

    componentDidMount() {
        fetch(process.env.REACT_APP_BACKEND_URL + '/projects')
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json();
            })
            .then(projects => this.setState({projects}))
            .catch((error) => console.log(error));
        fetch(process.env.REACT_APP_BACKEND_URL + '/languages')
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json();
            })
            .then(languages => {
                this.setState({languages});
                if (languages.length > 0) {
                    this.setState({baseLanguage: languages[0].IsoCode});
                }
            })
            .catch((error) => console.log(error));
    }


    handleSubmit(event) {
        this.newProject();
        event.preventDefault();
    }

    newProject() {
        var body = {
            "baseLanguageCode": this.baseLanguageSelect.current.value,
            "name": this.nameInput.current.value
        };
        fetch(process.env.REACT_APP_BACKEND_URL + '/project', {
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
                this.state.projects.push(result);
                this.setState({
                    "projects": this.state.projects
                });
            })
            .catch((error) => {
                console.log(error)
            })
    }

    navigateToProject(id) {
        var temp = document.createElement("div");
        ReactDOM.render(<Project projectId={id}/>, temp);
        var container = document.getElementById("content");
        container.childNodes.forEach(function (child) {
            container.removeChild(child);
        });
        container.appendChild(temp.querySelector("#project"));
    }

    render() {
        return (
            <div className="ProjectList" id="projectList">
                <Table>
                    <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>BaseLanguage</TableCell>
                        <TableCell>Languages</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {this.state.projects.map(project =>
                        <TableRow key={project.Id} id={project.Id} onClick={this.navigateToProject.bind(this, project.Id)}>
                            <TableCell>{project.Name}</TableCell>
                            <TableCell>{project.BaseLanguage.Name}</TableCell>
                            <TableCell>{project.Languages.map(language => language.Name)}</TableCell>
                        </TableRow>
                    )}
                    </TableBody>
                </Table>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <Input type="text" name="projectName" ref={this.nameInput} required/>
                        <select value={this.state.value} ref={this.baseLanguageSelect} name="baseLanguage" required>
                            {this.state.languages.map(language =>
                                <option key={language.IsoCode} value={language.IsoCode}>
                                    {language.IsoCode} - {language.Name}
                                </option>
                            )}
                        </select>
                        <Button type="submit">Add project</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default ProjectList;