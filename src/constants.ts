import { app, remote } from 'electron';

const application = remote?.app || app;
export const constants = {
  DEV_ENV: !application.isPackaged,
  CUSTOMER_SERVICE_LINK: 'https://www.google.com',
  RENEW_URL: 'https://www.google.com',
  BASE_URL: 'https://api.naxdev.ga/api',
  BASE_SERVER_URL: 'http://141.164.59.150:9999/v1',
  TOKEN_KEY: 'NAX_TOKEN',
  READ_NEWS_KEY: 'READ_NEWS',
  SETTINGS_KEY: 'NAX_SETTINGS',
  CREDENTIALS_KEY: 'NAX_CREDENTIALS',
  DEFAULT_SETTINGS: {
    language: 'English',
    skin: 'Default',
    rememberPassword: false,
    autoRun: false,
    developerMode: false,
    socksPort: 8888,
    httpPort: 1081,
    forwardUdp: false,
    dnsMode: 'DNS',
    localDns: ['Localhost'],
    chinaDns: ['114 Public'],
    worldwideDns: ['Alibaba'],
    direct: [],
    block: [],
  },
  PING_INTERVAL: 60 * 1000,
  SUBSCRIBE_INTERVAL: 60 * 1000 * 5, // 5 minutes
  REFRESH_INTERVAL: 60 * 1000 * 60 * 12, // 12 hours
  RENEW_LIGHT_INTERVAL: 60 * 1000 * 60 * 6, // 6 hours
  RENEW_HEAVY_INTERVAL: 60 * 1000 * 60 * 3, // 3 hours
};
