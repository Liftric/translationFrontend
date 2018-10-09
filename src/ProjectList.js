import {Component} from "react";
import React from "react";
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Input from '@material-ui/core/Input';
import MenuItem from "@material-ui/core/MenuItem/MenuItem";
import Select from "@material-ui/core/Select/Select";
import FormControl from "@material-ui/core/FormControl/FormControl";
import InputLabel from "@material-ui/core/InputLabel/InputLabel";
import CustomTableCell from "./styles";
import {Redirect} from "react-router-dom";


class ProjectList extends Component {
    constructor() {
        super();
        this.state = {
            projects: [],
            languages: [],
            baseLanguage: "",
            projectName: "",
            redirect: false,
            projectId: 0
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
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

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        this.newProject();
        event.preventDefault();
    }

    newProject() {
        var body = {
            "baseLanguageCode": this.state.baseLanguage,
            "name": this.state.projectName
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
        this.setState({
            redirect: true,
            projectId: id
        });
    }

    render() {
        if (this.state.redirect) {
            let url = '/project/' + this.state.projectId;
            return <Redirect push to={url} />;
        }
        return (
            <div className="ProjectList" id="projectList">
                <Table>
                    <TableHead>
                        <TableRow>
                            <CustomTableCell>Name</CustomTableCell>
                            <CustomTableCell>BaseLanguage</CustomTableCell>
                            <CustomTableCell>Languages</CustomTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.projects.map(project =>
                            <TableRow key={project.Id} id={project.Id}
                                      onClick={this.navigateToProject.bind(this, project.Id)}>
                                <CustomTableCell>{project.Name}</CustomTableCell>
                                <CustomTableCell>{project.BaseLanguage.Name}</CustomTableCell>
                                <CustomTableCell>{project.Languages.map(language => language.Name)}</CustomTableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div style={{marginTop: 20}}>
                    <form onSubmit={this.handleSubmit}>
                        <FormControl className="projectName">
                            <InputLabel htmlFor="projectName">Project name</InputLabel>
                            <Input type="text" inputProps={{
                                name: 'projectName',
                                id: 'projectName',
                            }} value={this.state.projectName} onChange={this.handleChange} required/>
                        </FormControl>
                        <FormControl className="languageSelect">
                            <InputLabel htmlFor="baseLanguage">Base language</InputLabel>
                            <Select
                                value={this.state.baseLanguage}
                                onChange={this.handleChange}
                                inputProps={{
                                    name: 'baseLanguage',
                                    id: 'baseLanguage',
                                }}
                            >
                                {this.state.languages.map(language =>
                                    <MenuItem key={language.IsoCode} value={language.IsoCode}>{language.Name}</MenuItem>
                                )}

                            </Select></FormControl>
                        <Button type="submit">Add project</Button>
                    </form>
                </div>
            </div>
        );
    }
}

export default ProjectList;