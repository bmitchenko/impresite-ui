import { Attribute, Component, Input, Output, EventEmitter, HostBinding, HostListener } from '@angular/core';

import * as template from "./pivot-item.component.html";
import * as styles from "./pivot-item.component.scss";

@Component({
    selector: 'pivot-item',
    styles: [styles],
    template: template
})
export class PivotItemComponent {
    private _selected: boolean = false;
    private _value: any;

    constructor() {
        this.onClick = this.onClick.bind(this);
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(selected: boolean) {
        this._selected = selected;
        this.hostSelected = selected;
    }

    public get value(): any {
        return this._value;
    }

    @Input()
    public set value(value: any) {
        if (this._value === value) {
            return;
        }

        this._value = value;
        this.valueChange.emit(this._value);
    }

    @Output()
    public valueChange = new EventEmitter<any>();

    @Output()
    public itemClick = new EventEmitter<any>();

    @HostBinding('class.pivot-item-selected')
    private hostSelected: boolean = false;

    @HostListener('click')
    private onClick(): void {
        this.itemClick.emit(this);
    }
}