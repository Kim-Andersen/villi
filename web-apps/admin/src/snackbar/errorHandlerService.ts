import { BehaviorSubject } from 'rxjs';
import { APIRequestError } from '../api/APIRequestError';

export type ErrorDetails = {
  error: Error;
  title: string;
  text?: string;
  json?: unknown;
};

class ErrorHandlerService {
  private errorState = new BehaviorSubject<ErrorDetails | null>(null);
  public error = this.errorState.asObservable();

  /**
   * Shows a snackbar notification.
   * @param message 
   * @param severity Defaults to 'info'
   */
  public async handleError(error: Error) {
    if (error instanceof APIRequestError) {
      const json = await error.response.json();
      this.errorState.next({ 
        error, 
        title: 'API error', 
        json 
      });
    } else {
      this.errorState.next({ 
        error, 
        title: 'Error',
        text: error.message
      });
    }
  }

  public clear(): void {
    this.errorState.next(null);
  }
}

const errorHandlerService = new ErrorHandlerService();
export default errorHandlerService;