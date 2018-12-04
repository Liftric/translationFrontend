import {Component} from "react";
import React from "react";
import ProjectTable from "./ProjectTable";
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import {Redirect} from "react-router-dom";
import Select from "@material-ui/core/Select/Select";
import MenuItem from "@material-ui/core/MenuItem/MenuItem";


export class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            projectId: props.match.params.id,
            project: {Languages: [], BaseLanguage: {}, Identifiers: []},
            newIdentifier: '',
            languages: [],
            languageTo: "",
            redirect: false,
            addLanguage: ""
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleLanguageSubmit = this.handleLanguageSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({[event.target.name]: event.target.value});
    }

    handleSubmit(event) {
        event.preventDefault();
        this.newIdentifier();
    }

    handleLanguageSubmit(event) {
        event.preventDefault();
        var body = {
            "languageCode": this.state.addLanguage
        };
        fetch(process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.projectId + '/languages', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json()
            })
            .then(project => {
                this.setState({project});
                let diff = this.diffLanguages(this.state.languages);
                this.setState({languages: diff});
                if (diff.length > 0) {
                    this.setState({addLanguage: diff[0].IsoCode});
                }
            })
            .catch((error) => console.log(error));
    }

    newIdentifier() {
        var body = {
            "projectId": parseInt(this.state.projectId, 10),
            "identifier": this.state.newIdentifier
        };
        fetch(process.env.REACT_APP_BACKEND_URL + '/identifier', {
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
            .then(identifier => {
                var updatedProject = this.state.project;
                updatedProject.Identifiers.push(identifier);
                this.setState({project: updatedProject})
            })
            .catch((error) => console.log(error));
    }

    showLanguage(lang) {
        this.setState({
            redirect: true,
            languageTo: lang
        });
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
                this.fetchLanguages();
            })
            .catch((error) => console.log(error));
    }

    fetchLanguages() {
        fetch(process.env.REACT_APP_BACKEND_URL + '/languages')
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json();
            })
            .then(languages => {
                let diff = this.diffLanguages(languages);
                this.setState({languages: diff});
                if (diff.length > 0) {
                    this.setState({addLanguage: diff[0].IsoCode});
                }
            })
            .catch((error) => console.log(error));
    }

    diffLanguages(languages) {
        var diff = [];
        var langKeys = [];
        var projLangKeys = [];
        for (var i = 0; i < languages.length; i++) {
            langKeys.push(languages[i].IsoCode)
        }
        for (var j = 0; j < this.state.project.Languages.length; j++) {
            projLangKeys.push(this.state.project.Languages[j].IsoCode);
        }
        for (var k = 0; k < languages.length; k++) {
            if (!projLangKeys.includes(langKeys[k])) {
                diff.push(languages[k])
            }
        }
        return diff;
    }

    render() {
        if (this.state.redirect) {
            let url = '/project/' + this.state.projectId + "/" + this.state.languageTo;
            return <Redirect push to={url}/>;
        }
        return (
            <div className="Project" id="project">
                <h1>{this.state.project.Name}</h1>
                <Button href={process.env.REACT_APP_BACKEND_URL + '/project/' + this.state.projectId + '/csv'}>Export to
                    CSV</Button><br/>
                BaseLanguage: {this.state.project.BaseLanguage.IsoCode} - {this.state.project.BaseLanguage.Name} <br/>
                Languages:
                <List className="Languages">
                    {this.state.project.Languages.map(language =>
                        <ListItem key={language.IsoCode} onClick={this.showLanguage.bind(this, language.IsoCode)}
                                  style={{cursor: "pointer"}}>
                            <ListItemText primary={language.Name} secondary={language.IsoCode}/>
                        </ListItem>
                    )}
                </List><br/>
                <AddLanguage project={this}/>
                <form onSubmit={this.handleSubmit}>
                    New Identifier: <Input type="text" name="newIdentifier" value={this.state.newIdentifier}
                                           onChange={this.handleChange} required/>
                    <Button type="submit">Add identifier</Button>
                </form>
                <ProjectTable project={this.state.project}/>
            </div>
        );
    }
}

function AddLanguage(props) {
    if(props.project.state.languages.length === 0) {
        return <div/>
    }

    return <div>
        <form onSubmit={props.project.handleLanguageSubmit}>
            New language:
            <Select
                value={props.project.state.addLanguage}
                onChange={props.handleChange}
                inputProps={{
                    name: 'addLanguage',
                    id: 'addLanguage',
                }}
                required
            >
                {props.project.state.languages.map(language =>
                    <MenuItem key={language.IsoCode} value={language.IsoCode}>{language.Name}</MenuItem>
                )}
            </Select>
            <Button onClick={props.project.handleLanguageSubmit}>Add language to project</Button>
        </form>
    </div>
}

export default Project;
