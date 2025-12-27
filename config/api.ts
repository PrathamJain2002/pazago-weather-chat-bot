export const API_CONFIG = {
  // Google GenAI Configuration
  GOOGLE_GENAI: {
    model: 'gemini-3-flash-preview',
    enabled: true,
    // API key should be set via environment variable GOOGLE_GENAI_API_KEY
  },
  
  // API Request Configuration
  REQUEST: {
    temperature: 0.5,
    topP: 1,
  },
};

// export const WEATHER_CITIES = [
//   'London',
//   'New York',
//   'Tokyo',
//   'Paris',
//   'Sydney',
//   'Mumbai',
//   'Berlin',
//   'Rome',
//   'Madrid',
//   'Amsterdam',
//   'Vienna',
//   'Prague',
//   'Budapest',
//   'Warsaw',
//   'Stockholm',
//   'Oslo',
//   'Copenhagen',
//   'Helsinki',
//   'Reykjavik',
//   'Dublin',
// ];

// export const WEATHER_QUERIES = [
//   "What's the weather in London?",
//   "Will it rain tomorrow in New York?",
//   "Weather forecast for next week in Tokyo",
//   "Temperature in Paris right now",
//   "Is it going to snow this weekend in Berlin?",
//   "Humidity levels in Sydney today",
//   "Wind speed in Rome",
//   "UV index in Madrid",
//   "Air quality in Amsterdam",
//   "Pollen count in Vienna",
// ];
