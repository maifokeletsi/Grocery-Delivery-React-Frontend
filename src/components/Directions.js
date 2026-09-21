import React, { useState } from 'react';
import { GoogleMap, LoadScript, DirectionsService, DirectionsRenderer } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 0,
  lng: 0
};

const Directions = ({ origin, destination }) => {
  const [response, setResponse] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyBxmOAfg2vUSb0X0dkiSkYXNx3AJjMk6Sc"
      onLoad={() => setIsLoaded(true)}
    >
      {isLoaded && (
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={center}
          zoom={10}
        >
          {origin && destination && (
            <>
              <DirectionsService
                options={{
                  origin: origin,
                  destination: destination,
                  travelMode: window.google.maps.TravelMode.DRIVING
                }}
                callback={(result, status) => {
                  if (status === window.google.maps.DirectionsStatus.OK) {
                    setResponse(result);
                  } else {
                    console.error(`error fetching directions ${result}`);
                  }
                }}
              />
              {response && (
                <DirectionsRenderer
                  options={{
                    directions: response
                  }}
                />
              )}
            </>
          )}
        </GoogleMap>
      )}
    </LoadScript>
  );
};

export default Directions;
