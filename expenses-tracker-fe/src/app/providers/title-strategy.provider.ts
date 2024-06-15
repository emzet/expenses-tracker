import { Injectable, Provider, inject } from '@angular/core';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { SeoService } from '@shared/services/seo.service';



@Injectable()
export class CustomTitleStrategy extends TitleStrategy {
  readonly #seo = inject(SeoService);

  constructor() {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    this.#seo.updateMetaTags(routerState.root);
  }
}

export const titleStrategyProvider: Provider = {
  provide: TitleStrategy,
  useClass: CustomTitleStrategy
};
