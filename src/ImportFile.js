import {Component} from "react";
import React from "react";


class ImportFile extends Component {

    constructor() {
        super();

        this.state = {
            translationDiffs: []
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleDiffToggle = this.handleDiffToggle.bind(this);
        this.submit = this.submit.bind(this);
        this.updateTranslation = this.updateTranslation.bind(this);
    }

    handleChange(event) {
        var fd = new FormData();
        let file = event.target.files[0];
        fd.append('file', file);

        fetch(process.env.REACT_APP_BACKEND_URL + '/project/' + this.props.projectId + '/android/' + this.props.languageCode, {
            method: 'POST',
            body: file
        })
            .then(result => {
                if (!result.ok) {
                    throw Error(result.statusText);
                }
                return result.json()
            })
            .then(result => {
                this.setState({translationDiffs: result});
            })
            .catch((error) => {
                console.log(error)
            })
    }

    handleDiffToggle(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const identifier = target.name;
        let diffs = this.state.translationDiffs;
        diffs.forEach(function (diff) {
            if(diff.Identifier === identifier) {
                diff.ToChange = value;
            }
        });
        this.setState({translationDiffs: diffs});
    }

    submit() {
        let projectId = this.props.projectId;
        let t = this
        this.state.translationDiffs.forEach(function (diff) {
            if(diff.ToChange){
                console.log(diff)
                console.log(diff.TranslationNew)
                if(diff.Create) {
                    var body = {
                        "projectId": projectId,
                        "identifier": diff.Identifier
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
                            diff.IdentifierId = identifier.Id;
                            t.updateTranslation(diff);
                        })
                        .catch((error) => console.log(error));
                }
                if(diff.Update) {
                    t.updateTranslation(diff);
                }
            }
        });
        this.setState({translationDiffs: []});
    }

    updateTranslation(diff) {
        var body = {
            "keyId": diff.IdentifierId,
            "translation": diff.TranslationNew,
            "languageCode": this.props.languageCode
        };
        console.log(body)
        fetch(process.env.REACT_APP_BACKEND_URL + '/translation', {
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
            .catch((error) => {
                console.log(error)
            });
    }


    render() {
        return (
            <div className="ImportFile">
                <input type="file" name="androidStringFile" onChange={this.handleChange} />
                <table>
                    <thead>
                    <tr>
                        <th>Identifier</th>
                        <th>Create</th>
                        <th>Update</th>
                        <th>TranslationOld</th>
                        <th>TranslationNew</th>
                        <th>Update in backend</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.translationDiffs.map(diff =>
                        <tr key={diff.Identifier}>
                            <td>{diff.Identifier}</td>
                            <td><input type="checkbox" checked={diff.Create} disabled /></td>
                            <td><input type="checkbox" checked={diff.Update} disabled /></td>
                            <td><code>{diff.TranslationOld}</code></td>
                            <td><code>{diff.TranslationNew}</code></td>
                            <td><input name={diff.Identifier} type="checkbox" checked={diff.ToChange} onChange={this.handleDiffToggle} /></td>
                        </tr>
                    )}
                    </tbody>
                </table>
                <button onClick={this.submit}>Submit changes to backend</button>
            </div>
        )
    }
}

export default ImportFile