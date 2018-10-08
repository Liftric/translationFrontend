import React, {Component} from 'react';
import './App.css';
import ProjectList from './ProjectList'
import LanguageList from './LanguageList'
import ReactDOM from "react-dom";
import Button from '@material-ui/core/Button';
import Grid from "@material-ui/core/Grid/Grid";


class App extends Component {

    showLanguages() {
        var temp = document.createElement("div");
        ReactDOM.render(<LanguageList/>, temp);
        var container = document.getElementById("content");
        container.childNodes.forEach(function (child) {
            container.removeChild(child);
        });
        container.appendChild(temp.querySelector("#languageList"));
    }

    showProjectList() {
        var temp = document.createElement("div");
        ReactDOM.render(<ProjectList/>, temp);
        var container = document.getElementById("content");
        container.childNodes.forEach(function (child) {
            container.removeChild(child);
        });
        container.appendChild(temp.querySelector("#projectList"));
    }

    render() {
        return (
            <Grid container spacing={40} style={{padding: 20}}>
                <Grid item xs={12}>
                    <div className="App">
                        <div className="Navigation">
                            <Button onClick={this.showProjectList}>Projectlist</Button>
                            <Button onClick={this.showLanguages}>Edit languages</Button>
                        </div>
                        <div className="Content" id="content">
                            <ProjectList/>
                        </div>
                    </div>
                </Grid>
            </Grid>
        );
    }
}


export default App;
