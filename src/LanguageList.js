import {Component} from "react";
import React from "react";

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
        fetch('http://localhost:8080/languages')
            .then(result => result.json())
            .then(languages => this.setState({languages}));
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
        this.newLanguage();
        event.preventDefault();
    }

    newLanguage() {
        var body = {
            "languageCode": this.state.languageCode,
            "name": this.state.name
        };
        fetch('http://localhost:8080/language', {
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
            <div className="ProjectList">
                <table>
                    <thead>
                    <tr>
                        <th>IsoCode</th>
                        <th>Name</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.languages.map(language =>
                        <tr key={language.IsoCode}>
                            <td>{language.IsoCode}</td>
                            <td>{language.Name}</td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <div>
                    <form onSubmit={this.handleSubmit}>
                        Name: <input type="text" name="name" value={this.state.name} onChange={this.handleChange}
                                     required/>
                        Iso-Code: <input type="text" name="languageCode" value={this.state.languageCode}
                                         onChange={this.handleChange} required/>
                        <input type="submit"/>
                    </form>
                </div>
            </div>
        );
    }
}

export default ProjectList;