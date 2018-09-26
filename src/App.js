import React, {Component} from 'react';
import './App.css';
import ProjectList from './ProjectList'
import Project from './Project'
import LanguageList from './LanguageList'

class App extends Component {
    render() {
        return (
            <div className="App">
                <ProjectList/>

                <LanguageList/>

                <Project projectId="1" />
            </div>
        );
    }
}



export default App;
