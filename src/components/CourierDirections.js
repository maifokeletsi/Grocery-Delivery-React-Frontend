import React, { useEffect, useState } from 'react';
import Directions from './Directions';

export default function CourierDirections() {
  const [origin, setOrigin] = useState(null);
  const destination = 'tshwane university of technology soshanguve south campus ';

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setOrigin({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting the user's location:", error);
          // Set a default origin if the user denies location access or an error occurs
          setOrigin('soshanguve crossing');
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
      // Set a default origin if geolocation is not supported
      //setOrigin('soshanguve crossing');
    }
  }, []);

  return (
    <div>CourierDirections
      {origin ? (
        <Directions origin={origin} destination={destination} />
      ) : (
        <p>Loading current location...</p>
      )}
    </div>
  );
}
