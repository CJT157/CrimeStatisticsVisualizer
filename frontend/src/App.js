import React, { useState } from "react";
import { GoogleMap, LoadScript, Marker, Rectangle } from '@react-google-maps/api';
import './App.css';

function App() {
  const [locations, setLocations] = useState([])

  // AIzaSyC35r6BaiVXyUN4B45pFIwedN1_J7O5NWg

  const mapStyles = {        
    height: "100vh",
    width: "100%"};

  const updateBox = (latLng) => {
    let temp = [...locations]

    if (temp.length === 2) {
      temp = []
    } 
    temp.push({name: latLng.lat(), location: {lat: latLng.lat(), lng: latLng.lng()}})
    if (temp.length === 2) {
      fetch(`http://localhost:3001/`, {method: "POST", body: JSON.stringify({data: temp})})
        .then(response => response.json())
        .then(data => console.log(data))
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
          locations.length === 2 ?
            <Rectangle
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