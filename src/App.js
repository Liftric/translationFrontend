import React, {Component} from 'react';
import './App.css';
import ProjectList from './ProjectList'
import LanguageList from './LanguageList'
import ReactDOM from "react-dom";

class App extends Component {

    showLanguages() {
        var temp = document.createElement("div");
        ReactDOM.render(<LanguageList/>, temp);
        var container = document.getElementById("content");
        container.childNodes.forEach(function (child) {
            container.removeChild(child)
        });
        container.appendChild(temp.querySelector("#languageList"));
    }

    showProjectList() {
        var temp = document.createElement("div");
        ReactDOM.render(<ProjectList/>, temp);
        var container = document.getElementById("content");
        container.childNodes.forEach(function (child) {
            container.removeChild(child)
        });
        container.appendChild(temp.querySelector("#projectList"));
    }

    render() {
        return (
            <div className="App">
                <div className="Navigation">
                    <a href="#" onClick={this.showProjectList}>Projectlist</a>
                    <a href="#" onClick={this.showLanguages}>Edit languages</a>
                </div>
                <div className="Content" id="content">
                    <ProjectList/>
                </div>
            </div>
        );
    }
}


export default App;
