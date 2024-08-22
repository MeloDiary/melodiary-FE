import { useState, useEffect } from 'react';

interface ILocation {
  latitude: number;
  longitude: number;
}

export const useGeoLocation = (options = {}) => {
  const [location, setLocation] = useState<ILocation | null>(null);
  const [error, setError] = useState('');

  const handleSuccess = (pos: GeolocationPosition) => {
    const { latitude, longitude } = pos.coords;
    setLocation({ latitude, longitude });
  };

  const handleError = (err: GeolocationPositionError) => {
    setError(err.message);
  };

  useEffect(() => {
    const { geolocation } = navigator;

    if (!geolocation) {
      setError('Geolocation is not supported.');
      setLocation({ latitude: 37.5665, longitude: 126.9780 });
      return;
    }

    geolocation.getCurrentPosition(handleSuccess, handleError, options);

  }, [options]);

  return { location, error };
}
