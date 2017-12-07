import React, { Component } from 'react';
import {LineChart} from 'react-easy-chart';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:8080');

var currentState, logString="STARTUP LOG";
/*
class dataPoint{
  constructor(){

  }
}
*/



class BoxState{
  constructor(props){
    var fRotorCurrent, fRotorVoltage, fStatorLoopVoltageArray, bBeamBroken, currentTime;    
  }
}


class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      bAutoRotorCurrent: true, 
      fRotorCurrent:0.0, 
      boxStateQueue:[], 
      chartDisplayData:[], 
      sDataToDisplay:"voltage",
      sGraphLabelX:"Time",
      sGraphLabelY:"Voltage (V)"
    }
    this.currentToggled = this.currentToggled.bind(this);
    socket.on("Data", (data)=> {
      this.dataRecieved(data);
    });
  }
  

  //Function to call when we recieve data from the CUno
  dataRecieved = function(data){
    if(data === "BEGIN"){
      //FILL IN
    }
    else{
      logString = data;
      currentState = JSON.parse(data);
      console.log(data);
      this.state.boxStateQueue.push(currentState);
      if(this.state.boxStateQueue.length >= 200){
        this.state.boxStateQueue.shift();
      }
      this.setState({
	      fRotorCurrent:currentState.fRotorCurrent
      })
    }
  };

  currentToggled(event){
    logString = "Event fired! Value: "+ event.target.checked;
    this.setState({
      bAutoRotorCurrent: event.target.checked
    })
    if(this.state.bAutoRotorCurrent){
      socket.emit("DataChanged", this.state)
      //WRITE TO PORT
    }
    else{
      //WRITE TO PORT
    }
  }

  currentFloatChanged(event){
    logString = "Event fired! Value: "+ event.target.value;
    this.setState({
      fRotorCurrent: event.target.value
    })
  }

  generateChartDisplayData(event){
    this.setState({
      sDataToDisplay: event.target.value
    })
    switch (this.state.sDataToDisplay){
      case "voltage": break;
      case "rotorcurrent": break;
    }
    logString = "Selected display: " + event.target.value;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">AlternatorBox Window</h1>
        </header>
        <LineChart className = "LineChart-1"
          xType={'time'}
          axisLabels={{x:this.state.sGraphLabelX,y:this.state.sGraphLabelY}}
          axes
          grid
          verticalGrid
          width={1000}
          height={500}
          data={[
            [
              { x: '1-Jan-15', y: 20 },
              { x: '1-Feb-15', y: 10 },
              { x: '1-Mar-15', y: 33 },
              { x: '1-Apr-15', y: 45 },
              { x: '1-May-15', y: 15 }
            ], [
              { x: '1-Jan-15', y: 10 },
              { x: '1-Feb-15', y: 15 },
              { x: '1-Mar-15', y: 13 },
              { x: '1-Apr-15', y: 15 },
              { x: '1-May-15', y: 10 }
            ]
          ]}
        />
        <div className = "CurrentControl">Rotor Current
          <div className = "CurrentControlCheckbox">
            <input type="checkbox" onChange={(evt) => this.currentToggled(evt)} checked = {this.state.bAutoRotorCurrent}/>Automatic rotor current control
          </div>
          <input type="number" disabled = {this.state.bAutoRotorCurrent} value = {this.state.fRotorCurrent} onChange={(evt) => this.currentFloatChanged(evt)}/>
          <select>
            <option value="A">A</option>
          </select>
        </div>
        <select onChange={(evt) => this.generateChartDisplayData(evt)}>
          <option value="voltage">Voltage</option>
          <option value="rotorcurrent">Rotor current</option>
        </select>
        <h1/>{logString}
      </div>
    );
  }
}

export default App;



/*
<LineChart
          xType={'time'}
          datePattern={'%H:%M:%S'}
          axes
          grid
          verticalGrid
          width={1000}
          height={250}
          data={[]}
        />
*/