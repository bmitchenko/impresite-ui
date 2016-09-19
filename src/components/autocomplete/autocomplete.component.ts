import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { Subject } from 'rxjs/Subject';

import { AutocompleteService, AutocompleteComponentItems, AutocompleteComponentItemsResolver, AutocompleteDisplayMemberResolver } from './autocomplete.service';
import { TextHelper } from '../../helpers/text.helper';
import { PopupComponent } from '../popup/popup.component';
import { ScrollTopDirective } from '../../directives/scroll-top.directive';

import * as template from "./autocomplete.component.html";
import * as styles from "./autocomplete.component.scss";

@Component({
    selector: 'autocomplete',
    styles: [styles],
    template: template,
    providers: [
        AutocompleteService
    ]
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
    private _activeItemIndex: number = -1;
    private _autofocus = false;
    private _autoselect = true;
    private _blurTimeout: number;
    private _buffer = 100;
    private _displayMember: string | AutocompleteDisplayMemberResolver;
    private _dropDownCount = 8;
    private _enabled = true;
    private _hostElement: ElementRef;
    private _hostFocused = false;
    private _initialized = false;
    private _isLoading = false;
    private _isLoadingSubscription: Subscription;
    private _items: AutocompleteComponentItems | AutocompleteComponentItemsResolver;
    private _minLength = 0;
    private _params: { [name: string]: any } = {};
    private _placeholder: string;
    private _popupItems: any[] = [];
    private _popupItemsSubscription: Subscription;
    private _popupItemsObservableSubscription: Subscription;
    private _renderer: Renderer;
    private _selectedItem: any;
    private _service: AutocompleteService;
    private _text: string = undefined;

    constructor(hostElement: ElementRef, renderer: Renderer, service: AutocompleteService) {
        this.onHostBlur = this.onHostBlur.bind(this);
        this.onHostFocus = this.onHostFocus.bind(this);

        this._hostElement = hostElement;
        this._hostElement.nativeElement.addEventListener("focus", this.onHostFocus, true);
        this._hostElement.nativeElement.addEventListener("blur", this.onHostBlur, true);
        this._renderer = renderer;
        this._service = service;

        this.isLoadingChanged = this.isLoadingChanged.bind(this);
        this.itemsObservableChanged = this.itemsObservableChanged.bind(this);
        this.itemsChanged = this.itemsChanged.bind(this);

        this._service = service;

        this._isLoadingSubscription = this._service.isLoading.subscribe(this.isLoadingChanged);
        this._popupItemsObservableSubscription = this._service.searchResultObservable.subscribe(this.itemsObservableChanged);
    }

    @ContentChild(TemplateRef)
    private itemTemplate: TemplateRef<any>;

    @ViewChild(PopupComponent)
    private popup: PopupComponent;

    @ViewChild('inputElement')
    private inputElement: ElementRef;

    @ViewChild(ScrollTopDirective)
    private popupScroll: ScrollTopDirective;

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

    public get autoselect(): boolean {
        return this._autoselect;
    }

    @Input()
    public set autoselect(autoselect: boolean) {
        if (this._autoselect == autoselect) {
            return;
        }

        this._autoselect = autoselect;

        if (autoselect) {
            this.autoselectItem();
        }
    }

    public get buffer(): number {
        return this._buffer;
    }

    @Input()
    public set buffer(buffer: number) {
        if (this._buffer == buffer) {
            return;
        }

        this._buffer = buffer;
        this._service.setBuffer(buffer);
    }

    public get displayMember(): string | AutocompleteDisplayMemberResolver {
        return this._displayMember;
    }

    @Input()
    public set displayMember(displayMember: string | AutocompleteDisplayMemberResolver) {
        if (this._displayMember == displayMember) {
            return;
        }

        this._displayMember = displayMember;
        this._service.setDisplayMember(displayMember);

        if (this._selectedItem != null) {
            this.text = this.getDisplayText(this._selectedItem);
        }
    }

    public get dropDownCount(): number {
        return this._dropDownCount;
    }

    @Input()
    public set dropDownCount(dropDownCount: number) {
        if (this._dropDownCount == dropDownCount) {
            return;
        }

        this._dropDownCount = dropDownCount;
        this._service.setLimit(dropDownCount);
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

    public get items(): AutocompleteComponentItems | AutocompleteComponentItemsResolver {
        return this._items;
    }

    @Input()
    public set items(items: AutocompleteComponentItems | AutocompleteComponentItemsResolver) {
        if (this._items == items) {
            return;
        }

        this._items = items;
        this._service.setItems(items);
    }

    public get minLength(): number {
        return this._minLength;
    }

    @Input()
    public set minLength(minLength: number) {
        if (this._minLength == minLength) {
            return;
        }

        this._minLength = minLength;
        this._service.setMinLength(minLength);
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

        this._selectedItem = selectedItem;
        this.selectedItemChange.emit(selectedItem);

        if (selectedItem != undefined) {
            this.text = this.getDisplayText(selectedItem);
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

        this._text = text;
        this.textChange.emit(text);

        if (this._selectedItem != undefined && this.getDisplayText(this._selectedItem) != text) {
            this._selectedItem = undefined;
        }

        this._service.setText(text);

        if (this._autoselect) {
            this.autoselectItem();
        }
    }

    @Output()
    public textChange = new EventEmitter<string>();

    public get disabled(): boolean {
        return !this._enabled;
    }

    private get popupVisible(): boolean {
        if ((this._text || '').length >= (this._minLength || 0)) {
            return this._enabled && this._hostFocused && this._selectedItem == null && this._popupItems.length > 0;
        }

        return false;
    }

    @HostBinding("attr.tabindex")
    public hostTabIndex = -1;

    private onHostFocus(): void {
        if (this._blurTimeout != undefined) {
            clearTimeout(this._blurTimeout);
            this._blurTimeout = undefined;
        }

        this._hostFocused = true;
    }

    private onHostBlur(): void {
        this._blurTimeout = setTimeout(() => {
            this._hostFocused = false;
        }, 10) as any;
    }

    public ngOnInit(): void {
        this._initialized = true;

        delete this._params;
    }

    public ngAfterViewInit(): void {
        if (this._autofocus) {
            setTimeout(() => {
                this._renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus');
            }, 10);
        }

        this.popup.target = this._hostElement;
    }

    public ngOnDestroy(): void {
        this._hostElement.nativeElement.removeEventListener("focus", this.onHostFocus, true);
        this._hostElement.nativeElement.removeEventListener("blur", this.onHostBlur, true);

        [this._isLoadingSubscription, this._popupItemsObservableSubscription, this._popupItemsSubscription].forEach((subscription) => {
            if (subscription != null) {
                subscription.unsubscribe();
            }
        });
    }

    private autoselectItem(): boolean {
        if (this._selectedItem == null) {
            if (this._popupItems.length == 1 && this.compareText(this.getDisplayText(this._popupItems[0]), this._text)) {
                this.selectedItem = this._popupItems[0];
                return true;
            }
        }

        return false;
    }

    private compareText(t1: string, t2: string): boolean {
        return (t1 || "").toLowerCase() == (t2 || "").toLowerCase();
    }

    private itemsObservableChanged(itemsObservable: Observable<any[]>): void {
        if (this._popupItemsSubscription != null) {
            this._popupItemsSubscription.unsubscribe();
            this._popupItemsSubscription = null;
        }

        if (itemsObservable != null) {
            this._popupItemsSubscription = itemsObservable.subscribe(this.itemsChanged);
        }
    }

    private itemsChanged(items: any[]): void {
        this._popupItems = items;
        this._activeItemIndex = -1;

        if (this._autoselect) {
            this.autoselectItem();
        }
    }

    private isLoadingChanged(isLoading: boolean): void {
        this._isLoading = isLoading;
    }

    private setActiveItemIndex(index: number): void {
        this._activeItemIndex = index;
    }

    private itemClick(item: any): void {
        this.popup.visible = false;
        this.selectedItem = item;
        this._renderer.invokeElementMethod(this.inputElement.nativeElement, 'focus');
    }

    private getDisplayText(item: any): string {
        if (item == undefined) {
            return '';
        }

        if (this._displayMember == undefined) {
            return item.toString();
        }

        var text = typeof this._displayMember == 'string' ? item[this._displayMember] : this._displayMember(item);

        if (text != undefined) {
            text = text.toString();
        } else {
            text = '';
        }

        return text;
    }

    private getHighlightedItemText(item: any): string {
        var displayText = this.getDisplayText(item);

        if (TextHelper.isNullOrWhitespace(this._text)) {
            return displayText;
        }

        return TextHelper.highlight(displayText, this._text);
    }

    private getPlaceholderText(): string {
        if (this.enabled) {
            return this.placeholder;
        }

        return "";
    }

    private onKeyDown(ev: KeyboardEvent): boolean {
        switch (ev.keyCode) {
            case 13: // ENTER;
                if (this.popupVisible && this._activeItemIndex != -1 && this._activeItemIndex < this._popupItems.length) {
                    this.selectedItem = this._popupItems[this._activeItemIndex];
                    this.popup.visible = false;
                }
                return false;

            case 38: // ARROW UP;
                this.activateAdjacent(-1);
                return false;

            case 40: // ARROW DOWN;
                this.activateAdjacent(1);
                return false;

            default:
                break;
        }

        return true;
    }

    private activateAdjacent(delta: number): void {
        if (this._popupItems == undefined || this._popupItems.length == 0) {
            this._activeItemIndex = -1;
            return;
        }

        this._activeItemIndex += delta;

        if (this._activeItemIndex < 0) {
            this._activeItemIndex = this._popupItems.length - 1;
        }

        if (this._activeItemIndex > this._popupItems.length - 1) {
            this._activeItemIndex = 0;
        }

        this.popupScroll.scrollToElementIndex(this._activeItemIndex);
    }
}