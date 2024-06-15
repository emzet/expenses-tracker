import type { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, isDevMode } from '@angular/core';
import type { Translation, TranslocoLoader, TranslocoOptions } from '@jsverse/transloco';



export const DEFAULT_LANG = 'en';

@Injectable({
  providedIn: 'root'
})
class TranslocoHttpLoader implements TranslocoLoader {
  readonly #http = inject(HttpClient);

  getTranslation(languageCode: string): Observable<Translation> {
    return this.#http.get<Translation>(`assets/i18n/${languageCode}.json`);
  }
}

export const TRANSLOCO_OPTIONS: TranslocoOptions =  {
  config: {
    availableLangs: [
      DEFAULT_LANG,
      'sk'
    ],
    defaultLang: DEFAULT_LANG,
    prodMode: !isDevMode(),
    reRenderOnLangChange: true
  },
  loader: TranslocoHttpLoader
}
