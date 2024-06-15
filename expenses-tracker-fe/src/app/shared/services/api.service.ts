import { HttpClient } from '@angular/common/http';
import { type Observable, delay, map } from 'rxjs';
import { Injectable, inject } from '@angular/core';

import type { Category, CategoryDto, CategoryResponse, Transaction, TransactionDto, TransactionResponse } from '@store/app.models';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  readonly #http = inject(HttpClient);

  readonly #DELAY_IN_MS = 500; // NOTE: for demo purpose

  readonly #CATEGORIES_ENDPOINT = 'categories' as const;
  readonly #TRANSACTIONS_ENDPOINT = 'transactionRecords' as const;

  /*
   *  categories
   */
  getCategories$(userId: string): Observable<ReadonlyArray<Category>> {
    return this.#http.get<ReadonlyArray<CategoryResponse>>(this.#CATEGORIES_ENDPOINT).pipe(
      map(categories => categories.map(({ authorId, id, title }) => ({
        id,
        title,
        isDefault: authorId !== userId
      }))),
      delay(this.#DELAY_IN_MS)
    );
  }

  createCategory$(categoryDto: CategoryDto): Observable<Category> {
    return this.#http.post<Category>(this.#CATEGORIES_ENDPOINT, categoryDto).pipe(
      map(({ id, title }) => ({
        id,
        title,
        isDefault: false
      })),
      delay(this.#DELAY_IN_MS)
    );
  }

  updateCategory$(id: Category['id'], categoryDto: CategoryDto): Observable<Category> {
    return this.#http.put<Category>(`${this.#CATEGORIES_ENDPOINT}/${id}`, categoryDto).pipe(
      map(({ id, title }) => ({
        id,
        title,
        isDefault: false
      })),
      delay(this.#DELAY_IN_MS)
    );
  }

  deleteCategory$(id: Category['id']): Observable<CategoryResponse> {
    return this.#http.delete<CategoryResponse>(`${this.#CATEGORIES_ENDPOINT}/${id}`).pipe(
      delay(this.#DELAY_IN_MS)
    );
  }

  /*
   *  transactions
   */
  getTransactions$(): Observable<ReadonlyArray<Transaction>> {
    return this.#http.get<ReadonlyArray<TransactionResponse>>(this.#TRANSACTIONS_ENDPOINT).pipe(
      map(transactions => transactions.map(({ amount, categoryId, date, description, id, title, type }) => ({
        amount,
        categoryId,
        date,
        description,
        id,
        title,
        type
      }))),
      delay(this.#DELAY_IN_MS)
    );
  }

  createTransaction$(transactionDto: TransactionDto): Observable<Transaction> {
    return this.#http.post<Transaction>(this.#TRANSACTIONS_ENDPOINT, transactionDto).pipe(
      map(({ amount, categoryId, date, description, id, title, type }) => ({
        amount,
        categoryId,
        date,
        description,
        id,
        title,
        type
      })),
      delay(this.#DELAY_IN_MS)
    );
  }

  updateTransaction$(id: Transaction['id'], transactionDto: TransactionDto): Observable<Transaction> {
    return this.#http.put<Transaction>(`${this.#TRANSACTIONS_ENDPOINT}/${id}`, transactionDto).pipe(
      map(({ amount, categoryId, date, description, id, title, type }) => ({
        amount,
        categoryId,
        date,
        description,
        id,
        title,
        type
      })),
      delay(this.#DELAY_IN_MS)
    );
  }

  deleteTransaction$(id: Transaction['id']): Observable<TransactionResponse> {
    return this.#http.delete<TransactionResponse>(`${this.#TRANSACTIONS_ENDPOINT}/${id}`).pipe(
      delay(this.#DELAY_IN_MS)
    );
  }
}
