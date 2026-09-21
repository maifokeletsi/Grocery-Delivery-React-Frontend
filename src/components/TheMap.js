// App.js

import React, { useState, useEffect } from "react";
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from "@react-google-maps/api";

const API_KEY = "AIzaSyBxmOAfg2vUSb0X0dkiSkYXNx3AJjMk6Sc";

const TheMap = () => {
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [error, setError] = useState(null);

  const origin = "Polokwane Police Station"; // Replace with your origin
  const destination = "TUT Soshanguve"; // Replace with your destination

  useEffect(() => {
    const fetchDirections = () => {
      const directionsService = new window.google.maps.DirectionsService();

      directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            setDirectionsResponse(result);
          } else {
            setError("Could not fetch directions: " + status);
          }
        }
      );
    };

    fetchDirections();
  }, [origin, destination]);

  return (
    <LoadScript googleMapsApiKey={API_KEY}>
      <GoogleMap
        mapContainerStyle={{ height: "400px", width: "800px" }}
        center={{ lat: 39.8283, lng: -98.5795 }} // Center of the US
        zoom={4}
      >
        {directionsResponse && (
          <DirectionsRenderer directions={directionsResponse} />
        )}
        {error && <div>{error}</div>}
      </GoogleMap>
    </LoadScript>
  );
};


export default TheMap;
