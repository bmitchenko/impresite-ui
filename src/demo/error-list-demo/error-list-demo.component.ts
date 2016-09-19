import { Component, ViewChild, ElementRef, AfterViewInit, DoCheck } from '@angular/core';

import { ErrorListComponent } from '../../components/error-list/error-list.component';

import * as template from "./error-list-demo.component.html";
import * as styles from "./error-list-demo.component.scss";

@Component({
    selector: 'error-list-demo',
    template: template,
    styles: [styles]
})
export class ErrorListDemoComponent implements DoCheck {
    private firstName: string;
    private lastName: string;
    private age: number;

    @ViewChild(ErrorListComponent)
    public errorList: ErrorListComponent;

    constructor() {
    }

    private ngAfterViewInit() {
        this.errorList.properties = ['firstName', 'lastName', 'age'];
    }

    public ngDoCheck(): void {
        this.errorList.errors = this.validate();
    }

    private validate(): any[] {
        var errors: any[] = [];

        if (this.firstName == undefined || this.firstName.trim().length == 0) {
            errors.push({ errorMessage: 'First name is required.', propertyName: 'firstName' });
        }

        if (this.lastName == undefined || this.lastName.trim().length == 0) {
            errors.push({ errorMessage: 'Last name is required.', propertyName: 'lastName' });
        }

        if (this.age == undefined || this.age < 0) {
            errors.push({ errorMessage: 'Age is required.', propertyName: 'age' });
        }

        return errors;
    }
}