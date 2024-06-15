/*
 *  categories
 */
export interface Category {
  id: string;
  title: string;
  isDefault: boolean;
}

export interface CategoryResponse extends Omit<Category, 'isDefault'> {
  shared: boolean;
  authorId: string;
}

export type CategoryDto = Omit<Category, 'authorId' | 'id' | 'isDefault' | 'shared'>;

/*
 *  transactions
 */
/**
 *  t(ENUMS.TRANSACTION_TYPES.EXPENSE)
 *  t(ENUMS.TRANSACTION_TYPES.INCOME)
 */
export type TransactionType
  = 'EXPENSE'
  | 'INCOME'

export const TRANSACTION_TYPES: ReadonlyArray<TransactionType> = [
  'EXPENSE',
  'INCOME'
] as const;

export interface Transaction {
  amount: number;
  categoryId: string;
  date: string;
  description: string;
  id: string;
  title: string;
  type: TransactionType;
}

export interface TransactionResponse extends Transaction {
  shared: boolean;
  authorId: string;
}

export type TransactionDto = Omit<Transaction, 'authorId' | 'id' | 'shared'>;
