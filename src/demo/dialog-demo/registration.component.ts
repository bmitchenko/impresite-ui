import { Component, ViewChild, ElementRef, AfterViewInit, DoCheck, EventEmitter } from '@angular/core';

import { DialogService } from '../../components/dialog/dialog.service';

import * as template from "./registration.component.html";
import * as styles from "./registration.component.scss";

@Component({
    selector: 'registration',
    template: template,
    styles: [styles]
})
export class RegistrationComponent implements DoCheck {
    private userName: string;
    private password: string;
    private validated = false;
    private validationErrors: any[];

    public close = new EventEmitter<string>();

    constructor(private dialogService: DialogService) {
    }

    public ngDoCheck(): void {
        if (this.validated) {
            this.validationErrors = this.validate();
        }
    }

    private validate(): any[] {
        var errors: any[] = [];

        if (this.userName == undefined || this.userName.trim().length == 0) {
            errors.push({ errorMessage: 'User name is required.', propertyName: 'userName' });
        }

        if (this.password == undefined || this.password.trim().length == 0) {
            errors.push({ errorMessage: 'Password is required.', propertyName: 'password' });
        }

        this.validated = true;

        return errors;
    }

    private registerClick() {
        if (this.validate().length > 0) {
            // this.dialogService.showWarning('Please, enter user name and password.');
            return;
        }

        this.close.emit(this.userName);
    }

    private cancelClick() {
        this.close.emit();
    }
}