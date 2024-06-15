import { TranslocoPipe } from '@jsverse/transloco';
import { NbButtonModule, NbCardModule, NbDialogRef } from '@nebular/theme';
import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';



@Component({
  selector: 'expenses-tracker-confirmation-dialog',
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.scss',
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
export class ConfirmationDialogComponent {
  readonly #dialogRef = inject(NbDialogRef<ConfirmationDialogComponent>);

  @Input() mainText = 'CONFIRMATION_DIALOG.TEXT';
  @Input() mainTextParams = {};

  @Input() confirmButtonStatus = 'primary'
  @Input() confirmButtonText = 'CONFIRMATION_DIALOG.BUTTONS.CONFIRM';

  @Input() cancelButtonStatus = 'basic'
  @Input() cancelButtonText = 'CONFIRMATION_DIALOG.BUTTONS.CANCEL';

  onAnyButtonClick(status: boolean): void {
    this.#dialogRef.close(status);
  }
}
