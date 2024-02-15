export const environment = {
    production: true
  };
  
  export const config = {
    api: {
      BASE_URL: 'http://152.67.162.156:9000/',
      BASE_URL_NEW: 'https://dev.ejp.sunbird.org/',
      SEARCH_BASE_URL: 'http://129.154.42.158:8000/',
      BOT_BASE_URL: 'http://144.24.130.223:7081/',
      STORY_BOT_BASE_URL: 'http://152.67.183.46:7081/',
      CONFIG: 'v1/config/read',
      PAGE_SEARCH_API: 'v1/page/search',
      CONTEXT_SEARCH: 'v1/context',
      CONTENT_SEARCH_API: 'v1/content/search',
      TELEMETRY_SYNC: 'v1/telemetry',
      BOT_QUERY_API: 'v1/query',
      SEARCH_API: 'api/content/v1/search',
      BOT_SAKHI_API_PATH: 'v1/query',
      BOT_ACTIVITY_API_PATH: 'v1/query'
    },
    telmetry: {
      PRODUCER_ID: 'dev.ejp.mobileapp',
      PRODUCER_PID: 'mobileapp'
    }
  }