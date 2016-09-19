import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer, QueryList } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { ToggleButtonOptionComponent } from './toggle-button-option.component';

import * as template from "./toggle-button.component.html";
import * as styles from "./toggle-button.component.scss";

@Component({
    selector: 'toggle-button',
    styles: [styles],
    template: template
})
export class ToggleButtonComponent implements OnInit, AfterViewInit {
    private _initialized = false;
    private _params = new Map<string, any>();
    private _renderer: Renderer;
    private _selectedIndex = -1;
    private _selectedItem: ToggleButtonOptionComponent;
    private _subscriptions: Subscription[] = [];
    private _value: any;

    constructor(renderer: Renderer) {
        this._renderer = renderer;
    }

    @HostBinding('class.toggle-button-equal-width')
    public equalWidth = false;

    public get selectedIndex(): number {
        return this._selectedIndex;
    }

    @Input()
    public set selectedIndex(selectedIndex: number) {
        if (this._selectedIndex == selectedIndex) {
            return;
        }

        if (!this._initialized) {
            this._params.set('selectedIndex', selectedIndex);
            return;
        }

        if (selectedIndex == undefined || selectedIndex <= -1 || selectedIndex >= this.items.length) {
            this.selectItem(undefined);
        } else {
            this.selectItem(this.items.toArray()[selectedIndex]);
        }
    }

    @Output()
    private selectedIndexChange = new EventEmitter<number>();

    public get value(): any {
        return this._value;
    }

    @Input()
    public set value(value: any) {
        if (this._value == value) {
            return;
        }

        if (!this._initialized) {
            this._params.set('value', value);
            return;
        }

        this.selectItem(this.items.filter(x => x.value === value)[0]);
    }

    @Output()
    private valueChange = new EventEmitter<any>();

    @ContentChild(TemplateRef)
    private itemTemplate: TemplateRef<any>;

    @ContentChildren(ToggleButtonOptionComponent)
    private items = new QueryList<ToggleButtonOptionComponent>();

    public ngOnInit(): void {
        this._initialized = true;

        if (this._params.has('value')) {
            this.value = this._params.get('value');
        } else {
            if (this._params.has('selectedIndex')) {
                this.selectedIndex = this._params.get('selectedIndex');
            }
        }

        delete this._params;
    }

    public ngAfterViewInit(): void {
        this.addListeners();
    }

    public ngOnDestroy(): void {
        this.removeListeners();
    }

    private addListeners(): void {
        this._subscriptions.push(this.items.changes.subscribe(() => {
            this.removeListeners();
            this.addListeners();
            this.invalidateSelection();
        }));

        this.items.forEach((item) => {
            this._subscriptions.push(item.itemClick.subscribe(() => {
                this.selectItem(item);
            }));

            this._subscriptions.push(item.valueChange.subscribe((value: any) => {
                this.onItemValueChange(item, value);
            }));
        });
    }

    private removeListeners(): void {
        this._subscriptions.forEach((subscription) => {
            subscription.unsubscribe();
        });

        this._subscriptions.length = 0;
    }

    private invalidateSelection(): void {
        var items = this.items.toArray();

        if (this._selectedItem != undefined) {
            var index = items.indexOf(this._selectedItem);

            if (index == -1) {
                this.selectItem(undefined);
            } else {
                if (this._selectedIndex != index) {
                    this._selectedIndex = index;
                    this.selectedIndexChange.emit(index);
                }
            }
        }
    }

    private selectItem(selectedItem: ToggleButtonOptionComponent): void {
        var items = this.items.toArray();

        if (selectedItem != undefined && items.indexOf(selectedItem) == -1) {
            selectedItem = undefined;
        }

        var selectedIndex = selectedItem == undefined ? -1 : items.indexOf(selectedItem);
        var selectedIndexChanged = this._selectedIndex != selectedIndex;

        var value = selectedItem == undefined ? undefined : selectedItem.value;
        var valueChanged = this._value !== value;

        this._selectedIndex = selectedIndex;
        this._selectedItem = selectedItem;
        this._value = value;

        this.items.forEach((item) => {
            item.selected = item == selectedItem;
        });

        if (selectedIndexChanged) {
            this.selectedIndexChange.emit(selectedIndex);
        }

        if (valueChanged) {
            this.valueChange.emit(value);
        }
    }

    private onItemValueChange(item: ToggleButtonOptionComponent, value: any): void {
        if (this._selectedItem == item) {
            this._value = value;
            this.valueChange.emit(value);
        }
    }
}