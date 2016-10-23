import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

@Component({
    selector: 'radio-button',
    styleUrls: ['./radio-button.component.scss'],
    templateUrl: './radio-button.component.html'
})
export class RadioButtonComponent implements OnInit, AfterViewInit {
    private _autofocus = false;
    private _checked = false;
    private _checkedValue: any = true;
    private _enabled = true;
    private _initialized = false;
    private _params: { [name: string]: any } = {};
    private _value: any = false;

    private _hostElement: ElementRef;
    private _renderer: Renderer;

    constructor(hostElement: ElementRef, renderer: Renderer) {
        this._hostElement = hostElement;
        this._renderer = renderer;
    }

    public ngOnInit(): void {
        this._initialized = true;

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
            this.checked = true;
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
            this.value = this.checkedValue;
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

        this._checkedValue = checkedValue;

        if (this.checked) {
            this.value = checkedValue;
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

        this.checked = this.checkedValue == value;
    }

    @Output()
    private valueChange = new EventEmitter<any>();
}