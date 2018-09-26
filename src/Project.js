import {Component} from "react";
import React from "react";


export class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {project: {}};
    }

    componentDidMount() {
        fetch('http://localhost:8080/project/' + this.props.projectId)
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json()
            })
            .then(project => this.setState({project}))
            .catch((error) => console.log(error));
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