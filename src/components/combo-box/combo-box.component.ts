import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import { PopupComponent } from '../popup/popup.component';
import { ScrollTopDirective } from '../../directives/scroll-top.directive';

@Component({
    selector: 'combo-box',
    styleUrls: ['./combo-box.component.scss'],
    templateUrl: './combo-box.component.html'
})
export class ComboBoxComponent implements OnInit, AfterViewInit {
    private _activeItemIndex: number = -1;
    private _autofocus: boolean = false;
    private _displayMember: ComboBoxDisplayMember;
    private _emptyText: string;
    private _enabled: boolean = true;
    private _focused: boolean = false;
    private _hostElement: ElementRef;
    private _initialized = false;
    private _items: any[];
    private _params: { [name: string]: any } = {};
    private _placeholder: string;
    private _renderer: Renderer;
    private _selectedItem: any;
    private _text: string;
    private _value: any;
    private _valueMember: ComboBoxValueMember;

    constructor(hostElement: ElementRef, renderer: Renderer) {
        this._hostElement = hostElement;
        this._renderer = renderer;
    }

    @HostBinding("class.focus")
    public get hostFocused(): boolean {
        return this._focused || this.popup.visible;
    }

    @HostBinding("attr.disabled")
    public get hostDisabled(): string {
        if (this._enabled) {
            return undefined;
        }

        return "disabled";
    }

    @HostBinding("attr.tabIndex")
    private hostTabIndex = 0;

    @HostListener('focusin')
    private hostFocusIn(): void {
        this._focused = true;
    }

    @HostListener('focusout')
    private hostFocusOut(): void {
        this._focused = false;
    }

    @HostListener('keydown', ['$event'])
    private hostKeyDown(event: KeyboardEvent): boolean {
        if (!this._enabled) {
            return false;
        }

        // RETURN;
        if (event.keyCode == 13) {
            if (this.popup.visible) {
                if (this._activeItemIndex == -1) {
                    this.selectedItem = null;
                }
                else {
                    this.selectedItem = this._items[this._activeItemIndex];
                }

                this.popup.hide();
            }

            return false;
        }

        // DELETE;
        if (event.keyCode == 46) {
            this.selectedItem = null;
            this.popup.visible = false;

            return false;
        }

        // ARROW UP;
        if (event.keyCode == 38) {
            if (this.popup.visible) {
                this.activateAdjacent(-1);
            } else {
                this.selectAdjacent(-1);
            }

            return false;
        }

        // ARROW DOWN;
        if (event.keyCode == 40) {
            if (event.altKey) {
                this.openPopup();
            } else {
                if (this.popup.visible) {
                    this.activateAdjacent(1);
                } else {
                    this.selectAdjacent(1);
                }
            }

            return false;
        }

        return true;
    }

    public get displayMember(): ComboBoxDisplayMember {
        return this._displayMember;
    }

    @Input()
    public set displayMember(displayMember: ComboBoxDisplayMember) {
        if (this._displayMember == displayMember) {
            return;
        }

        this._displayMember = displayMember;

        if (this._selectedItem != undefined) {
            this._text = this.getDisplayText(this._selectedItem);
            this.textChange.emit(this._text);
        }
    }

    public get emptyText(): string {
        return this._emptyText;
    }

    @Input()
    public set emptyText(emptyText: string) {
        if (this._emptyText == emptyText) {
            return;
        }

        this._emptyText = emptyText;
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

        if (!this._enabled) {
            this.popup.hide();
        }

        console.log(enabled);
    }

    public get items(): any[] {
        return this._items;
    }

    @Input()
    public set items(items: any[]) {
        if (this._items == items) {
            return;
        }

        this._items = items;

        if (this._selectedItem != null) {
            if (this._items == null || this._items.indexOf(this._selectedItem) == -1) {
                this.selectedItem = null;
            }
        }
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
    }

    public get selectedItem(): any {
        return this._selectedItem;
    }

    @Input()
    public set selectedItem(selectedItem: any) {
        if (this._selectedItem == selectedItem) {
            return;
        }

        if (!this._initialized) {
            this._params["selectedItem"] = selectedItem;
            return;
        }

        if (selectedItem != null && (this._items == undefined || this._items.indexOf(selectedItem) == -1)) {
            return;
        }

        this._selectedItem = selectedItem;

        var text = this.getDisplayText(selectedItem);
        var textChanged = this._text != text;

        this._text = text;

        var value = this.getValue(selectedItem);
        var valueChanged = this._value != value;

        this._value = value;

        this.selectedItemChange.emit(selectedItem);

        if (textChanged) {
            this.textChange.emit(this._text);
        }

        if (valueChanged) {
            this.valueChange.emit(this._value);
        }
    }

    @Output()
    public selectedItemChange = new EventEmitter<any>();

    public get text(): string {
        return this._text;
    }

    @Input()
    public set text(text: string) {
        if (this._text == text) {
            return;
        }

        if (!this._initialized) {
            this._params["text"] = text;
            return;
        }

        var selectedItem: any = undefined;

        if (this._items != null) {
            selectedItem = this._items.filter(x => this.getDisplayText(x) == text)[0];
        }

        this.selectedItem = selectedItem;
    }

