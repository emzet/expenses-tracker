import { isBefore } from 'date-fns';
import { maskitoParseNumber } from '@maskito/kit';
import { TranslocoPipe } from '@jsverse/transloco';
import { MaskitoDirective } from '@maskito/angular';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { NbAlertModule, NbButtonModule, NbCardModule, NbDatepickerModule, NbDialogRef, NbIconModule, NbInputModule, NbSelectModule } from '@nebular/theme';

import { TextFormatPipe } from '@pipes/text-format.pipe';

import { validDateValidatorFn } from '@utils/date.utils';
import { AMOUNT_MASK, DATE_MASK } from '@utils/maskito.utils';

import { Category, TransactionDto, TransactionType } from '@store/app.models';



@Component({
  selector: 'expenses-tracker-transaction-form-dialog',
  templateUrl: './transaction-form-dialog.component.html',
  styleUrl: './transaction-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // directives
    NgTemplateOutlet,
    MaskitoDirective,
    // modules
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbDatepickerModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    ReactiveFormsModule,
    // pipes
    TextFormatPipe,
    TranslocoPipe,
    UpperCasePipe
  ]
})
export class TransactionFormDialogComponent implements OnInit {
  readonly #dialogRef = inject(NbDialogRef<TransactionFormDialogComponent>)

  @Input() transactionFormValue: TransactionDto | undefined;
  @Input({ required: true }) categories: ReadonlyArray<Category> = [];
  @Input({ required: true }) types: ReadonlyArray<TransactionType> = [];

  isEditMode = false;

  readonly DATE_MASK = DATE_MASK;
  readonly AMOUNT_MASK = AMOUNT_MASK;

  readonly transactionForm = new FormGroup({
    amount: new FormControl<string | null>(null, [Validators.required]),
    categoryId: new FormControl<Category['id'] | null>(null, [Validators.required]),
    date: new FormControl<Date | null>(null, [Validators.required, validDateValidatorFn]),
    description: new FormControl<string | null>(null),
    title: new FormControl<string | null>(null, [Validators.required]),
    type: new FormControl<TransactionType | null>(null, [Validators.required])
  });

  transactionDatePickerFilterFn = (selectedDate: Date) => isBefore(selectedDate, new Date());

  ngOnInit(): void {
    if (this.transactionFormValue) {
      this.isEditMode = true;

      this.transactionForm.setValue({
        ...this.transactionFormValue,
        date: new Date(this.transactionFormValue.date),
        amount: this.transactionFormValue.amount.toString()
      });
    }
  }

  onConfirmButtonClick(): void {
    this.transactionForm.markAllAsTouched();

    if (this.transactionForm.invalid) {
      return;
    }

    this.#dialogRef.close({
      ...this.transactionForm.value,
      amount: maskitoParseNumber(this.transactionForm.controls.amount.value!)
    });
  }

  onCancelButtonClick(): void {
    this.#dialogRef.close();
  }
}
