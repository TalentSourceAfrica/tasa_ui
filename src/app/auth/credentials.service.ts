import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';

export interface Credentials {
  // Customize received credentials here
  username: string;
  token: string;
}

const credentialsKey = 'credentials';
const tokenKey = 'access_token';

/**
 * Provides storage for authentication credentials.
 * The Credentials interface should be replaced with proper implementation.
 */
@Injectable({
  providedIn: 'root',
})
export class CredentialsService {
  public userData: any = null;
  public loggedInUserType: any = {
    isAdmin: false,
    isRecruiter: false,
    isMentee: false,
    isMentor: false,
  };
  private _credentials: Credentials | null = null;
  private _token: any = null;

  constructor(private cookieService: CookieService) {
    const savedCredentials = sessionStorage.getItem(credentialsKey) || localStorage.getItem(credentialsKey);
    if (savedCredentials) {
      this._credentials = JSON.parse(savedCredentials);
    }
  }

  /**
   * Checks is the user is authenticated.
   * @return True if the user is authenticated.
   */
  isAuthenticated(): boolean {
    return !!this.credentials;
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get credentials(): Credentials | null {
    return  this._credentials
  }

  /**
   * Gets the user credentials.
   * @return The user credentials or null if the user is not authenticated.
   */
  get token(): Credentials | null {
    return this._credentials;
  }

  /**
   * Sets the user credentials.
   * The credentials may be persisted across sessions by setting the `remember` parameter to true.
   * Otherwise, the credentials are only persisted for the current session.
   * @param credentials The user credentials.
   * @param remember True to remember credentials across sessions.
   */
  setCredentials(credentials?: Credentials, remember?: boolean) {
    this._credentials = credentials || null;
    this.userData = credentials;

    if (credentials) {
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem(credentialsKey, JSON.stringify(credentials));
    } else {
      this.userData = null;
      sessionStorage.removeItem(credentialsKey);
      sessionStorage.removeItem(tokenKey);
      localStorage.removeItem(credentialsKey);
    }
  }

  setToken(token: any) {
    this._token = token || null;
    if (token) {
      this.cookieService.put(tokenKey, token);
    } else {
      this.cookieService.remove(tokenKey);
    }
  }

  deleteAllCookies(){
    this.cookieService.removeAll();
  }

  getLoggedInUserType() {
    const credentials: any = this.credentials;
    if (credentials && typeof credentials !== 'undefined') {
      switch (credentials.type) {
        case 'Admin':
          this.loggedInUserType.isAdmin = true;
          break;
        case 'Mentee':
          this.loggedInUserType.isMentee = true;
          break;
        case 'Recruiter':
          this.loggedInUserType.isRecruiter = true;
          break;
        case 'Mentor':
          this.loggedInUserType.isMentor = true;
          break;
      }
    }
    return this.loggedInUserType;
  }
}
