import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

interface GlobalVariables {
  shouldShowHeader: boolean;
  shouldShowFooter: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class GlobalDataSharingService {
  private globalVariables = new BehaviorSubject<GlobalVariables>({
    shouldShowHeader: true,
    shouldShowFooter: true,
  });

  switchTabFuncCall: Subject<void> = new Subject<void>();

  public globalVariables$ = this.globalVariables.asObservable();

  //For Loader
  private isLoaderEnabled = new BehaviorSubject<boolean>(false);
  isLoaderEnabled$ = this.isLoaderEnabled.asObservable();

  constructor() {}

  // Set shouldShowFooter value
  setShouldShowFooter(value: boolean) {
    const currentValue = this.globalVariables.getValue();
    this.globalVariables.next({ ...currentValue, shouldShowFooter: value });
  }

  // Get shouldShowFooter value
  getShouldShowFooter(): boolean {
    const currentValue = this.globalVariables.getValue();
    return currentValue ? currentValue.shouldShowFooter : false;
  }

  // Set shouldShowHeader value
  setShouldShowHeader(value: boolean) {
    const currentValue = this.globalVariables.getValue();
    this.globalVariables.next({ ...currentValue, shouldShowHeader: value });
  }

  // Get shouldShowHeader value
  getShouldShowHeader(): boolean {
    const currentValue = this.globalVariables.getValue();
    return currentValue ? currentValue.shouldShowHeader : false;
  }

  LoaderShow() {
    this.isLoaderEnabled.next(true);
  }

  LoaderHide() {
    this.isLoaderEnabled.next(false);
  }
}