    @Output()
    public textChange = new EventEmitter<string>();

    public get value(): any {
        return this._value;
    }

    @Input()
    public set value(value: any) {
        if (this._value == value) {
            return;
        }

        if (!this._initialized) {
            this._params["value"] = value;
            return;
        }

        var selectedItem: any = undefined;

        if (this._items != null && this._items.length > 0) {
            selectedItem = this._items.filter(x => this.getValue(x) == value)[0];
        }

        this.selectedItem = selectedItem;
    }

    @Output()
    public valueChange = new EventEmitter<any>();

    public get valueMember(): ComboBoxValueMember {
        return this._valueMember;
    }

    @Input()
    public set valueMember(valueMember: ComboBoxValueMember) {
        if (this._valueMember == valueMember) {
            return;
        }

        this._valueMember = valueMember;

        if (this._selectedItem != undefined) {
            this._value = this.getValue(this._selectedItem);
            this.valueChange.emit(this._value);
        }
    }

    @ContentChild(TemplateRef)
    private itemTemplate: TemplateRef<any>;

    @ViewChild(PopupComponent)
    private popup: PopupComponent;

    @ViewChild(ScrollTopDirective)
    private popupScroll: ScrollTopDirective;

    public ngOnInit(): void {
        var selectedItem: any = undefined;

        if (this._params["selectedItem"] != undefined) {
            selectedItem = this._params["selectedItem"];
        } else {
            if (this._items != undefined && this._items.length > 0) {
                if (this._params["value"] != undefined) {
                    selectedItem = this._items.find(x => this.getValue(x) == this._params["value"]);
                } else {
                    if (this._params["text"] != undefined) {
                        selectedItem = this._items.find(x => this.getDisplayText(x) == this._params["text"]);
                    }
                }
            }
        }

        this._initialized = true;

        delete this._params;

        this.selectedItem = selectedItem;
    }

    public ngAfterViewInit(): void {
        if (this._autofocus) {
            this._renderer.invokeElementMethod(this._hostElement.nativeElement, "focus");
        }

        this.popup.target = this._hostElement;
    }

    private focusHost(): void {
        this._renderer.invokeElementMethod(this._hostElement.nativeElement, "focus");
    }

    private emptyItemClick(): void {
        this.selectedItem = undefined;
        this.popup.visible = false;
        this.focusHost();
    }

    private itemClick(item: any): void {
        this.selectedItem = item;
        this.popup.visible = false;
        this.focusHost();
    }

    private togglePopup(): void {
        if (this.popup.visible) {
            this.popup.hide();
        } else {
            if (this._enabled && this._items != null && this._items.length > 0) {
                this.openPopup();
            }
        }
    }

    private setActiveItemIndex(index: number): void {
        this._activeItemIndex = index;
    }

    private getDisplayText(item: any): string {
        if (item == undefined) {
            return this._placeholder || '';
        }

        if (this._displayMember != null) {
            var text = typeof this._displayMember == "string" ? item[this._displayMember] : this._displayMember(item);

            if (text != null) {
                text = text.toString();
            } else {
                text = "";
            }

            return text;
        }

        return item.toString();
    }

    private getValue(item: any): any {
        if (item == undefined) {
            return undefined;
        }

        if (this._valueMember != undefined) {
            if (typeof this._valueMember == "string") {
                return item[this._valueMember];
            }

            return this._valueMember(item);
        }

        return item;
    }

    private selectAdjacent(delta: number): void {
        if (this._items == undefined || this._items.length == 0) {
            return;
        }

        if (this.selectedItem == undefined) {
            this.selectedItem = this._items[0];
        } else {
            var index = this._items.indexOf(this.selectedItem) + delta;

            if (index < 0) {
                index = this._items.length - 1;
            }

            if (index > this._items.length - 1) {
                index = 0;
            }

            this.selectedItem = this._items[index];
        }
    }

    private activateAdjacent(delta: number): void {
        if (this._items == undefined || this._items.length == 0) {
            return;
        }

        var minIndex = 0;

        if (this._emptyText) {
            minIndex = -1;
        }

        this._activeItemIndex += delta;

        if (this._activeItemIndex < minIndex) {
            this._activeItemIndex = this._items.length - 1;
        }

        if (this._activeItemIndex > this._items.length - 1) {
            this._activeItemIndex = minIndex;
        }

        this.scrollToActiveItem();
    }

    private openPopup(): void {
        if (this._selectedItem == undefined) {
            this._activeItemIndex = -1;
        } else {
            this._activeItemIndex = this._items.indexOf(this._selectedItem);
        }

        this.popup.visible = true;

        setTimeout(() => {
            this.scrollToActiveItem();
        }, 10);
    }

    private scrollToActiveItem(): void {
        if (this._activeItemIndex == -1) {
            return;
        }

        if (this._emptyText) {
            this.popupScroll.scrollToElementIndex(this._activeItemIndex + 1);
        } else {
            this.popupScroll.scrollToElementIndex(this._activeItemIndex);
        }
    }
}

type ComboBoxDisplayMember = string | { (item: any): string };
type ComboBoxValueMember = string | { (item: any): any };