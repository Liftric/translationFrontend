import {Component} from "react";
import React from "react";


export class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {project: {}};
    }

    componentDidMount() {
        fetch('http://localhost:8080/project/' + this.props.projectId)
            .then(result => result.json())
            .then(project => this.setState({project}));
    }

    render() {
        return (
            <div className="Project">
                {this.state.project.Name}
                {this.state.project.Identifiers}
            </div>
        );
    }
}

export default Project;