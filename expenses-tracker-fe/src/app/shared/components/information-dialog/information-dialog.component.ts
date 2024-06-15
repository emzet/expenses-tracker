import { TranslocoPipe } from '@jsverse/transloco';
import { NbButtonModule, NbCardModule, NbDialogRef } from '@nebular/theme';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';



@Component({
  selector: 'expenses-tracker-information-dialog',
  templateUrl: './information-dialog.component.html',
  styleUrl: './information-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // modules
    NbButtonModule,
    NbCardModule,
    // pipes
    TranslocoPipe
  ],
})
export class InformationDialogComponent {
  readonly #dialogRef = inject(NbDialogRef<InformationDialogComponent>);

  @Input() mainText = '';
  @Input() isTranslatable = false;
  @Input() confirmButtonStatus = 'primary';
  @Input() confirmButtonText = 'INFORMATION_DIALOG.BUTTONS.CONFIRM';

  onAnyButtonClick(): void {
    this.#dialogRef.close();
  }
}
