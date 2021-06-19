import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CredentialsService } from '../credentials.service';

@Injectable({
  providedIn: 'root',
})
export class FreelancerGuard implements CanActivate {
  constructor(private router: Router, private credentialsService: CredentialsService) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const user: any = this.credentialsService.credentials;
    if (user && user.isFreelancer === 'Y') {
      return true;
    }
    this.router.navigate(['/home'], { replaceUrl: true });
    return false;
  }
}
