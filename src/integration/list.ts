import { CoreIntegration } from '@/interface/integration';
import { GoogleCalendarIntegration } from './google-calendar';
import { ICloudCalendarIntegration } from './icloud-calendar';

export const integrationList = new Map<string, typeof CoreIntegration>([
  ['google-calendar', GoogleCalendarIntegration],
  ['icloud-calendar', ICloudCalendarIntegration],
]);
