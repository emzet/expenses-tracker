import { add } from 'date-fns';
import { Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { distinctUntilChanged } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { TranslocoService } from '@jsverse/transloco';
import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { COOKIE_KEYS, COOKIE_EXPIRATION } from '@app/constants/cookies';

import { SeoService } from './seo.service';



@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  readonly #dom = inject(DOCUMENT);
  readonly #router = inject(Router);
  readonly #seo = inject(SeoService);
  readonly #destroyRef = inject(DestroyRef);
  readonly #cookieService = inject(CookieService);
  readonly #translocoService = inject(TranslocoService);

  init(): void {
    const initialLanguageCode = this.#cookieService.get(COOKIE_KEYS.LANGUAGE) || this.#translocoService.getDefaultLang();

    this.#translocoService.setActiveLang(initialLanguageCode);

    this.#translocoService
      .langChanges$
      .pipe(
        distinctUntilChanged(),
        takeUntilDestroyed(this.#destroyRef)
      )
      .subscribe({
        next: (languageCode: string) => this.#update(languageCode)
      });
  }

  #update(languageCode: string): void {
    this.#cookieService.set(COOKIE_KEYS.LANGUAGE, languageCode, {
      expires: add(new Date(), COOKIE_EXPIRATION),
      path: '/',
      secure: this.#dom.location.protocol === 'https:'
    });

    this.#dom.head.parentElement!.setAttribute('lang', languageCode);

    this.#seo.updateMetaTags(this.#router.routerState.root.snapshot);
  }
}
