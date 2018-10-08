import React, {Component} from 'react';
import './App.css';
import ProjectList from './ProjectList'
import LanguageList from './LanguageList'
import Grid from "@material-ui/core/Grid/Grid";
import {Link, Route, Switch} from 'react-router-dom';
import Project from "./Project";
import AppBar from "@material-ui/core/AppBar/AppBar";
import Toolbar from "@material-ui/core/Toolbar/Toolbar";
import Button from "@material-ui/core/Button/Button";
import StringList from "./StringList";


class App extends Component {

    render() {
        return (
            <Grid container spacing={40} style={{padding: 20}}>
                <Grid item xs={12}>
                    <div className="App">
                        <AppBar position="static" color="default" style={{marginBottom: 10}}>
                            <Toolbar>
                                <Link to="/"><Button>Projectlist</Button></Link>
                                <Link to="/languages"><Button>Edit languages</Button></Link>
                            </Toolbar>
                        </AppBar>
                        <Switch>
                            <Route exact path="/" component={ProjectList}/>
                            <Route path="/languages" component={LanguageList}/>
                            <Route path="/project/:id/:language" component={StringList}/>
                            <Route path="/project/:id" component={Project}/>
                        </Switch>
                    </div>
                </Grid>
            </Grid>
        );
    }
}


export default App;
