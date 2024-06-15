import { combineLatest, first } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, Data } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class SeoService {
  readonly #meta = inject(Meta);
  readonly #title = inject(Title);
  readonly #translate = inject(TranslocoService);

  updateMetaTags(activatedRouteSnapshot: ActivatedRouteSnapshot): void {
    const { meta }: Data = this.#findRouteData(activatedRouteSnapshot);

    combineLatest([
      /**
       *
       * t(META.DEFAULT.TITLE)
       * t(META.DEFAULT.DESCRIPTION)
       */
      this.#translate.selectTranslate<string>(meta?.title || 'META.DEFAULT.TITLE'),
      this.#translate.selectTranslate<string>(meta?.description || 'META.DEFAULT.DESCRIPTION')
    ])
    .pipe(
      first()
    )
    .subscribe(([titleI18n, descriptionI18n]: ReadonlyArray<string>) => {
      this.#title.setTitle(titleI18n);

      this.#meta.updateTag({
        name: 'description',
        content: descriptionI18n
      });
    });
  }

  #findRouteData(activatedRouteSnapshot: ActivatedRouteSnapshot): Data {
    const findData = ({ firstChild, data }: ActivatedRouteSnapshot): ActivatedRouteSnapshot | Data => (firstChild ? findData(firstChild) : data);

    return findData(activatedRouteSnapshot);
  }
}
