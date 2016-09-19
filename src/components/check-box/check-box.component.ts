import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import * as template from "./check-box.component.html";
import * as styles from "./check-box.component.scss";

@Component({
    selector: 'check-box',
    styles: [styles],
    template: template
})
export class CheckBoxComponent implements OnInit, AfterViewInit {
    private _autofocus = false;
    private _checked = false;
    private _checkedValue: any = true;
    private _enabled = true;
    private _mode: CheckBoxMode = 'set';
    private _uncheckedValue: any;
    private _value: any = false;

    private _hostElement: ElementRef;
    private _initialized = false;
    private _params: { [name: string]: any } = {};
    private _renderer: Renderer;

    constructor(hostElement: ElementRef, renderer: Renderer) {
        this._hostElement = hostElement;
        this._renderer = renderer;
    }

    public ngOnInit(): void {
        this._initialized = true;

        if (this._mode == 'set' && !("_uncheckedValue" in this)) {
            this._uncheckedValue = false;
        }

        if (this._params["checked"] != undefined) {
            this.checked = this._params["checked"];
        } else {
            if (this._params["value"] != undefined) {
                this.value = this._params["value"];
            }
        }

        delete this._params;
    }

    public ngAfterViewInit(): void {
        if (this._autofocus) {
            this._renderer.invokeElementMethod(this._hostElement.nativeElement, "focus");
        }
    }

    @HostBinding("attr.disabled")
    private get hostDisabled(): string {
        if (this._enabled) {
            return undefined;
        }

        return "disabled";
    }

    @HostBinding("attr.tabindex")
    private get hostTabIndex(): number {
        return this._enabled ? 0 : -1;
    }

    @HostListener("click")
    private onHostClick(): void {
        if (this._enabled) {
            this.checked = !this.checked;
        }
    }

    @HostListener("keydown", ["$event"])
    private onHostKeyDown(event: KeyboardEvent): void {
        if (this._enabled) {
            if (event.keyCode == 32) { // SPACE
                this.checked = !this.checked;
            }
        }
    }

    public get autofocus(): boolean {
        return this._autofocus;
    }

    @Input()
    public set autofocus(autofocus: boolean) {
        this._autofocus = autofocus;
    }

    public get checked(): boolean {
        return this._checked;
    }

    @Input()
    public set checked(checked: boolean) {
        if (this._checked == checked) {
            return;
        }

        if (!this._initialized) {
            this._params["checked"] = checked;
            return;
        }

        this._checked = checked;
        this.checkedChange.emit(checked);

        if (this._checked) {
            this.value = this.replace(this.value, this.uncheckedValue, this.checkedValue, this._mode);
        }
        else {
            this.value = this.replace(this.value, this.checkedValue, this.uncheckedValue, this._mode);
        }
    }

    @Output()
    public checkedChange = new EventEmitter<boolean>();

    public get checkedValue(): any {
        return this._checkedValue;
    }

    @Input()
    public set checkedValue(checkedValue: any) {
        if (this._checkedValue === checkedValue) {
            return;
        }

        var oldCheckedValue = this._checkedValue;

        this._checkedValue = checkedValue;

        if (this._checked) {
            this.value = this.replace(this.value, oldCheckedValue, checkedValue, this._mode);
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    @Input()
    public set enabled(enabled: boolean) {
        if (this._enabled == enabled) {
            return;
        }

        this._enabled = enabled;
    }

    public get mode(): CheckBoxMode {
        return this._mode;
    }

    @Input()
    public set mode(mode: CheckBoxMode) {
        if (this._mode == mode) {
            return;
        }

        if (mode == undefined) {
            throw new Error('CheckBox [mode] should not by undefined.');
        }

        if (mode != 'set' && mode != 'push' && mode != 'flag') {
            throw new Error('CheckBox [mode] should be "set", "flag" or "push".');
        }

        var currentValue = this.checked ? this.checkedValue : this.uncheckedValue;
        var value = this.set(this.unset(this.value, currentValue, this._mode), currentValue, mode);

        this._mode = mode;

        this.value = value;
    }

    public get uncheckedValue(): any {
        return this._uncheckedValue;
    }

    @Input()
    public set uncheckedValue(uncheckedValue: any) {
        if (this._uncheckedValue === uncheckedValue) {
            return;
        }

        var oldUncheckedValue = this._uncheckedValue;

        this._uncheckedValue = uncheckedValue;

        if (!this.checked) {
            this.value = this.replace(this.value, oldUncheckedValue, uncheckedValue, this._mode);
        }
    }

    public get value(): any {
        return this._value;
    }

    @Input()
    public set value(value: any) {
        if (this._value === value) {
            return;
        }

        if (!this._initialized) {
            this._params["value"] = value;
            return;
        }

        this._value = value;
        this.valueChange.emit(value);

        this.checked = this.isSet(this.value, this.checkedValue, this._mode);
    }

    @Output()
    private valueChange = new EventEmitter<any>();

    private isSet(source: any, value: any, mode: CheckBoxMode): any {
        if (value === undefined) {
            return false;
        }

        if (mode == 'set') {
            return source === value;
        }

        if (mode == 'flag') {
            return (source & value) === value;
        }

        if (mode == 'push' && source != undefined && source instanceof Array) {
            return source.indexOf(value) != -1;
        }

        return false;
    }

    private set(source: any, value: any, mode: CheckBoxMode): any {
        if (mode == 'set') {
            return value;
        }

        if (mode == 'flag') {
            if (typeof source == 'number') {
                if (typeof value == 'number') {
                    return source | value;
                }

                return source;
            }

            if (typeof value == 'number') {
                return value;
            }

            return undefined;
        }

        if (mode == 'push') {
            if (source instanceof Array) {
                if (value !== undefined) {
                    var a = source.slice(0);

                    if (a.indexOf(value) == -1) {
                        a.push(value);
                    }

                    return a;
                }

                return source;
            }
            else {
                if (value === undefined) {
                    return [];
                }

                return [value];
            }
        }

        return source;
    }

    private unset(source: any, value: any, mode: CheckBoxMode): any {
        if (mode == 'set') {
            if (value === undefined) {
                return source;
            }

            if (source === value) {
                return undefined;
            }

            return source;
        }

        if (mode == 'flag') {
            if (typeof source == 'number' && typeof value == 'number') {
                return source & ~value;
            }
        }

        if (mode == 'push') {
            if (source instanceof Array && value !== undefined) {
                var index = source.indexOf(value);

                if (index != -1) {
                    var a = source.slice(0);
                    a.splice(index, 1);

                    return a;
                }
            }
        }

        return source;
    }

    private replace(source: any, oldValue: any, newValue: any, mode: CheckBoxMode): any {
        return this.set(this.unset(source, oldValue, mode), newValue, mode);
    }
}

type CheckBoxMode = 'set' | 'flag' | 'push';