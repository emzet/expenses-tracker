import { format } from 'date-fns';
import { bootstrapApplication } from '@angular/platform-browser';

import { appConfig } from '@app/app.config';
import { AppComponent } from '@app/app.component';

import { logAppInfo } from '@utils/log.utils';
import { sanitizeAppName } from '@utils/string.utils';

import { DATE_TIME_FORMAT } from '@app/constants/date-time';

import { author, name, version } from '../package.json';



export const APP_AUTHOR = author;
export const APP_VERSION = version;
export const APP_NAME = sanitizeAppName(name);

bootstrapApplication(AppComponent, appConfig)
  .then(() => logAppInfo(APP_NAME, APP_VERSION, format(new Date(), DATE_TIME_FORMAT)))
  .catch((error: Error) => console.error(error))
