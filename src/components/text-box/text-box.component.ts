import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

@Component({
    selector: 'text-box',
    styleUrls: ['./text-box.component.scss'],
    templateUrl: './text-box.component.html'
})
export class TextBoxComponent implements AfterViewInit {
    private _autofocus = false;
    private _disabled = false;
    private _enabled = true;
    private _focused = false;
    private _maxLength: number;
    private _placeholder: string;
    private _placeholderText: string = '';
    private _readOnly = false;
    private _readOnlyAttr: string;
    private _text: string;
    private _type = 'text';
    private _usePasswordChar = false;

    constructor(private _renderer: Renderer) {
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

    public get enabled(): boolean {
        return this._enabled;
    }

    @Input()
    public set enabled(enabled: boolean) {
        if (this._enabled == enabled) {
            return;
        }

        this._disabled = !enabled;
        this._enabled = enabled;
    }

    public get maxLength(): number {
        return this._maxLength;
    }

    @Input()
    public set maxLength(maxLength: number) {
        if (this._maxLength == maxLength) {
            return;
        }

        this._maxLength = maxLength;
        this.text = this.enforceMaxLength(this.text);
    }

    public get placeholder(): string {
        return this._placeholder;
    }

    @Input()
    public set placeholder(placeholder: string) {
        if (this._placeholder == placeholder) {
            return;
        }

        this._placeholder = placeholder;
        this._placeholderText = this._readOnly ? '' : (this._placeholder || '');
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
        this._readOnlyAttr = readOnly ? 'readonly' : undefined;
        this._placeholderText = readOnly ? '' : this._placeholder || '';
    }

    public get text(): string {
        return this._text;
    }

    @Input()
    public set text(text: string) {
        if (text != undefined) {
            text = text.toString();
        }

        if (this._text == text) {
            return;
        }

        this._text = this.enforceMaxLength(text);
        this.textChange.emit(this._text);
    }

    @Output()
    private textChange = new EventEmitter<string>();

    public get usePasswordChar(): boolean {
        return this._usePasswordChar;
    }

    @Input()
    public set usePasswordChar(usePasswordChar: boolean) {
        if (this._usePasswordChar == usePasswordChar) {
            return;
        }

        this._usePasswordChar = usePasswordChar;
        this._type = usePasswordChar ? "password" : "text";
    }

    @ViewChild('inputElement')
    private inputElement: any;

    public ngAfterViewInit(): void {
        if (this._autofocus) {
            this._renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus');
        }
    }

    private enforceMaxLength(text: string): string {
        if (this._maxLength != undefined && text != undefined) {
            if (text.length > this._maxLength) {
                return text.substr(0, this._maxLength);
            }
        }

        return text;
    }
}