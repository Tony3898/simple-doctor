import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './home'
import NewDoctor from "./newDoctor";
import Patients from "./patients";
import ViewDoctor from "./viewDoctor";
import NewPatients from "./newPatients";
import ViewPatient from "./viewPatient";

function Main() {
  return (
      <Router>
        <Switch>
          <Route exact path="/app/simple-doctor/home" component={Home}/>
          <Route exact path="/app/simple-doctor/new-doctor/:doctorId?" component={NewDoctor}/>
          <Route exact path="/app/simple-doctor/view-doctor/:doctorId?" component={ViewDoctor}/>
          <Route exact path="/app/simple-doctor/new-patient/:patientId?" component={NewPatients}/>
          <Route exact path="/app/simple-doctor/view-patients" component={Patients}/>
          <Route exact path="/app/simple-doctor/view-patient/:patientId" component={ViewPatient}/>
        </Switch>
      </Router>
  )
}

export default Main
