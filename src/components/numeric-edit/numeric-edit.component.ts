import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'numeric-edit',
    styleUrls: ['./numeric-edit.component.scss'],
    templateUrl: './numeric-edit.component.html'
})
export class NumericEditComponent implements OnInit, AfterViewInit, OnDestroy {
    private _autofocus: boolean = false;
    private _decimals: number;
    private _enabled: boolean = true;
    private _increment: number = 1;
    private _max: number;
    private _min: number;
    private _placeholder: string = ''
    private _readOnly: boolean = false;
    private _suffix: string;
    private _value: number;

    private _decimalSeparator = (1.1).toLocaleString().replace(/\d/g, '');
    private _hostElement: ElementRef;
    private _hostBlurTimeout: number;
    private _initialized = false;
    private _inputText: string;
    private _params: { [name: string]: any } = {};
    private _renderer: Renderer;
    private _formattedValue: string;

    constructor(hostElement: ElementRef, renderer: Renderer) {
        this.onHostBlur = this.onHostBlur.bind(this);
        this.onHostFocus = this.onHostFocus.bind(this);

        this._hostElement = hostElement;
        this._hostElement.nativeElement.addEventListener('blur', this.onHostBlur, true);
        this._hostElement.nativeElement.addEventListener('focus', this.onHostFocus, true);

        this._renderer = renderer;
    }

    public get autofocus(): boolean {
        return this._autofocus;
    }

    @Input()
    public set autofocus(autofocus: boolean) {
        if (this._autofocus == autofocus) {
            return;
        }

        this._autofocus = autofocus;
    }

    public get decimals(): number {
        return this._decimals;
    }

