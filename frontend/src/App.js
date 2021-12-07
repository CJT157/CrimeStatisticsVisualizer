import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, Rectangle, Circle } from '@react-google-maps/api';
import './App.css';

function App() {
  const [locations, setLocations] = useState([])
  const [crimes, setCrimes] = useState([])

  // AIzaSyC35r6BaiVXyUN4B45pFIwedN1_J7O5NWg

  let crime_color = {'HOMICIDE': '#FF0000', 'CRIMINAL SEXUAL ASSAULT': '#FFFF00'}

  const mapStyles = {        
    height: "100vh",
    width: "100%"};

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

  return (
    <div>
      <LoadScript
       googleMapsApiKey='AIzaSyC35r6BaiVXyUN4B45pFIwedN1_J7O5NWg'>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={{lat: 41.874, lng: -87.718}}
          clickableIcons={false}
          onClick={(e) => updateBox(e.latLng)}
          mapTypeId={"roadmap"}
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
              options={{ strokeColor: "#000000", strokeOpacity: .5, fillColor: "#000000", fillOpacity: .2 }}
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
  );
}

export default App;