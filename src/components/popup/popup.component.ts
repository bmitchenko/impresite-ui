import { Component, HostBinding, HostListener, EventEmitter, Input, Output, Renderer, ElementRef } from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core';

import * as componentStyles from "./popup.component.scss";

@Component({
    selector: 'popup',
    template: "<ng-content></ng-content>",
    styles: [componentStyles]
})
export class PopupComponent implements OnDestroy {
    private _autoclose = true;
    private _hoverDelay: number = 300;
    private _hoverTimeout: number;
    private _popupListener: Function;
    private _position: PopupPosition = "bottom";
    private _target: ElementRef | HTMLElement;
    private _targetOrPopupClicked = false;
    private _targetListeners: Function[] = [];
    private _trigger: PopupTrigger = 'none';
    private _visible = false;
    private _visibleChanged = false;

    constructor(private elementRef: ElementRef, private renderer: Renderer) {
        this.onPopupClick = this.onPopupClick.bind(this);
        this.onTargetClick = this.onTargetClick.bind(this);
        this.onTargetMouseEnter = this.onTargetMouseEnter.bind(this);
        this.onTargetMouseOut = this.onTargetMouseOut.bind(this);

        renderer.setElementStyle(elementRef.nativeElement, "display", "none");
        this._popupListener = renderer.listen(elementRef.nativeElement, 'click', this.onPopupClick);
    }

    public get autoclose(): boolean {
        return this._autoclose;
    }

    @Input()
    public set autoclose(autoclose: boolean) {
        if (this._autoclose == autoclose) {
            return;
        }

        this._autoclose = autoclose;
    }

    public get hoverDelay(): number {
        return this._hoverDelay;
    }

    @Input()
    public set hoverDelay(hoverDelay: number) {
        if (this._hoverDelay == hoverDelay) {
            return;
        }

        this._hoverDelay = hoverDelay;
    }

    public get position(): PopupPosition {
        return this._position;
    }

    @Input()
    public set position(position: PopupPosition) {
        if (this._position == position) {
            return;
        }

        if (position == undefined || position.trim().length == 0) {
            throw new Error(`PopupComponent.position should not be empty.`);
        }

        if (position.indexOf(position) == -1) {
            throw new Error(`Invalid PopupComponent position: "${position}".`);
        }

        this._position = position;
        this.updatePosition();
    }

    public get target(): ElementRef | HTMLElement {
        return this._target;
    }

    @Input()
    public set target(target: ElementRef | HTMLElement) {
        if (this._target == target) {
            return;
        }

        if (this._target != undefined) {
            this.removeTargetListeners();
        }

        this._target = target;

        if (this._target != undefined) {
            this.addTargetListeners();
        }
    }

    @Input()
    public targetHeight: boolean = false;

    @Input()
    public targetWidth: boolean = false;

    public get trigger(): PopupTrigger {
        return this._trigger;
    }

    @Input()
    public set trigger(trigger: PopupTrigger) {
        if (this._trigger == trigger) {
            return;
        }

        if (trigger == undefined || trigger.trim().length == 0) {
            throw new Error(`PopupComponent.trigger should not be empty.`);
        }

        if (trigger != 'none' && trigger != 'hover' && trigger != 'click') {
            throw new Error(`PopupComponent.trigger should be "none", "hover" or "click".`);
        }

        this._trigger = trigger;
    }

    @Input()
    public get visible(): boolean {
        return this._visible;
    }

    public set visible(visible: boolean) {
        if (this._visible == visible) {
            return;
        }

        this._visible = visible;
        this._visibleChanged = visible;

        if (visible) {
            this.renderer.setElementStyle(this.elementRef.nativeElement, "display", "");
            this.updatePosition();
        } else {
            this.renderer.setElementStyle(this.elementRef.nativeElement, "display", "none");
        }

        this.visibleChange.emit(visible);
    }

    @Output()
    private visibleChange = new EventEmitter<boolean>();

    public ngOnDestroy(): void {
        this.cancelPopup();
        this._popupListener();
        this.removeTargetListeners();
    }

    @HostListener('document:click', ['$event'])
    private documentClick(event: MouseEvent): void {
        if (this._visibleChanged) {
            this._targetOrPopupClicked = false;
            this._visibleChanged = false;
            return;
        }
        
        if (!this._autoclose || !this._visible) {
            return;
        }

        if (!this._targetOrPopupClicked) {
            this.visible = false;
        }

        this._targetOrPopupClicked = false;
    }

    @HostListener('window:resize')
    private windowResize(event: MouseEvent): void {
        if (this._visible) {
            this.updatePosition();
        }
    }

    public hide(): void {
        this.visible = false;
    }

    public show(): void {
        this.visible = true;
    }

    private addTargetListeners(): void {
        var target = this.unboxTarget();

        this._targetListeners.push(this.renderer.listen(target, 'click', this.onTargetClick));
        this._targetListeners.push(this.renderer.listen(target, 'mouseover', this.onTargetMouseEnter));
        this._targetListeners.push(this.renderer.listen(target, 'mouseout', this.onTargetMouseOut));
    }

    private removeTargetListeners(): void {
        this._targetListeners.forEach((listener) => {
            listener();
        });

        this._targetListeners.length = 0;
    }

    private onPopupClick(): void {
        this._targetOrPopupClicked = true;
    }

    private onTargetClick(): void {
        this._targetOrPopupClicked = true;

        if (this._trigger == 'click') {
            this.visible = !this.visible;
        }
    }

