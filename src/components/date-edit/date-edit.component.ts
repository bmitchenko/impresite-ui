import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core';

import { PopupComponent } from '../popup/popup.component';

@Component({
    selector: 'date-edit',
    styleUrls: ['./date-edit.component.scss'],
    templateUrl: './date-edit.component.html'
})
export class DateEditComponent implements AfterViewInit, OnDestroy {
    private _autofocus = false;
    private _enabled = true;
    private _format = 'dd.MM.yyyy';
    private _formatSpecifiers = ['dd', 'MM', 'yyyy'];
    private _hostBlurTimeout: number;
    private _hostElement: ElementRef;
    private _placeholder = '';
    private _readOnly = false;
    private _renderer: Renderer;
    private _text: string;
    private _value: Date;

    @HostBinding('attr.disabled')
    private get disabled(): string {
        if (this._enabled) {
            return undefined;
        }

        return 'disabled';
    }

    @HostBinding('class.focus')
    private _hostFocused = false;

    @HostBinding('class.readonly')
    private get hostReadOnly(): boolean {
        return this._readOnly;
    }

    @HostBinding("attr.tabindex")
    private hostTabIndex = -1;

    @ViewChild('inputElement')
    private _inputElement: any;

    constructor(hostElement: ElementRef, renderer: Renderer) {
        this.onHostBlur = this.onHostBlur.bind(this);
        this.onHostFocus = this.onHostFocus.bind(this);

        this._hostElement = hostElement;
        this._hostElement.nativeElement.addEventListener('blur', this.onHostBlur, true);
        this._hostElement.nativeElement.addEventListener('focus', this.onHostFocus, true);

        this._renderer = renderer;
    }

    @ViewChild(PopupComponent)
    private popup: PopupComponent;

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

    public get format(): string {
        return this._format;
    }

    @Input()
    public set format(format: string) {
        if (this._format == format) {
            return;
        }

        this._format = format;
    }

    public get placeholder(): string {
        return this._placeholder;
    }

    @Input()
    public set placeholder(placeholder: string) {
        if (placeholder == undefined) {
            placeholder = '';
        }

        if (this._placeholder == placeholder) {
            return;
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

    public get value(): Date {
        return this._value;
    }

    @Input()
    public set value(value: Date) {
        if (this._value == value) {
            return;
        }

        this._value = value;
        this.valueChange.emit(value);

        if (value == undefined) {
            this._text = '';
        } else {
            this._text = this.formatDate(value, this._format);
        }
    }

    @Output()
    private valueChange = new EventEmitter<Date>();

    private get text(): string {
        return this._text;
    }

    private set text(text: string) {
        if (this._text == text) {
            return;
        }

        this._text = text;

        var value = this.parseDate(text, this._format);

        if (this.compareDate(this._value, value)) {
            return;
        }

        this._value = value;
        this.valueChange.emit(value);
    }

    private get placeholderText(): string {
        return this._enabled ? this._placeholder : '';
    }

    public ngAfterViewInit(): void {
        if (this._autofocus) {
            this._renderer.invokeElementMethod(this._hostElement.nativeElement, "focus");
        }

        this.popup.target = this._hostElement;
    }

    public ngOnDestroy(): void {
        this._hostElement.nativeElement.removeEventListener("focus", this.onHostFocus, true);
        this._hostElement.nativeElement.removeEventListener("blur", this.onHostBlur, true);
    }

    private buttonClick(): void {
        if (this.enabled && !this.readOnly) {
            this.popup.visible = !this.popup.visible;
        }
    }

    private calendarDateSelected(date: Date): void {
        this.value = date;
        this.focus();
        this.popup.visible = false;
    }

    public focus(): void {
        this._renderer.invokeElementMethod(this._inputElement.nativeElement, "focus");
    }

    private onHostFocus(): void {
        if (this._hostBlurTimeout != undefined) {
            clearTimeout(this._hostBlurTimeout);
            this._hostBlurTimeout = undefined;
        }

        this._hostFocused = true;
    }

    private onHostBlur(): void {
        this._hostBlurTimeout = setTimeout(() => {
            this._hostFocused = false;
            this.popup.visible = false;
        }, 10) as any;
    }

    private compareDate(d1?: Date, d2?: Date): boolean {
        if (d1 == undefined && d2 == undefined) {
            return true;
        }

        if (d1 != undefined || d2 != undefined) {
            return false;
        }

        return d1.toDateString() == d2.toDateString();
    }

    private parseDate(text: string, format: string): Date {
        if (text == undefined || text.trim().length == 0 || format == undefined || text.length != format.length) {
            return undefined;
        }

        var parts: { [specifier: string]: number } = {};

        this._formatSpecifiers.forEach((specifier) => {
            var index = format.indexOf(specifier);

            if (index != -1) {
                parts[specifier] = parseInt(text.substr(index, specifier.length));
            }
        });

        if (parts['yyyy'] == undefined || parts['MM'] == undefined || parts['dd'] == undefined) {
            return undefined;
        }

        try {
            var d = new Date(parts['yyyy'], parts['MM'] - 1, parts['dd']);

            if (d != undefined && !isNaN(d.getTime()) && isFinite(d.getTime())) {
                return d;
            }
        }
        catch (error) {
        }

        return undefined;
    }

    private formatDate(date: Date, format: string): string {
        if (date == undefined || isNaN(date.getTime()) || !isFinite(date.getTime())) {
            return '';
        }

        var result = format;

        this._formatSpecifiers.forEach((specifier) => {
            result = result.replace(specifier, this.getDatePart(specifier, date));
        });

        return result;
    }

    private getDatePart(specifier: string, date: Date): string {
        switch (specifier) {
            case 'd': return date.getDate().toString();
            case 'dd': return this.zeroPrefix(date.getDate(), 2);
            case 'M': return (date.getMonth() + 1).toString();
            case 'MM': return this.zeroPrefix(date.getMonth() + 1, 2);
            case 'yy': return date.getFullYear().toString().substring(2);
            case 'yyyy': return date.getFullYear().toString();
            default: throw new Error(`Unknown date format specifier: ${specifier}.`);
        }
    }

    private zeroPrefix(n: number, minLength: number): string {
        var result = n.toString();

        while (result.length < minLength) {
            result = '0' + result;
        }

        return result;
    }
}