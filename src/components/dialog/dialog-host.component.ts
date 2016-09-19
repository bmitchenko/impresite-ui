import { Component, ComponentRef, HostBinding, ViewChild, Type, ComponentFactoryResolver, ViewRef, ComponentFactory, Directive, ViewContainerRef, Renderer } from "@angular/core";
import { ElementRef } from "@angular/core";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { DialogService } from "./dialog.service";
import { IDialogHost } from "./dialog-host";
import { IDialog } from "./dialog";

import * as template from "./dialog-host.component.html";
import * as styles from "./dialog-host.component.scss";

const DialogZIndex = 1000;

interface IOpenDialog {
    component: ComponentRef<IDialog>;
    closeSubscription: Subscription;
    clickListener: Function;
    resolve: Function;
    zIndex: number;
}

@Component({
    selector: 'dialog-host',
    styles: [styles],
    template: template
})
export class DialogHostComponent implements IDialogHost {
    private _dialogClicked = false;
    private _componentFactoryResolver: ComponentFactoryResolver;
    private _openDialogs: IOpenDialog[] = [];
    private _overlayIndex = DialogZIndex;
    private _overlayVisible = false;
    private _renderer: Renderer;

    @ViewChild('dialogTarget', { read: ViewContainerRef })
    private _viewContainer: ViewContainerRef;

    constructor(componentFactoryResolver: ComponentFactoryResolver, service: DialogService, renderer: Renderer) {
        this._componentFactoryResolver = componentFactoryResolver;
        this._renderer = renderer;

        service.registerHost(this);
    }

    public createDialog<T>(dialogType: Type<IDialog>, params?: any): Promise<any> {
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(dialogType);
        let component = this._viewContainer.createComponent(componentFactory);

        if (params != undefined) {
            Object.getOwnPropertyNames(params).forEach((propertyName) => {
                component.instance[propertyName] = params[propertyName];
            });
        }

        let clickListener = this._renderer.listen(component.location.nativeElement, 'click', () => {
            this._dialogClicked = true;
        });

        let closeSubscription = component.instance.close.subscribe((result: any) => {
            this.closeDialog(component.instance, result);
        }) as Subscription;

        let zIndex = this.getNextZIndex();

        this._renderer.setElementStyle(component.location.nativeElement, 'z-index', zIndex.toString());

        return new Promise((resolve) => {
            this._openDialogs.push({
                clickListener: clickListener,
                closeSubscription: closeSubscription,
                component: component,
                resolve: resolve,
                zIndex: zIndex
            });

            this.updateOverlay();
        });
    }

    public destroyDialog<T>(dialog: IDialog): void {
        var openDialog = this._openDialogs.find(x => x.component.instance == dialog);

        if (openDialog == undefined) {
            return;
        }

        openDialog.clickListener();
        openDialog.closeSubscription.unsubscribe();
        openDialog.component.destroy();

        this._openDialogs.splice(this._openDialogs.indexOf(openDialog), 1);

        this.updateOverlay();
    }

    public destroyDialogs(): void {
        this._openDialogs.slice(0).forEach((dialog) => {
            this.destroyDialog(dialog.component.instance);
        });
    }

    public closeDialog(dialog: IDialog, result?: any) {
        var openDialog = this._openDialogs.find(x => x.component.instance == dialog);

        if (openDialog == undefined) {
            return;
        }

        openDialog.resolve(result);

        this.destroyDialog(dialog);
    }

    private overlayClick(): void {
        if (this._dialogClicked) {
            this._dialogClicked = false;
            return;
        }

        if (this._openDialogs.length == 0) {
            return;
        }

        this.closeDialog( this._openDialogs[this._openDialogs.length - 1].component.instance);
    }

    private updateOverlay(): void {
        if (this._openDialogs.length > 0) {
            this._overlayIndex = this._openDialogs[this._openDialogs.length - 1].zIndex - 1;
        } else {
            this._overlayIndex = DialogZIndex;
        }

        this._overlayVisible = this._openDialogs.length > 0;
    }

    private getNextZIndex(): number {
        if (this._openDialogs.length == 0) {
            return DialogZIndex + 1;
        }

        return this._openDialogs[this._openDialogs.length - 1].zIndex + 2;
    }
}