import { Component, ComponentRef, ComponentFactory, Directive, EventEmitter, Type, ViewContainerRef } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Observable } from "rxjs/Observable";

import { IDialog } from "./dialog";

export interface IDialogHost {
    createDialog<T>(dialogType: Type<IDialog>, params?: any): Promise<any>;
    closeDialog(dialog: IDialog, result?: any): void;
    destroyDialog<T>(dialog: IDialog): void;
    destroyDialogs(): void;
}