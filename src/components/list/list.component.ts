import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import { ScrollTopDirective } from '../../directives/scroll-top.directive';

@Component({
    selector: 'list',
    styleUrls: ['./list.component.scss'],
    templateUrl: './list.component.html'
})
export class ListComponent implements OnInit {
    private _initialized = false;
    private _items: any[];
    private _params: { [name: string]: any } = {};
    private _selectedItem: any;

    public get items(): any[] {
        return this._items;
    }

    @Input()
    public set items(items: any[]) {
        if (this._items == items) {
            return;
        }

        this._items = items;

        if (this._selectedItem != undefined && (this._items == undefined || this._items.indexOf(this._selectedItem) == -1)) {
            this.selectedItem = undefined;
        }
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

        if (selectedItem == undefined || (this._items != undefined && this._items.indexOf(selectedItem) != -1)) {
            this._selectedItem = selectedItem;
            this.selectedItemChange.emit(selectedItem);
        }
    }

    @Output()
    private selectedItemChange = new EventEmitter<any>();

    @ViewChild(ScrollTopDirective)
    private containerScroll: ScrollTopDirective;

    @ContentChild(TemplateRef)
    private itemTemplate: TemplateRef<any>;

    public ngOnInit(): void {
        this._initialized = true;

        if (this._params['selectedItem'] != undefined) {
            this.selectedItem = this._params['selectedItem'];
        }

        delete this._params;
    }

    private itemClick(item: any): void {
        this.selectedItem = item;
    }

    private keyDown(event: KeyboardEvent): boolean {
        if (this._items == undefined || this._items.length == 0) {
            return;
        }

        if (event.keyCode != 38 && event.keyCode != 40) {
            return;
        }

        var index = -1;

        if (this._selectedItem != undefined) {
            index = this._items.indexOf(this._selectedItem);
        }

        // ARROW UP;
        if (event.keyCode == 38) {
            index--;

            if (index < 0) {
                index = 0;
            }
        }

        // ARROW DOWN;
        if (event.keyCode == 40) {
            index++;

            if (index > this._items.length - 1) {
                index = this._items.length - 1;
            }
        }

        this.selectedItem = this._items[index];
        this.scrollToSelectedItem();

        event.preventDefault();

        return false;
    }

    private scrollToSelectedItem(): void {
        if (this.selectedItem == undefined) {
            return;
        }

        this.containerScroll.scrollToElementIndex(this.items.indexOf(this.selectedItem));
    }
}