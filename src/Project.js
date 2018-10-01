import {Component} from "react";
import React from "react";
import ReactDOM from "react-dom";
import StringList from "./StringList";


export class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            project: {Languages: [], BaseLanguage: {}, Identifiers: []},
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

    showLanguage(lang) {
        var temp = document.createElement("div");
        ReactDOM.render(<StringList project={this.state.project} language={lang}/>, temp);
        var container = document.getElementById("content");
        container.childNodes.forEach(function (child) {
            container.removeChild(child);
        });
        container.appendChild(temp.querySelector("#stringList"));
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
                {this.state.project.Name} <br/>
                BaseLanguage: {this.state.project.BaseLanguage.IsoCode} - {this.state.project.BaseLanguage.Name} <br/>
                Languages:
                <ul className="Languages">
                    {this.state.project.Languages.map(language =>
                        <li key={language.IsoCode} onClick={this.showLanguage.bind(this, language.IsoCode)}>
                            {language.IsoCode} - {language.Name}
                        </li>
                    )}
                </ul><br/>
                Identifiers:
                <ul className="Identifiers">
                    {this.state.project.Identifiers.map(identifier =>
                        <li key={identifier.Id}>
                            {identifier.Identifier}
                        </li>
                    )}
                </ul>
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