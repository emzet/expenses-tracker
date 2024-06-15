import { Category, CategoryDto, Transaction, TransactionDto } from './app.models';

/*
 *  categories loader
 */
export class SetCategoriesLoader {
  static readonly type = '[App] SetCategoriesLoader';
  constructor(public status: boolean) {}
}

/*
 *  get categories
 */
export class GetCategories {
  static readonly type = '[App] GetCategories';
  constructor(public forceLoad?: boolean) {}
}

export class GetCategoriesSuccess {
  static readonly type = '[App] GetCategoriesSuccess';
  constructor(public categories: ReadonlyArray<Category>) {}
}

export class GetCategoriesFailed {
  static readonly type = '[App] GetCategoriesFailed';
  constructor(public error: Error) {}
}

/*
 *  create category
 */
export class CreateCategory {
  static readonly type = '[App] CreateCategory';
  constructor(public category: CategoryDto) {}
}

export class CreateCategorySuccess {
  static readonly type = '[App] CreateCategorySuccess';
  constructor(public category: Category) {}
}

export class CreateCategoryFailed {
  static readonly type = '[App] CreateCategoryFailed';
  constructor(public error: Error) {}
}

/*
 *  update category
 */
export class UpdateCategory {
  static readonly type = '[App] UpdateCategory';
  constructor(
    public id: Category['id'],
    public category: CategoryDto
  ) {}
}

export class UpdateCategorySuccess {
  static readonly type = '[App] UpdateCategorySuccess';
  constructor(public category: Category) {}
}

export class UpdateCategoryFailed {
  static readonly type = '[App] UpdateCategoryFailed';
  constructor(public error: Error) {}
}

/*
 *  delete category
 */
export class DeleteCategory {
  static readonly type = '[App] DeleteCategory';
  constructor(public category: Category) {}
}

export class DeleteCategorySuccess {
  static readonly type = '[App] DeleteCategorySuccess';
  constructor(public category: Category) {}
}

export class DeleteCategoryFailed {
  static readonly type = '[App] DeleteCategoryFailed';
  constructor(public error: Error) {}
}



/*
 *  transactions loader
 */
export class SetTransactionsLoader {
  static readonly type = '[App] SetTransactionsLoader';
  constructor(public status: boolean) {}
}

/*
 *  get transactions
 */
export class GetTransactions {
  static readonly type = '[App] GetTransactions';
  constructor(public forceLoad?: boolean) {}
}

export class GetTransactionsSuccess {
  static readonly type = '[App] GetTransactionsSuccess';
  constructor(public transactions: ReadonlyArray<Transaction>) {}
}

export class GetTransactionsFailed {
  static readonly type = '[App] GetTransactionsFailed';
  constructor(public error: Error) {}
}

/*
 *  create transaction
 */
export class CreateTransaction {
  static readonly type = '[App] CreateTransaction';
  constructor(public transaction: TransactionDto) {}
}

export class CreateTransactionSuccess {
  static readonly type = '[App] CreateTransactionSuccess';
  constructor(public transaction: Transaction) {}
}

export class CreateTransactionFailed {
  static readonly type = '[App] CreateTransactionFailed';
  constructor(public error: Error) {}
}

/*
 *  update transaction
 */
export class UpdateTransaction {
  static readonly type = '[App] UpdateTransaction';
  constructor(
    public id: Transaction['id'],
    public transaction: TransactionDto
  ) {}
}

export class UpdateTransactionSuccess {
  static readonly type = '[App] UpdateTransactionSuccess';
  constructor(public transaction: Transaction) {}
}

export class UpdateTransactionFailed {
  static readonly type = '[App] UpdateTransactionFailed';
  constructor(public error: Error) {}
}

/*
 *  delete transaction
 */
export class DeleteTransaction {
  static readonly type = '[App] DeleteTransaction';
  constructor(public transaction: Transaction) {}
}

export class DeleteTransactionSuccess {
  static readonly type = '[App] DeleteTransactionSuccess';
  constructor(public transaction: Transaction) {}
}

export class DeleteTransactionFailed {
  static readonly type = '[App] DeleteTransactionFailed';
  constructor(public error: Error) {}
}
