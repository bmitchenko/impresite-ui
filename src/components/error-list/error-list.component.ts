import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer, DoCheck } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import * as template from "./error-list.component.html";
import * as styles from "./error-list.component.scss";

export interface IErrorListItem {
    propertyName: string;
    errorMessage: string;
}

interface IErrorMessage {
    errorMessage: string;
    visible: boolean;
}

@Component({
    selector: 'error-list',
    styles: [styles],
    template: template
})
export class ErrorListComponent {
    private _errors: IErrorListItem[];
    private _messages: IErrorMessage[] = [];
    private _properties: string[];

    public get errors(): IErrorListItem[] {
        return this._errors;
    }

    @Input()
    public set errors(errors: IErrorListItem[]) {
        this._errors = errors;
        this.updateMessages();
    }

    public get properties(): string[] {
        return this._properties;
    }

    @Input()
    public set properties(properties: string[]) {
        this._properties = properties;
        this.updateMessages();
    }

    private getMessages(): string[] {
        if (this._errors == undefined || this._errors.length == 0) {
            return [];
        }

        if (this._properties == undefined) {
            return this._errors.map(x => x.errorMessage);
        }

        var errorMessages: string[] = [];

        for (var i = 0; i < this._errors.length; i++) {
            for (var j = 0; j < this._properties.length; j++) {
                if (this._errors[i].propertyName == this._properties[j]) {
                    errorMessages.push(this._errors[i].errorMessage);
                }
            }
        }

        return errorMessages;
    }

    private updateMessages(): void {
        var messages = this.getMessages();

        for (var i = 0; i < this._messages.length; i++) {
            var index = messages.indexOf(this._messages[i].errorMessage);

            if (index == -1) {
                this._messages[i].visible = false;
            } else {
                this._messages[i].visible = true;
                messages[index] = '';
            }
        }

        for (var i = 0; i < messages.length; i++) {
            if (messages[i] != '') {
                this._messages.push({ errorMessage: messages[i], visible: true });
            }
        }
    }
}


// module spa.controls {
//     @component({ name: "validation-errors", template: "ValidationErrors.html" })
//     export class ValidationErrors {
//         private parameters: IValidationErrorsConfig;
//         private errors = ko.observableArray<IErrorVM>();

//         constructor(params?: IValidationErrorsConfig) {
//             this.getErrors = this.getErrors.bind(this);

//             this.parameters = params;
//         }

//         private getErrors(viewModel: any): IErrorVM[] {
//             var errors = (this.parameters == null || this.parameters.errors == null) ? null : ko.unwrap(this.parameters.errors);

//             if (errors == null && viewModel != null && viewModel.errors != null) {
//                 errors = ko.unwrap(viewModel.errors);
//             }

//             if (errors == null) {
//                 this.updateVisibleErrors(null);
//             }
//             else {
//                 var propertyNames = (this.parameters == null || this.parameters.for == null) ? null : ko.unwrap(this.parameters.for);

//                 if (propertyNames == null) {
//                     this.updateVisibleErrors(errors.map(x => x.errorText));
//                 }
//                 else {
//                     this.updateVisibleErrors(errors.filter(x => propertyNames.contains(x.propertyName)).map(x => x.errorText));
//                 }
//             }

//             return this.errors();
//         }

//         private updateVisibleErrors(errorMessages: string[]) {
//             var visibleMessages = this.errors();

//             if (visibleMessages != null) {
//                 visibleMessages.forEach((visibleMessage) => {
//                     if (errorMessages == null || !errorMessages.contains(visibleMessage.errorMessage)) {
//                         visibleMessage.visible(false);
//                     }
//                 });
//             }

//             if (errorMessages != null) {
//                 errorMessages.forEach((message) => {
//                     var visibleMessage = visibleMessages.filter(x => x.errorMessage == message)[0];

//                     if (visibleMessage == null) {
//                         this.errors.push({ errorMessage: message, visible: ko.observable(true) });
//                     }
//                     else {
//                         visibleMessage.visible(true);
//                     }
//                 });
//             }
//         }
//     }

//     interface IErrorVM {
//         errorMessage: string;
//         visible: KnockoutObservable<boolean>;
//     }

//     export interface IValidationErrorsConfig {
//         errors?: IValidationError[] | Observable<IValidationError[]>;
//         for?: string[] | Observable<string[]>;
//     }
// }