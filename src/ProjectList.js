import {Component} from "react";
import React from "react";

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
        fetch('http://localhost:8080/projects')
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json();
            })
            .then(projects => this.setState({projects}))
            .catch((error) => console.log(error));
        fetch('http://localhost:8080/languages')
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
        console.log(JSON.stringify(body));
        fetch('http://localhost:8080/project', {
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

    render() {
        return (
            <div className="ProjectList">
                <table>
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>BaseLanguage</th>
                        <th>Languages</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.projects.map(project =>
                        <tr key={project.Id} id={project.Id}>
                            <td>{project.Name}</td>
                            <td>{project.BaseLanguage.Name}</td>
                            <td>{project.Languages.map(language => language.Name
                            )}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        <input type="text" name="projectName" ref={this.nameInput} required/>
                        <select value={this.state.value} ref={this.baseLanguageSelect} name="baseLanguage" required>
                            {this.state.languages.map(language =>
                                <option key={language.IsoCode} value={language.IsoCode}>
                                    {language.IsoCode} - {language.Name}
                                </option>
                            )}
                        </select>
                        <input type="submit"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default ProjectList;