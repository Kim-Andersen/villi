export interface IEmailAuthService{
  /**
   * Creates a session token if the given token is valiue. 
   */
  sendEmailWithLoginLink(token: string): Promise<void>;
  /**
   * Creates a session token based on the given email token.
   */
  loginWithEmailToken(token: string): Promise<string>;
}