    @Input()
    public set decimals(decimals: number) {
        if (this._decimals == decimals) {
            return;
        }

        this._decimals = decimals;
        this.value = this.enforceConstraints(this.value);
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

    public get increment(): number {
        return this._increment;
    }

    @Input()
    public set increment(increment: number) {
        if (this._increment == increment) {
            return;
        }

        this._increment = increment;
    }

    public get max(): number {
        return this._max;
    }

    @Input()
    public set max(max: number) {
        if (this._max == max) {
            return;
        }

        this._max = max;
        this.value = this.enforceConstraints(this.value);
    }

    public get min(): number {
        return this._min;
    }

    @Input()
    public set min(min: number) {
        if (this._min == min) {
            return;
        }

        this._min = min;
        this.value = this.enforceConstraints(this.value);
    }

    public get placeholder(): string {
        return this._placeholder;
    }

    @Input()
    public set placeholder(placeholder: string) {
        if (this._placeholder == placeholder) {
            return;
        }

        if (placeholder == undefined) {
            placeholder = '';
        }

        this._placeholder = placeholder;
    }

    public get readOnly(): boolean {
        return this._readOnly;
    }

    @Input()
    public set readOnly(readOnly: boolean) {
        if (this._readOnly == readOnly) {
            return;
        }

        this._readOnly = readOnly;
    }

    public get suffix(): string {
        return this._suffix;
    }

    @Input()
    public set suffix(suffix: string) {
        if (this._suffix == suffix) {
            return;
        }

        this._suffix = suffix;
    }

    public get value(): number {
        return this._value;
    }

    @Input()
    public set value(value: number) {
        if (this._value == value) {
            return;
        }

        this._value = value;
        this.valueChange.emit(value);

        var text = this._hostFocused ? this.valueToString(value) : this.valueToLocaleString(value);

        if (this._inputText != text) {
            this._inputText = text;
            this.inputTextChange.emit(text);
        }
    }

    @Output()
    private valueChange = new EventEmitter<number>();

    private get inputText(): string {
        return this._inputText;
    }

    @Input()
    private set inputText(inputText: string) {
        if (this._inputText == inputText) {
            return;
        }

        this._inputText = inputText;
        this.inputTextChange.emit(this._inputText);

        var value = this.parseNumber(inputText);

        if (this._value != value) {
            this._value = value;
            this.valueChange.emit(value);
        }
    }

    @Output()
    private inputTextChange = new EventEmitter<string>();

    @HostBinding('attr.disabled')
    private get disabled(): string {
        if (this._enabled) {
            return undefined;
        }

        return 'disabled';
    }

    private get placeholderText(): string {
        return this._enabled ? this._placeholder : '';
    }

    @HostBinding('class.focus')
    private _hostFocused = false;

    @HostBinding('class.readonly')
    private get hostReadOnly(): boolean {
        return this._readOnly;
    }

    @HostBinding("attr.tabindex")
    private hostTabIndex = -1;

    private onHostFocus(): void {
        if (this._hostBlurTimeout != undefined) {
            clearTimeout(this._hostBlurTimeout);
            this._hostBlurTimeout = undefined;
        }

        this._hostFocused = true;

        if (!this._readOnly) {
            this._inputText = this.valueToString(this.value);
        }
    }

    private onHostBlur(): void {
        this._hostBlurTimeout = setTimeout(() => {
            this._hostFocused = false;
            this._inputText = this.valueToLocaleString(this.value);
        }, 10) as any;
    }

    @ViewChild('inputElement')
    private inputElement: any;

    public ngOnInit(): void {
        this._initialized = true;

        delete this._params;
    }

    public ngAfterViewInit(): void {
        if (this._autofocus) {
            this.focus();
        }
    }

    @HostListener('click')
    private hostClick(): void {
        if (this.enabled) {
            this.focus();
        }
    }

    public focus(): void {
        this._renderer.invokeElementMethod(this.inputElement.nativeElement, "focus");
    }

    private increase(): void {
        if (this.increment == undefined) {
            return;
        }

        this.addToValue(this.increment);
    }

    private decrease(): void {
        if (this.increment == undefined) {
            return;
        }

        this.addToValue(-this.increment);
    }

    private addToValue(add: number): void {
        if (!this.enabled || this.readOnly) {
            return;
        }

        if (this.value == undefined) {
            this.value = add;
            return;
        }

        var decimals = Math.max(this.getDecimalCount(this.value), this.getDecimalCount(add));
        var value = parseFloat((this.value + add).toFixed(decimals));

        this.value = this.enforceConstraints(value);
    }

    private getDecimalCount(value: number): number {
        var s = value.toString();

        if (s.indexOf('.') == -1) {
            return 0;
        }

        return s.split('.')[1].length;
    }

    private onInputKeyPress(event: KeyboardEvent): void {
        // ARROW UP;
        if (event.keyCode == 38) {
            this.increase();
        }

        // ARROW DOWN;
        if (event.keyCode == 40) {
            this.decrease();
        }
    }

    private parseNumber(inputText: string): number {
        if (inputText == undefined || inputText.trim().length == 0) {
            return undefined;
        }

        inputText = inputText.replace(this._decimalSeparator, '.');

        if (this.isFloat(inputText)) {
            return this.enforceConstraints(parseFloat(inputText));            
        }

        return undefined;
    }

    private isFloat(text: any): boolean {
        return !/^\s*$/.test(text) && !isNaN(text as any);
    }

    private valueToString(value: number): string {
        if (value == undefined) {
            return '';
        }

        var s = value
            .toString()
            .replace('.', this._decimalSeparator);

        return s;
    }

    private valueToLocaleString(value: number): string {
        if (value == undefined) {
            return '';
        }

        return value.toLocaleString();
    }

    private enforceConstraints(value: number): number {
        if (value == undefined) {
            return value;
        }

        if (this._max != undefined && value > this._max) {
            value = this._max;
        }

        if (this._min != undefined && value < this._min) {
            value = this._min;
        }

        if (this._decimals != undefined) {
            if (this._decimals == 0) {
                value = Math.round(value);
            } else {
                var pow = Math.pow(10, Math.abs(this._decimals));

                if (this._decimals > 0) {
                    value = Math.round(value * pow) / pow;
                }
                else {
                    value = Math.round(value / pow) * pow;
                }
            }
        }

        return value;
    }

    public ngOnDestroy(): void {
        this._hostElement.nativeElement.removeEventListener('blur', this.onHostBlur, true);
        this._hostElement.nativeElement.removeEventListener('focus', this.onHostFocus, true);
    }
}