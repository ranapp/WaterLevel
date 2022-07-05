import React, { useEffect, useState } from "react";
import './App.css';
import useAsyncFetch from './useAsyncFetch'; // a custom hook
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';

import MonthYearPicker from 'react-month-year-picker';
import MonthPicker from './MonthPicker.jsx';
// an third-party component from NPM

let capacities = {"SHA":4552000 , "ORO":3537577, "CLE": 2447650, "NML": 2400000, "SNL": 2041000, "DNP": 2030000, "BER": 1602000};



function App() {
  // states for divs show more/less
  const [isShown, setIsShown] = useState(false)
  // button text changes from show more/less
  const [buttonText, setButtonText] = useState('See More')//{(
    //labels: arr((data)) => data.year
  //)}
  function buttonClick() {
    setIsShown(!isShown);
    setButtonText((state) => (state === "See More" ? "See Less" : "See More")); 
  }

            
  return (
    <main>
    <div className="container">
    <div className="left">
      <p>
      California's reservoirs are part of a <a href="https://www.ppic.org/wp-content/uploads/californias-water-storing-water-november-2018.pdf">complex water storage system</a>.  The State has very variable weather, both seasonally and from year-to-year, so storage and water management is essential.  Natural features - the Sierra snowpack and vast underground aquifers - provide more storage capacity,  but reservoirs are the part of the system that people control on a day-to-day basis.  Managing the flow of surface water through rivers and aqueducts, mostly from North to South, reduces flooding and attempts to provide a steady flow of water to cities and farms, and to maintain natural riparian habitats.  Ideally, it also transfers some water from the seasonal snowpack into long-term underground storage.  Finally, hydro-power from the many dams provides carbon-free electricity. 
  </p><p>
California's water managers monitor the reservoirs carefully, and the state publishes daily data on reservoir storage.
  </p>
    <button onClick={buttonClick}>{buttonText}</button>
  </div>

  <div className="right">
  <img src="https://cdn.theatlantic.com/thumbor/HYdYHLTb9lHl5ds-IB0URvpSut0=/900x583/media/img/photo/2014/09/dramatic-photos-of-californias-historic-drought/c01_53834006/original.jpg
"/>
<p className="caption">Lake Oroville in the 2012-2014 drought. Image credit Justin Sullivan, from The Atlatic article Dramatic Photos of California's Historic Drought.</p>
</div>
</div>

<div className="container">
 <div style={{ padding: ' 2% 5% 2% 5%'}} className={`data ${isShown ? 'data-active' : ''}`}>
   <WaterChart/>
 </div>
  <div style={{ padding: ' 5% 5% 2% 5% '}} className={`data ${isShown ? 'data-active' : ''}`}>
      <p>
    Here's a quick look at some of the data on reservoirs from the <a href="https://cdec.water.ca.gov/index.html">California Data Exchange Center</a>, which consolidates climate and water data from multiple federal and state government agencies, and  electric utilities.  Select a month and year to see storage levels in the eleven largest in-state reservoirs.
    </p>
  </div>
</div>
    </main>
  );
}


// function MonthChart(){
//   const [date, setDate] = useState({month: 6, year: 2022 });
  
//   function yearChange(newYear) {
//       let m = date.month;
//       setDate({year: newYear, month: m });
//     }

//   function monthChange(newMonth){
//       let y = date.year;
//       setDate({month: newMonth, year: y});
//     }

//     year = date.year;
//     month = date.month;

  
//     return (
//       <main>
//         <MonthPicker  
//           // props 
//           date = {date}
//           yearFun = {yearChange}
//           monthFun = {monthChange}
//           onChangeYear={()=>{WaterChart()}}
//           onChangeMonth={()=>{WaterChart()}}
//           />
//       </main>
//     );
// }


// A component that puts water data into a bar chart
function WaterBuild(props) {

// push props.data[key] for every key in props.data
  //make variable for date the same as month year picker
  const waternames = new Map();
  waternames.set('SHA', 'Shasta');
  waternames.set('ORO', 'Oroville');
  waternames.set('CLE', 'Trinity Lake');
  waternames.set('NML', 'New Melones');
  waternames.set('SNL', 'San Luis');
  waternames.set('DNP', 'Don Pedro');
  waternames.set('BER', 'Berryessa');


  if (props.data) {
    let n = props.data.length;
    console.log(props.data);

    // objects containing row values
    let capacityObj = {label: "Capacity", data: [], backgroundColor: 'rgb(66, 145, 152)'}
    let storageObj = {label: "Water Storage:", data: [], backgroundColor: 'rgb(75, 192, 192)'}
    let labels = [];
    for (let i=0; i<n; i++) {
      let station = props.data[i].stationId; 
      storageObj.data.push(props.data[i].value);
      capacityObj.data.push(capacities[station]);
      labels.push(waternames.get(station));
    }


  let waterData = {};
  waterData.labels = labels;
  waterData.datasets = [capacityObj, storageObj];

console.log(waterData);
    
let options = {
  plugins: {
    title: {
      display: false,
    },
    legend:{
      display: false,
    }
  },
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      grid: {
        display: false
      },
      stacked: true, 
      
    },
    y: {
      grid: {
        display: false
      },
      stacked: true,
    }
  }
};
      return (
        
        <div id="chart-container">
          <Bar data={waterData} options={options} />
        </div>
      )
  }
}

// A component that fetches its own data
function WaterChart() {
  
  const [data, setData] = useState([]);
  const [date, setDate] = useState({month: 4, year: 2022 });



  console.log("in WaterDisplay");

  

  //update month
 //const [update, setUpdate] = useState(false);

  
  function yearChange(newYear) {
      let m = date.month;
      setDate({year: newYear, month: m });
    }

  function monthChange(newMonth){
      let y = date.year;
      setDate({month: newMonth, year: y});
    }


  
let bodydate = {month:date.month, year:date.year};
  
let paramsdate = {
    method: 'POST', 
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(bodydate)};
  
  useAsyncFetch("/query/reservoirData", paramsdate, thenFun, catchFun);
    function thenFun (result) {
      console.log("got result", result);
     setData(result);
  }

  function catchFun (error) {
    console.log(error);
  }

  console.log("Date:", date.month);
  console.log(date.year);


  // will re-render once state variable schools changes
  if (data) {
  return (
    <main>
      <WaterBuild data={data}> </WaterBuild>
        <div className="monthpicker">
        <MonthPicker  
          // props 
          date = {date}
          yearFun = {yearChange}
          monthFun = {monthChange}
          onChangeYear={()=>{WaterChart()}}
          onChangeMonth={()=>{WaterChart()}}
          />
      </div>
    </main>
  
  )
  }  else {
    return (<p>
      loading...
    </p>);
  }

}


export default App;



//save post request for when we need it: 
 // let date = {month:"April", year:2022};
 //  let paramsdate = {
 //    method: 'POST', 
 //    headers: {'Content-Type': 'application/json'},
 //    body: JSON.stringify(date)};
  
 //  useAsyncFetch("/query/reservoirData", paramsdate, thenFun, catchFun);
 //    function thenFun (result) {
 //    console.log(result.month);
 //    // render the list once we have it
 //  }

 //  function catchFun (error) {
 //    console.log(error);
 //  }