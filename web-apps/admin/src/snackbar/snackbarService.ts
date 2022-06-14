import { BehaviorSubject } from 'rxjs';

export type SnackbarSeverity = 'info' | 'success' | 'error' | 'warning';

export type SnackbarOptions = {
  message: string;
  severity: SnackbarSeverity;
};

class SnackbarService {
  private snackbarState = new BehaviorSubject<SnackbarOptions | null>(null);
  public snackbar = this.snackbarState.asObservable();

  /**
   * Shows a snackbar notification.
   * @param message 
   * @param severity Defaults to 'info'
   */
  public showSnackbar(message: string, severity: SnackbarSeverity = 'info') {
    this.snackbarState.next({ message, severity });
  }

  public handleCloseSnackbar(): void {
    this.snackbarState.next(null);
  }
}

const snackbarService = new SnackbarService();
export default snackbarService;