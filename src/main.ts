// main.ts

declare var global: any;

if (typeof localStorage === 'undefined' || localStorage === null) {
  global.localStorage = {
    getItem: (key: string) => null,
    setItem: (key: string, value: string) => { },
    removeItem: (key: string) => { },
    clear: () => { },
    key: (index: number) => null,
    length: 0
  } as Storage;
}

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
