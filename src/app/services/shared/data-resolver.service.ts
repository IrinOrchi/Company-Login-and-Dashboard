import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { ServiceInfo } from '../../models/shared/ServiceInfo';
import { LoginService } from '../login.service';

@Injectable({
  providedIn: 'root'
})
export class DataResolverService {

  constructor(private loginService: LoginService,) { }


}


