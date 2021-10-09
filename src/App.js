import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Landingpage from './pages/Landingpage';
import Dashboard from './pages/Dasboard';
import Mainlayout from './components/Mainlayout';
import Createsellable from './components/Createsellable';
import Myassets from './components/Myassets';
import CreatorDashboard from './components/CreatorDashboard';

function App() {
  return (
    <div className="App">
      
      <Router>
        <Switch>
          <Route exact path="/" component={Landingpage}/>
          <Route exact path="/dashboard" component={Dashboard}/>
          <Route exact path="/dashboard" component={Mainlayout} />
          <Route exact path="/sellAssets" component={Createsellable}/>
          <Route exact path="/myassets" component={Myassets} />
          <Route exact path="/creatorDashboard" component={CreatorDashboard} />
        </Switch>
      </Router>
      {/* <Landingpage /> */}

    </div>
  );
}

export default App;
