export const API_CONFIG = {
  // External Weather Agent API
  EXTERNAL: {
    endpoint: 'https://millions-screeching-vultur.mastra.cloud/api/agents/weatherAgent/stream',
    enabled: true, // Set to false to disable external API
    timeout: 10000, // 10 seconds
    retries: 2,
  },
  
  // API Request Configuration
  REQUEST: {
    maxRetries: 2,
    maxSteps: 5,
    temperature: 0.5,
    topP: 1,
    runId: 'weatherAgent',
    resourceId: 'weatherAgent',
  },
  
  // Your college roll number - UPDATE THIS!
  THREAD_ID: '60002200162', // Replace with your actual roll number
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
