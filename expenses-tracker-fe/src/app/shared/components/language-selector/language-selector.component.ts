import { UpperCasePipe } from '@angular/common';
import { NbButtonGroupModule, NbButtonModule, NbIconModule } from '@nebular/theme';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

import { DEFAULT_LANG } from '@providers/transloco.options';



@Component({
  selector: 'expenses-tracker-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // modules
    NbButtonGroupModule,
    NbButtonModule,
    NbIconModule,
    // pipes
    UpperCasePipe
  ]
})
export class LanguageSelectorComponent {
  @Input({ required: true }) activeLanguage = DEFAULT_LANG;
  @Input({ required: true }) availableLanguages: ReadonlyArray<string> = [];

  @Output() readonly languageSelect = new EventEmitter<string>();
}
