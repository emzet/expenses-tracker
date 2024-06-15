import { RouterOutlet } from '@angular/router';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { LanguageService } from '@services/language.service';



@Component({
  selector: 'expenses-tracker-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    RouterOutlet
  ]
})
export class AppComponent {
  readonly #languageService = inject(LanguageService);

  constructor() {
    this.#languageService.init();
  }
}
