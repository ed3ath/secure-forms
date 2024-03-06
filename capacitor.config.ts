import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'secure-form',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  }
};

export default config;
