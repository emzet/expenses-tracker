import { TranslocoPipe } from '@jsverse/transloco';
import { NgTemplateOutlet, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { NbButtonModule, NbCardModule, NbDialogRef, NbIconModule, NbInputModule } from '@nebular/theme';

import { Category, CategoryDto } from '@app/store/app.models';



@Component({
  selector: 'expenses-tracker-category-form-dialog',
  templateUrl: './category-form-dialog.component.html',
  styleUrl: './category-form-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // directives
    NgTemplateOutlet,
    // modules
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    ReactiveFormsModule,
    // pipes
    TranslocoPipe,
    UpperCasePipe
  ]
})
export class CategoryFormDialogComponent implements OnInit {
  readonly #dialogRef = inject(NbDialogRef<CategoryFormDialogComponent>)

  @Input() categoryFormValue: CategoryDto | undefined;
  @Input({ required: true }) categories: ReadonlyArray<Category> = [];

  isEditMode = false;

  readonly categoryForm = new FormGroup({
    title: new FormControl<string | null>(null, [Validators.required])
  });

  ngOnInit(): void {
    const uniqeValidatorFn: ValidatorFn = ({ value }) => this.categories
      .find(({ title }) => value?.toLowerCase() === title.toLowerCase())
        ? { duplicate: true }
        : null;

    this.categoryForm.controls.title.addValidators(uniqeValidatorFn);

    if (this.categoryFormValue) {
      this.isEditMode = true;
      this.categoryForm.setValue(this.categoryFormValue);
    }
  }

  onConfirmButtonClick(): void {
    this.categoryForm.markAllAsTouched();

    if (this.categoryForm.invalid) {
      return;
    }

    this.#dialogRef.close(this.categoryForm.value);
  }

  onCancelButtonClick(): void {
    this.#dialogRef.close();
  }
}
