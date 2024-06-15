import { TranslocoPipe } from '@jsverse/transloco';
import { AsyncPipe, UpperCasePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { NbAlertModule, NbBadgeModule, NbButtonModule, NbIconModule, NbListModule, NbSpinnerModule, NbTagModule } from '@nebular/theme';

import { Category } from '@store/app.models';

import { TextFormatPipe } from '@pipes/text-format.pipe';



@Component({
  selector: 'expenses-tracker-category-list',
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // modules
    NbAlertModule,
    NbButtonModule,
    NbIconModule,
    NbListModule,
    NbSpinnerModule,
    NbTagModule,
    NbBadgeModule,
    // pipes
    AsyncPipe,
    TextFormatPipe,
    TranslocoPipe,
    UpperCasePipe
  ]
})
export class CategoryListComponent {
  @Input({ required: true }) isLoading = false;
  @Input({ required: true }) isDialogOpened = false;
  @Input({ required: true }) set categories(value: ReadonlyArray<Category>) {
    this.userCategories = value.filter(({ isDefault }) => !isDefault);
    this.defaultCategories = value.filter(({ isDefault }) => isDefault);
  }

  userCategories: ReadonlyArray<Category> = [];
  defaultCategories: ReadonlyArray<Category> = [];

  @Output() readonly reload = new EventEmitter<void>();
  @Output() readonly categoryAdd = new EventEmitter<void>();
  @Output() readonly categoryEdit = new EventEmitter<Category>();
  @Output() readonly categoryRemove = new EventEmitter<Category>();
}
