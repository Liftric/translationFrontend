import {Component} from "react";
import React from "react";


export class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {},
            newIdentifier: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        this.newIdentifier();
    }

    newIdentifier() {
        var body = {
            "projectId": this.props.projectId,
            "identifier": this.state.newIdentifier
        };
        fetch('http://localhost:8080/identifier', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(body)
        })
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
            <div className="Project" id="project">
                {this.state.project.Name}
                <form onSubmit={this.handleSubmit}>
                    New Identifier: <input type="text" name="newIdentifier" value={this.state.newIdentifier}
                                           onChange={this.handleChange} required/>
                    <input type="submit"/>
                </form>
            </div>
        );
    }
}

export default Project;