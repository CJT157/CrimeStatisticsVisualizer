import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, Rectangle, Circle } from '@react-google-maps/api';
import './App.css';

function App() {
  const [locations, setLocations] = useState([])
  const [crimes, setCrimes] = useState([])

  // AIzaSyC35r6BaiVXyUN4B45pFIwedN1_J7O5NWg

  let crime_color = {'HOMICIDE': '#FF0000', 'CRIMINAL SEXUAL ASSAULT': '#FFFF00', 'ROBBERY': '#fcd703',
    'BATTERY': '#94fc03', 'ASSAULT': '#03fc03', 'THEFT': '#03fc8c', 'DECPTIVE PRACTICE': '#03dffc', 'WEAPONS VIOLATION': '#0356fc',
    'NARCOTICS': '#2500c9', 'INTERFERENCE WITH PUBLIC OFFICER': '#a65cfa', 'OTHER OFFENSE': '#7700ff', 'PUBLIC PEACE VIOLATION': '#c300ff', 
    'MOTOR VEHICLE THEFT': '#f700ff', 'ARSON': '#8a008f', 'CRIMINAL DAMAGE': '#8f0064', 'CRIMINAL DAMAGE': '#ff00b2', 
    'CRIMINAL TRESPASS': '#851d41'
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
    if (temp.length === 2) {
      fetch(`http://localhost:3001/`, {method: "POST", headers: {'content-type': 'application/json'}, body: JSON.stringify(temp)})
        .then(response => response.json())
        .then(data => {
          setCrimes(data.results)
          console.log(data.results)
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
        Title
      </div>
      <div id="map_container">
        <LoadScript
        googleMapsApiKey='AIzaSyC35r6BaiVXyUN4B45pFIwedN1_J7O5NWg'>
          <GoogleMap
            mapContainerStyle={mapContainerStyles}
            zoom={13}
            center={{lat: 41.874, lng: -87.718}}
            clickableIcons={false}
            onClick={(e) => updateBox(e.latLng)}
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
          crimes.length !== 0 ?
            crimes.map(crime => {
              return (
                <Circle
                  options={{ strokeColor: crime_color[crime.primary_type], strokeOpacity: .5, fillColor: crime_color[crime.primary_type], fillOpacity: .2 }}
                  mapContainerStyle={circleStyles}
                  radius={3}
                  center={{ lat: crime.latitude, lng: crime.longitude }}
                />
              )
            })
          :
          undefined
        }
        {
          locations.length === 2 ?
            <Rectangle
              options={{ strokeColor: "#000000", strokeOpacity: .5, fillColor: "#000000", fillOpacity: .05 }}
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
          <h3>Crimes</h3>
        </div>
        <div id="contents">
            {crimes.length === 0 
            ? <p className="empty">No area / crimes selected yet! <br /><br /> Choose 2 points on the map to get started.</p>
            : undefined
            }
        </div>
      </div>
    </div>
  );
}

export default App;