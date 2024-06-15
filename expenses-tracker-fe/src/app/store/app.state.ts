import { map, switchMap } from 'rxjs';
import { Injectable, inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';
import { Action, State, StateContext } from '@ngxs/store';
import { NbComponentOrCustomStatus, NbToastrService } from '@nebular/theme';
import { append, patch, removeItem, updateItem } from '@ngxs/store/operators';
import { NbAuthOAuth2JWTToken, NbAuthService, NbAuthToken } from '@nebular/auth';

import { ApiService } from '@shared/services/api.service';

import { Category, Transaction, TransactionType } from './app.models';

import {
  CreateCategory,
  CreateCategoryFailed,
  CreateCategorySuccess,
  CreateTransaction,
  CreateTransactionFailed,
  CreateTransactionSuccess,
  DeleteCategory,
  DeleteCategoryFailed,
  DeleteCategorySuccess,
  DeleteTransaction,
  DeleteTransactionFailed,
  DeleteTransactionSuccess,
  GetCategories,
  GetCategoriesFailed,
  GetCategoriesSuccess,
  GetTransactions,
  GetTransactionsFailed,
  GetTransactionsSuccess,
  SetCategoriesLoader,
  SetTransactionsLoader,
  UpdateCategory,
  UpdateCategoryFailed,
  UpdateCategorySuccess,
  UpdateTransaction,
  UpdateTransactionFailed,
  UpdateTransactionSuccess
} from './app.actions';



export type CategoriesStats = ReadonlyArray<{
  status: NbComponentOrCustomStatus;
  value: string
}>;

export interface AppStateModel {
  categories: {
    data: Array<Category> | null;
    loader: boolean;
    filter: {
      type: TransactionType | 'ALL';
      date: unknown;
    }
  };
  transactions: {
    data: Array<Transaction> | null;
    loader: boolean;
  };
}

type CategoriesDataSafe = NonNullable<AppStateModel['categories']['data']>;
type TransactionsDataSafe =  NonNullable<AppStateModel['transactions']['data']>;

@State<AppStateModel>({
  name: 'app',
  defaults: {
    categories: {
      data: null,
      loader: false,
      filter: {
        type: 'ALL',
        date: null
      }
    },
    transactions: {
      data: null,
      loader: false,
    }
  }
})
@Injectable()
export class AppState {
  readonly #apiService = inject(ApiService);
  readonly #authService = inject(NbAuthService);
  readonly #toastrService = inject(NbToastrService);
  readonly #translocoService = inject(TranslocoService);

  /*
   *  categories loder
   */
  @Action(SetCategoriesLoader)
  setCategoriesLoader({ setState }: StateContext<AppStateModel>, { status }: SetCategoriesLoader): void {
    setState(
      patch<AppStateModel>({
        categories: patch<AppStateModel['categories']>({
          loader: status
        })
      })
    );
  }

  /*
   *  get categories
   */
  @Action(GetCategories)
  getCategories({ dispatch, getState }: StateContext<AppStateModel>, { forceLoad }: GetCategories): void {
    const categories = getState().categories.data

    if (!forceLoad && categories) {
      return;
    }

    dispatch(new SetCategoriesLoader(true));

    this.#authService.getToken().pipe(
      map((token: NbAuthToken) => (token as NbAuthOAuth2JWTToken).getAccessTokenPayload()),
      map(({ sub }) => sub),
      switchMap((userId: string) =>  this.#apiService.getCategories$(userId))
    )
    .subscribe({
      next: (categories: ReadonlyArray<Category>) => dispatch(new GetCategoriesSuccess(categories)),
      error: (error: Error) => dispatch(new GetCategoriesFailed(error))
    });
  }

  @Action(GetCategoriesSuccess)
  getCategoriesSuccess({ setState }: StateContext<AppStateModel>, { categories }: GetCategoriesSuccess): void {
    setState(
      patch<AppStateModel>({
        categories: patch<AppStateModel['categories']>({
          loader: false,
          data: categories as AppStateModel['categories']['data']
        })
      })
    );

    this.#showToast(this.#translocoService.translate('API.CATEGORIES.LOAD_SUCCESS'));
  }

  @Action(GetCategoriesFailed)
  getCategoriesFailed({ dispatch }: StateContext<AppStateModel>, { error }: GetCategoriesFailed): void {
    dispatch(new SetCategoriesLoader(false));

    throw error;
  }

  /*
   *  create category
   */
  @Action(CreateCategory)
  createCategory({ dispatch }: StateContext<AppStateModel>, { category }: CreateCategory): void {
    dispatch(new SetCategoriesLoader(true));

    this.#apiService
      .createCategory$(category)
      .subscribe({
        next: (category: Category) => dispatch(new CreateCategorySuccess(category)),
        error: (error: Error) => dispatch(new CreateCategoryFailed(error))
      });
  }

  @Action(CreateCategorySuccess)
  createCategorySuccess({ getState, setState }: StateContext<AppStateModel>, { category }: CreateCategorySuccess): void {
    setState(
      patch<AppStateModel>({
        categories: patch<AppStateModel['categories']>({
          loader: false,
          data: !getState().categories.data
            ? [category]
            : append<Category>([category]) as unknown as CategoriesDataSafe
        })
      })
    );

    this.#showToast(this.#translocoService.translate('API.CATEGORIES.CREATE_SUCCESS', { category: category.title }));
  }

  @Action(CreateCategoryFailed)
  createCategoryFailed({ dispatch }: StateContext<AppStateModel>, { error }: CreateCategoryFailed): void {
    dispatch(new SetCategoriesLoader(false));

    throw error;
  }

  /*
   *  update category
   */
  @Action(UpdateCategory)
  updateCategory({ dispatch }: StateContext<AppStateModel>, { id, category }: UpdateCategory): void {
    dispatch(new SetCategoriesLoader(true));

    this.#apiService
      .updateCategory$(id, category)
      .subscribe({
        next: (category: Category) => dispatch(new UpdateCategorySuccess(category)),
        error: (error: Error) => dispatch(new UpdateCategoryFailed(error))
      });
  }

  @Action(UpdateCategorySuccess)
  updateCategorySuccess({ setState }: StateContext<AppStateModel>, { category }: UpdateCategorySuccess): void {
    setState(
      patch<AppStateModel>({
        categories: patch<AppStateModel['categories']>({
          loader: false,
          data: updateItem<Category>(({ id }) => id === category.id, category) as unknown as CategoriesDataSafe
        })
      })
    );

    this.#showToast(this.#translocoService.translate('API.CATEGORIES.UPDATE_SUCCESS', { category: category.title }));
  }

  @Action(UpdateCategoryFailed)
  updateCategoryFailed({ dispatch }: StateContext<AppStateModel>, { error }: UpdateCategoryFailed): void {
    dispatch(new SetCategoriesLoader(false));

    throw error;
  }

  /*
   *  delete category
   */
  @Action(DeleteCategory)
  deleteCategory({ dispatch }: StateContext<AppStateModel>, { category }: DeleteCategory): void {
    dispatch(new SetCategoriesLoader(true));

    this.#apiService
      .deleteCategory$(category.id)
      .subscribe({
        next: () => dispatch(new DeleteCategorySuccess(category)),
        error: (error: Error) => dispatch(new DeleteCategoryFailed(error))
      });
  }

  @Action(DeleteCategorySuccess)
  deleteCategorySuccess({ setState }: StateContext<AppStateModel>, { category }: DeleteCategorySuccess): void {
    setState(
      patch<AppStateModel>({
        categories: patch<AppStateModel['categories']>({
          loader: false,
          data: removeItem<Category>(({ id }) => category.id === id) as unknown as NonNullable<AppStateModel['categories']['data']>
        })
      })
    );

    this.#showToast(this.#translocoService.translate('API.CATEGORIES.DELETE_SUCCESS', { category: category.title }));
  }

  @Action(DeleteCategoryFailed)
  deleteCategoryFailed({ dispatch }: StateContext<AppStateModel>, { error }: DeleteCategoryFailed): void {
    dispatch(new SetCategoriesLoader(false));

    throw error;
  }



  /*
   *  transactions loder
   */
  @Action(SetTransactionsLoader)
  setTransactionsLoader({ setState }: StateContext<AppStateModel>, { status }: SetTransactionsLoader): void {
    setState(
      patch<AppStateModel>({
        transactions: patch<AppStateModel['transactions']>({
          loader: status
        })
      })
    );
  }

  /*
   *  get transactions
   */
  @Action(GetTransactions)
  getTransactions({ dispatch, getState }: StateContext<AppStateModel>, { forceLoad }: GetTransactions): void {
    const transactions = getState().transactions.data

    if (!forceLoad && transactions) {
      return;
    }

    dispatch(new SetTransactionsLoader(true));

    this.#apiService
      .getTransactions$()
      .subscribe({
        next: (transactions: ReadonlyArray<Transaction>) => dispatch(new GetTransactionsSuccess(transactions)),
        error: (error: Error) => dispatch(new GetTransactionsFailed(error))
    });
  }

  @Action(GetTransactionsSuccess)
  getTransactionsSuccess({ setState }: StateContext<AppStateModel>, { transactions }: GetTransactionsSuccess): void {
    setState(
      patch<AppStateModel>({
        transactions: patch<AppStateModel['transactions']>({
          loader: false,
          data: transactions as AppStateModel['transactions']['data']
        })
      })
    );

    this.#showToast(this.#translocoService.translate('API.TRANSACTIONS.LOAD_SUCCESS'));
  }

  @Action(GetTransactionsFailed)
  getTransactionsFailed({ dispatch }: StateContext<AppStateModel>, { error }: GetTransactionsFailed): void {
    dispatch(new SetTransactionsLoader(false));

    throw error;
  }

  /*
   *  create transaction
   */
  @Action(CreateTransaction)
  createTransaction({ dispatch }: StateContext<AppStateModel>, { transaction }: CreateTransaction): void {
    dispatch(new SetTransactionsLoader(true));

    this.#apiService
      .createTransaction$(transaction)
      .subscribe({
        next: (transaction: Transaction) => dispatch(new CreateTransactionSuccess(transaction)),
        error: (error: Error) => dispatch(new CreateTransactionFailed(error))
      });
  }

  @Action(CreateTransactionSuccess)
  createTransactionSuccess({ getState, setState }: StateContext<AppStateModel>, { transaction }: CreateTransactionSuccess): void {
    setState(
      patch<AppStateModel>({
        transactions: patch<AppStateModel['transactions']>({
          loader: false,
          data: !getState().transactions.data
            ? [transaction]
            : append<Transaction>([transaction]) as unknown as TransactionsDataSafe
        })
      })
    );

    this.#showToast(this.#translocoService.translate('API.TRANSACTIONS.CREATE_SUCCESS', { transaction: transaction.title }));
  }

  @Action(CreateTransactionFailed)
  createTransactionFailed({ dispatch }: StateContext<AppStateModel>, { error }: CreateTransactionFailed): void {
    dispatch(new SetTransactionsLoader(false));

    throw error;
  }

  /*
   *  update transaction
   */
  @Action(UpdateTransaction)
  updateTransaction({ dispatch }: StateContext<AppStateModel>, { id, transaction }: UpdateTransaction): void {
    dispatch(new SetTransactionsLoader(true));

    this.#apiService
      .updateTransaction$(id, transaction)
      .subscribe({
        next: (transaction: Transaction) => dispatch(new UpdateTransactionSuccess(transaction)),
        error: (error: Error) => dispatch(new UpdateTransactionFailed(error))
      });
  }

  @Action(UpdateTransactionSuccess)
  updateTransactionSuccess({ setState }: StateContext<AppStateModel>, { transaction }: UpdateTransactionSuccess): void {
    setState(
      patch<AppStateModel>({
        transactions: patch<AppStateModel['transactions']>({
          loader: false,
          data: updateItem<Transaction>(({ id }) => id === transaction.id, transaction) as unknown as TransactionsDataSafe
        })
      })
    );

    this.#showToast(this.#translocoService.translate('API.TRANSACTIONS.UPDATE_SUCCESS', { transaction: transaction.title }));
  }

  @Action(UpdateTransactionFailed)
  updateTransactionFailed({ dispatch }: StateContext<AppStateModel>, { error }: UpdateTransactionFailed): void {
    dispatch(new SetTransactionsLoader(false));

    throw error;
  }

  /*
   *  delete transaction
   */
  @Action(DeleteTransaction)
  deleteTransaction({ dispatch }: StateContext<AppStateModel>, { transaction }: DeleteTransaction): void {
    dispatch(new SetTransactionsLoader(true));

    this.#apiService
      .deleteTransaction$(transaction.id)
      .subscribe({
        next: () => dispatch(new DeleteTransactionSuccess(transaction)),
        error: (error: Error) => dispatch(new DeleteTransactionFailed(error))
      });
  }

  @Action(DeleteTransactionSuccess)
  deleteTransactionSuccess({ setState }: StateContext<AppStateModel>, { transaction }: DeleteTransactionSuccess): void {
    setState(
      patch<AppStateModel>({
        transactions: patch<AppStateModel['transactions']>({
          loader: false,
          data: removeItem<Transaction>(({ id }) => transaction.id === id) as unknown as NonNullable<AppStateModel['transactions']['data']>
        })
      })
    );

    this.#showToast(this.#translocoService.translate('API.TRANSACTIONS.DELETE_SUCCESS', { transaction: transaction.title }));
  }

  @Action(DeleteTransactionFailed)
  deleteTransactionFailed({ dispatch }: StateContext<AppStateModel>, { error }: DeleteTransactionFailed): void {
    dispatch(new SetTransactionsLoader(false));

    throw error;
  }



  #showToast(message: string): void {
    this.#toastrService.show(null, message, {
      destroyByClick: true,
      icon: 'checkmark-outline',
      status: 'success'
    });
  }
}
