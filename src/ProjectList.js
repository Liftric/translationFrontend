import {Component} from "react";
import React from "react";

class ProjectList extends Component {
    constructor() {
        super();
        this.state = {projects: []};
    }

    componentDidMount() {
        fetch('http://localhost:8080/projects')
            .then(result => result.json())
            .then(projects => this.setState({projects}));
    }

    newProject() {

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
                        <tr key={project.Id}>
                            <td>{project.Name}</td>
                            <td>{project.BaseLanguage.Name}</td>
                            <td>{project.Languages.map(language => language.Name
                            )}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div>
                    <input type="text" name="projectName" />
                    <button onClick={this.newProject()}>Create</button>
                </div>
            </div>
        );
    }
}

export default ProjectList;