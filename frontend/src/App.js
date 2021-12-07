import React, { useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Rectangle, Circle } from '@react-google-maps/api';
import './App.css';
import { CrimePieChart } from "./CrimePieChart";

const LoadingIcon = () => {
  return (
      <svg width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
          <path fill="none" stroke="#2BFF88" strokeWidth="8" strokeDasharray="42.76482137044271 42.76482137044271" d="M24.3 30C11.4 30 5 43.3 5 50s6.4 20 19.3 20c19.3 0 32.1-40 51.4-40 C88.6 30 95 43.3 95 50s-6.4 20-19.3 20C56.4 70 43.6 30 24.3 30z" strokeLinecap="round">
              <animate attributeName="stroke-dashoffset" repeatCount="indefinite" dur="1s" keyTimes="0;1" values="0;256.58892822265625"></animate>
          </path>
      </svg>
  );
}

function App() {
  const mapRef = useRef(undefined);
  const [locations, setLocations] = useState([])
  const [crimes, setCrimes] = useState([])
  const [center, setCenter] = useState({lat: 41.874, lng: -87.718})
  const [loading, setLoading] = useState(false);

  let crime_color = {'HOMICIDE': '#FF0000', 'CRIMINAL SEXUAL ASSAULT': '#FFFF00', 'ROBBERY': '#fcd703',
    'BATTERY': '#94fc03', 'ASSAULT': '#03fc03', 'THEFT': '#03fc8c', 'DECPTIVE PRACTICE': '#03dffc', 'WEAPONS VIOLATION': '#0356fc',
    'NARCOTICS': '#2500c9', 'INTERFERENCE WITH PUBLIC OFFICER': '#a65cfa', 'OTHER OFFENSE': '#7700ff', 'PUBLIC PEACE VIOLATION': '#c300ff', 
    'MOTOR VEHICLE THEFT': '#f700ff', 'ARSON': '#8a008f', 'CRIMINAL DAMAGE': '#8f0064',
  }

  const mapContainerStyles = {        
    height: "100%",
    width: "100%",
    borderRadius: "7px",
    boxShadow: "2px 2px 7px rgba(0, 0, 0, 0.7)"
  };

  const circleStyles = {
    strokeColor: "#FF0000"
  }

  const updateBox = (latLng) => {
    let temp = [...locations]

    if (temp.length === 2) {
      temp = []
    } 
    temp.push({name: latLng.lat(), location: {lat: latLng.lat(), lng: latLng.lng()}})

    // TODO: Add logic to correctly arrange longitude and latitude values

    if (temp.length === 2) {
      setLoading(true);
      fetch(`http://localhost:3001/`, {method: "POST", headers: {'content-type': 'application/json'}, body: JSON.stringify(temp)})
        .then(response => response.json())
        .then(data => {
          setCrimes(data.results)
          setLoading(false);
        })
    }

    setLocations(temp);
  }

  const mapStyles =  [
    {
        featureType: "poi",
        elementType: "geometry",
        stylers: [
            {
                color: "#eeeeee",
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "labels.text",
        stylers: [
            {
                visibility: "off",
            },
        ],
    }
];

  return (
    <div id="page_container">
      <div id="title_container">
        <h1>Chicago Crime Explorer</h1>
        <h3 id="authors">Made with ❤️ by Johnny and Colin </h3>
      </div>
      <div id="map_container">
        <LoadScript googleMapsApiKey='AIzaSyC35r6BaiVXyUN4B45pFIwedN1_J7O5NWg'>
          <GoogleMap
            ref={mapRef}
            mapContainerStyle={mapContainerStyles}
            zoom={13}
            center={center}
            clickableIcons={false}
            onClick={(e) => updateBox(e.latLng)}
            onDragEnd={() => {
              if (mapRef.current) {
                setCenter(mapRef.current.state.map.center)
              }
            }}
            mapTypeId={"roadmap"}
            options={{styles: mapStyles}}
          >
        {
          locations.map(item => {
            return (
            <Marker key={item.name} position={item.location}/>
            )
          })
        }
        {
          crimes.length !== 0 && !loading && locations.length === 2 ?
            crimes.map(crime => {
              return (
                <Circle
                  options={{ strokeColor: crime_color[crime.primary_type], strokeOpacity: .5, fillColor: crime_color[crime.primary_type], fillOpacity: .2 }}
                  mapContainerStyle={circleStyles}
                  radius={3}
                  center={{ lat: crime.latitude, lng: crime.longitude }}
                  onClick={() => console.log(crime.primary_type)}
                />
              )
            })
          :
          undefined
        }
        {
          locations.length === 2 ?
            <Rectangle
              options={{ strokeColor: "#000000", strokeOpacity: .5, fillColor: "#000000", fillOpacity: .00 }}
              bounds={
              {north: locations[0].location.lat,
                south: locations[1].location.lat,
                east: locations[1].location.lng,
                west: locations[0].location.lng}
              }
            />
          :
          undefined
        }
          </GoogleMap>
      </LoadScript>
      </div>
      <div id="info_panel">
        <div id="header">
          <h3>Crime Analytics</h3>
        </div>
        <div id="contents">
            { (crimes.length === 0 && !loading)
            ? <p className="empty">No area / crimes selected yet! <br /><br /> Choose 2 points on the map to get started.</p>
            : 
            loading
            ? <LoadingIcon />
            :
            <div id="charts">
              <h3>Total Crimes: {crimes.length}</h3>
              <CrimePieChart crimeData={crimes}/>
            </div>
            }
        </div>
      </div>
    </div>
  );
}

export default App;