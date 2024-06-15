import { AsyncPipe } from '@angular/common';
import { Select, Store } from '@ngxs/store';
import { Navigate } from '@ngxs/router-plugin';
import { ActivatedRoute, Params } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { BehaviorSubject, Observable, first, map } from 'rxjs';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { QUERY_PARAMS_KEYS, QUERY_PARAMS_VALUES } from '@app/constants/query-parameters';

import { AppStateModel } from '@store/app.state';
import { Category, CategoryDto } from '@store/app.models';
import { CreateCategory, DeleteCategory, GetCategories, UpdateCategory } from '@store/app.actions';

import { ConfirmationDialogComponent } from '@components/confirmation-dialog/confirmation-dialog.component';

import { CategoryListComponent } from './category-list/category-list.component';
import { CategoryFormDialogComponent } from './category-form-dialog/category-form-dialog.component';



@Component({
  selector: 'expenses-tracker-management-categories-page',
  templateUrl: './management-categories-page.component.html',
  styleUrl: './management-categories-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    // components
    CategoryListComponent,
    // pipes
    AsyncPipe
  ]
})
export class ManagementCategoriesPageComponent {
  readonly #store = inject(Store);
  readonly #dialogService = inject(NbDialogService);
  readonly #activatedRoute = inject(ActivatedRoute);

  @Select((state: { app: AppStateModel }) => state.app.categories) categories$!: Observable<AppStateModel['categories']>;

  readonly #anyDialogOpened$ = new BehaviorSubject(false);
  readonly anyDialogOpened$ = this.#anyDialogOpened$.asObservable();

  constructor() {
    this.#store.dispatch(new GetCategories());

    const idFromQueryParam = this.#activatedRoute.snapshot.queryParamMap.get(QUERY_PARAMS_KEYS.ID);

    if (!idFromQueryParam) {
      return;
    }

    this.categories$.pipe(
      map(({ data }: AppStateModel['categories']) => data),
      first(Boolean),
      map((categories: ReadonlyArray<Category>) => ({
        categories,
        category: categories.find(({ id }: Category) => id === idFromQueryParam)
      }))
    )
    .subscribe({
      next: ({ categories, category }: { categories: ReadonlyArray<Category>, category: Category | undefined }) => category
        ? this.onCategoryEdit(categories, category)
        : this.onCategoryAdd(categories)
    });
  }

  onReloadButtonClick(): void {
    this.#store.dispatch(new GetCategories(true));
  }

  onCategoryAdd(categories: ReadonlyArray<Category>): void {
    this.#anyDialogOpened$.next(true);

    this.#updateQueryParams({
      [QUERY_PARAMS_KEYS.ID]: QUERY_PARAMS_VALUES.NEW
    });

    this.#dialogService
      .open(CategoryFormDialogComponent, {
        context: {
          categories
        }
      })
      .onClose
      .subscribe({
        next: (categoryDto: CategoryDto) => {
          this.#anyDialogOpened$.next(false);

          this.#updateQueryParams({
            [QUERY_PARAMS_KEYS.ID]: null
          });

          if (categoryDto) {
            this.#store.dispatch(new CreateCategory(categoryDto))
          }
        }
      });
  }

  onCategoryEdit(categories: ReadonlyArray<Category>, { id, isDefault, ...existingCategory }: Category): void {
    if (isDefault) {
      return;
    }

    this.#anyDialogOpened$.next(true);

    this.#updateQueryParams({
      [QUERY_PARAMS_KEYS.ID]: id
    });

    this.#dialogService
      .open(CategoryFormDialogComponent, {
        context: {
          categories,
          categoryFormValue: existingCategory
        }
      })
      .onClose
      .subscribe({
        next: (categoryDto: CategoryDto) => {
          this.#anyDialogOpened$.next(false);

          this.#updateQueryParams({
            [QUERY_PARAMS_KEYS.ID]: null
          });

          if (categoryDto) {
            this.#store.dispatch(new UpdateCategory(id, categoryDto));
          }
        }
      });
  }

  onCategoryRemove(category: Category): void {
    if (category.isDefault) {
      return;
    }

    this.#anyDialogOpened$.next(true);

    this.#dialogService
      .open(ConfirmationDialogComponent, {
        context: {
          mainText: 'MANAGEMENT.CATEGORIES_PAGE.DIALOG_REMOVE_TEXT',
          mainTextParams: {
            categoryTitle: category.title
          },
          confirmButtonStatus: 'danger'
        }
      })
      .onClose
      .subscribe({
        next: (isConfirmed: boolean) => {
          this.#anyDialogOpened$.next(false);

          if (isConfirmed) {
            this.#store.dispatch(new DeleteCategory(category))
          }
        }
      });
  }

  #updateQueryParams(queryParams: Params): void {
    this.#store.dispatch(new Navigate([], queryParams, {
      preserveFragment: true,
      queryParamsHandling: 'merge',
      relativeTo: this.#activatedRoute,
      replaceUrl: true
    }));
  }
}
