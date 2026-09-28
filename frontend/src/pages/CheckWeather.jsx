import { useState } from 'react';

const SunIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5" fill="#fbbf24" stroke="none" />
    <line x1="12" y1="1" x2="12" y2="3" />
    <line x1="12" y1="21" x2="12" y2="23" />
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1" y1="12" x2="3" y2="12" />
    <line x1="21" y1="12" x2="23" y2="12" />
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
  </svg>
);

const RainIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round">
    <path d="M17 15a4 4 0 0 0 0-8 5.5 5.5 0 0 0-10.6 1.6A4 4 0 0 0 7 16h10z" fill="#93c5fd" stroke="#3b82f6" />
    <line x1="9" y1="19" x2="8" y2="21" />
    <line x1="13" y1="19" x2="12" y2="21" />
    <line x1="17" y1="19" x2="16" y2="21" />
  </svg>
);

const CheckWeather = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);
  const [placeName, setPlaceName] = useState('Mirpur, Dhaka');

  const handleLocation = () => {
    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const [weatherRes, geoRes] = await Promise.all([
            fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
              `&current=temperature_2m,relative_humidity_2m,wind_speed_10m,precipitation` +
              `&daily=sunrise,sunset&timezone=auto`
            ),
            fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            ),
          ]);

          if (!weatherRes.ok) throw new Error('Weather API request failed');

          const weatherData = await weatherRes.json();
          const geoData = await geoRes.json();

          setWeather(weatherData);
          if (geoData?.city || geoData?.locality) {
            setPlaceName(`${geoData.city || geoData.locality}, ${geoData.principalSubdivision || ''}`);
          }
        } catch (err) {
          setError('Weather data didnot load, Try again');
          console.error(err);
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        setError('Location access needed — allow permission from browser');
        setLoading(false);
        console.error(err);
      }
    );
  };

  const formatTime = (isoString) =>
    isoString
      ? new Date(isoString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      : '—';

  const now = new Date();
  const dateLabel = now.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' });
  const timeLabel = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const current = weather?.current;
  const daily = weather?.daily;

  const rainLikely = current ? current.precipitation > 0 || current.relative_humidity_2m > 80 : null;

  const umbrellaAdvice = current
    ? rainLikely
      ? 'Yes, take an umbrella — rain is likely.'
      : "You won't need an umbrella today, the sky should stay clear."
    : 'Give location first, then I can tell you.';

  return (
    <div className="flex justify-center">
      <div className="card bg-blue-400 w-106 shadow-sm">
        <div className="card-body">
          <div className="flex justify-between">
            <div>
              <h1>{dateLabel}</h1>
              <h1>{timeLabel}</h1>
            </div>
            <div className="card-actions justify-end">
              <button onClick={handleLocation} className="btn btn-primary" disabled={loading}>
                {loading ? 'Loading...' : 'Use My Location'}
              </button>
            </div>
          </div>

          {error && <p className="text-red-800 text-sm">{error}</p>}

          <div className="flex justify-between">
            <h1>Sunrise: {formatTime(daily?.sunrise?.[0])}</h1>
            <h1>Sunset: {formatTime(daily?.sunset?.[0])}</h1>
          </div>

          <div className="flex justify-between items-center">
            <h2 className="card-title text-2xl">{placeName}</h2>
            {current && (rainLikely ? <RainIcon /> : <SunIcon />)}
          </div>

          <div className="flex justify-between">
            <div className="mr-6">
              <h1>Temperature: {current ? `${current.temperature_2m}°C` : '—'}</h1>
              <h1>Humidity: {current ? `${current.relative_humidity_2m}%` : '—'}</h1>
              <h1>Wind Speed: {current ? `${current.wind_speed_10m} km/h` : '—'}</h1>
            </div>
            <div className="text-wrap ml-16 text-xl">
              <p>{umbrellaAdvice}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckWeather;