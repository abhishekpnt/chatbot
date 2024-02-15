export const environment = {
    production: true
  };
  
  export const config = {
    api: {
      BASE_URL: 'https://dev.ejp.sunbird.org/',
      CONFIG: 'api/content/v1/config/read',
      PAGE_SEARCH_API: 'api/content/v1/page/search',
      CONTEXT_SEARCH: 'api/aiutility/v1/context',
      CONTENT_SEARCH_API: 'api/content/v1/content/search',
      TELEMETRY_SYNC: 'api/telemetry/v1',
      BOT_QUERY_API: 'v1/query',
      SEARCH_API: 'api/content/v1/search',
      BOT_SAKHI_API_PATH: 'api/storybot/v1/query',
      BOT_ACTIVITY_API_PATH: 'api/activitybot/v1/query',
      REGISTER_DEVICE_API_PATH: 'api/registerMobileDevice',
      KEY: '',
      SECRET: ''
    },
    telmetry: {
      PRODUCER_ID: 'dev.ejp.mobileapp',
      PRODUCER_PID: 'mobileapp'
    }
  }

  