import ReactWeather, { useOpenWeather } from 'react-open-weather';
import Box from './box';
import './App.css';

function App() {
  const { data, isLoading, errorMessage } = useOpenWeather({
    key: '4cf55dfa9a0ab63a939fffb8ae325498',
    lat: '51.509865',
    lon: '-0.118092',
    lang: 'en',
    unit: 'metric', // values are (metric, standard, imperial)
  });

  return (
    <div className='App'>
      <ReactWeather
        isLoading={isLoading}
        errorMessage={errorMessage}
        data={data}
        lang='en'
        locationLabel='London'
        unitsLabels={{ temperature: 'C', windSpeed: 'Km/h' }}
        showForecast
      />
      <Box/>
    </div>
  );
}

export default App;