    private onTargetMouseEnter(): void {
        if (this._trigger == 'hover') {
            this._hoverTimeout = setTimeout(() => {
                this.visible = true;
            }, this._hoverDelay) as any;
        }
    }

    private onTargetMouseOut(): void {
        this.cancelPopup();

        if (this._trigger == 'hover') {
            this.visible = false;
        }
    }

    private cancelPopup(): void {
        if (this._hoverTimeout != undefined) {
            clearTimeout(this._hoverTimeout);
            this._hoverTimeout = undefined;
        }
    }

    private unboxTarget(): HTMLElement {
        if (this.target == undefined) {
            return undefined;
        }

        if (this.target instanceof ElementRef) {
            return this.target.nativeElement;
        }

        return this.target;
    }

    private updatePosition(): void {
        var nativeElement = this.unboxTarget();
        var position = nativeElement == null
            ? this.getPositionRelativeToDocument()
            : this.getPositionRelativeToElement(nativeElement);

        this.setPosition(position);
    }

    private setPosition(position: IPopupPosition) {
        var element = this.elementRef.nativeElement as HTMLElement;

        element.style.top = position.top == undefined ? "" : position.top.toString() + "px";
        element.style.bottom = position.bottom == undefined ? "" : position.bottom.toString() + "px";
        element.style.left = position.left == undefined ? "" : position.left.toString() + "px";
        element.style.right = position.right == undefined ? "" : position.right.toString() + "px";

        if (position.height != null) {
            element.style.height = position.height.toString() + "px";
        } else {
            element.style.height = "";
        }

        if (position.width != null) {
            element.style.width = position.width.toString() + "px";
        } else {
            element.style.width = "";
        }

        if (position.translateX == undefined && position.translateY == undefined) {
            element.style.transform = "";
        } else {
            element.style.transform = "translate(" + (position.translateX || 0) + "%, " + (position.translateY || 0) + "%)";
        }
    }

    private getPositionRelativeToDocument(): IPopupPosition {
        var position = this.position
            .split(" ")
            .filter(x => x.length > 0);

        var documentHeight = document.documentElement.clientHeight;
        var documentWidth = document.documentElement.clientWidth;

        var popupPosition: IPopupPosition = {};

        position.forEach((side) => {
            switch (side) {
                case "top": popupPosition.top = 0; break;
                case "right": popupPosition.right = 0; break;
                case "bottom": popupPosition.bottom = 0; break;
                case "left": popupPosition.left = 0; break;
                default: break;
            }
        });

        if (position.length == 1) {
            switch (position[0]) {
                case "bottom":
                case "top":
                    popupPosition.left = documentWidth / 2;
                    popupPosition.translateX = -50;
                    break;
                case "left":
                case "right":
                    popupPosition.top = documentHeight / 2;
                    popupPosition.translateY = -50;
                    break;
                default: break;
            }
        }

        if (this.targetHeight) {
            popupPosition.height = documentWidth;
        }

        if (this.targetWidth) {
            popupPosition.width = documentWidth;
        }

        return popupPosition;
    }

    private getPositionRelativeToElement(nativeElement: any): IPopupPosition {
        var elementBounds = nativeElement.getBoundingClientRect();

        var position = this.position
            .split(" ")
            .filter(x => x.length > 0);

        var popupPosition: IPopupPosition = {};

        switch (position[0]) {
            case "top": popupPosition.bottom = document.documentElement.clientHeight - elementBounds.top; break;
            case "right": popupPosition.left = elementBounds.right; break;
            case "bottom": popupPosition.top = elementBounds.bottom; break;
            case "left": popupPosition.right = document.documentElement.clientWidth - elementBounds.left; break;
            default: break;
        }

        if (position.length > 1) {
            switch (position[1]) {
                case "top": popupPosition.top = elementBounds.top; break;
                case "right": popupPosition.right = document.documentElement.clientWidth - elementBounds.right; break;
                case "bottom": popupPosition.bottom = document.documentElement.clientHeight - elementBounds.bottom; break;
                case "left": popupPosition.left = elementBounds.left; break;
                default: break;
            }
        } else {
            switch (position[0]) {
                case "bottom":
                case "top":
                    popupPosition.left = elementBounds.left + elementBounds.width / 2;
                    popupPosition.translateX = -50;
                    break;
                case "left":
                case "right":
                    popupPosition.top = elementBounds.top + elementBounds.height / 2;
                    popupPosition.translateY = -50;
                    break;
                default: break;
            }
        }

        if (this.targetHeight) {
            popupPosition.height = elementBounds.height;
        }

        if (this.targetWidth) {
            popupPosition.width = elementBounds.width;
        }

        return popupPosition;
    }
}

export type PopupTrigger = 'none' | 'hover' | 'click';

interface IPopupPosition {
    bottom?: number;
    left?: number;
    right?: number;
    top?: number;
    width?: number;
    height?: number;
    translateX?: number;
    translateY?: number;
}

export type PopupPosition = 'bottom' | 'bottom left' | 'bottom right' | 'top' | 'top left' | 'top right' | 'left' | 'left top' | 'left bottom' | 'right' | 'right top' | 'right bottom';

var position = [
    'bottom', 'bottom left', 'bottom right',
    'top', 'top left', 'top right',
    'left', 'left top', 'left bottom',
    'right', 'right top', 'right bottom'
];