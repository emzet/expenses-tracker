import { NbToastrService } from '@nebular/theme';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Provider, inject } from '@angular/core';



@Injectable({
  providedIn: 'root'
})
export class CustomErrorHandler implements ErrorHandler {
  readonly #toastrService = inject(NbToastrService);

  handleError(error: Error): void {
    console.error(error);

    const errorMessage = error instanceof HttpErrorResponse
      ? Array.isArray(error.error.message)
        ? error.error.message[0]
        : error.error.message
      : error.message

    this.#toastrService.show(null, errorMessage, {
      destroyByClick: true,
      icon: 'alert-triangle-outline',
      status: 'danger'
    });
  }
}



export const errorHandlerProvider: Provider = {
  provide  : ErrorHandler,
  useClass : CustomErrorHandler
};
