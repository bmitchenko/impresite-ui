import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { DataSourceChangeArguments } from "./data-source-change-arguments";
import { DataSourceChangeType } from "./data-source-change-type";
import { IDataSource } from "./data-source";
import { IPagedList } from "./paged-list";
import { SortColumn } from "./sort-column";

class ArrayItem<TItem> {
    item: TItem;
    hidden: boolean;
    originalIndex: number;
}

export class ArrayDataSource<TItem> implements IDataSource<TItem> {
    private _change: Subject<DataSourceChangeArguments<TItem>>;
    private _changeObservable: Observable<DataSourceChangeArguments<TItem>>;
    private _items: ArrayItem<TItem>[] = [];
    private _itemsSortFields: SortColumn[] | undefined;
    private _itemsTextFilter: string | undefined;
    private _textFilter: string | undefined;

    constructor(items?: TItem[]) {
        this._change = new Subject<DataSourceChangeArguments<TItem>>();
        this._changeObservable = this._change.asObservable();

        if (items != null) {
            this.internalSetItems(items);
        }
    }

    public get change(): Observable<DataSourceChangeArguments<TItem>> {
        return this._changeObservable;
    }

    public get textFilter() {
        return this._textFilter;
    }

    public set textFilter(textFilter: string | undefined) {
        if (this._textFilter == textFilter) {
            return;
        }

        if (textFilter != undefined && textFilter.trim().length == 0) {
            textFilter = undefined;
        }

        this._textFilter = textFilter;
    }

    public getItems(sort?: SortColumn[], offset?: number, limit?: number): Promise<IPagedList<TItem>> {
        if (offset == null) {
            offset = 0;
        }

        this.applySort(sort);
        this.applyTextFilter();

        var visibleItems = this._items
            .filter(x => !x.hidden)
            .map(x => x.item);

        if (limit == null) {
            limit = visibleItems.length;
        }

        var result: IPagedList<TItem> = {
            limit: limit,
            items: visibleItems.slice(offset, offset + limit),
            offset: offset,
            totalCount: visibleItems.length
        };

        return Promise.resolve(result);
    }

    public setItems(items: TItem[]): void {
        this.internalSetItems(items);
        this._change.next(new DataSourceChangeArguments<TItem>(DataSourceChangeType.Reset));
    }

    private internalSetItems(items: TItem[]): void {
        this._items.length = 0;
        this._itemsSortFields = undefined;
        this._itemsTextFilter = undefined;

        items.forEach((item, index) => {
            this._items.push({
                hidden: false,
                item: item,
                originalIndex: index
            });
        });
    }

    public add(item: TItem): void {
        if (this._items == undefined) {
            this._items = [];
        }

        var sortedItem: ArrayItem<TItem> = {
            hidden: false,
            item: item,
            originalIndex: this._items.length
        };

        if (this._itemsTextFilter != null) {
            sortedItem.hidden = !this.itemContainsText(item, this._itemsTextFilter);
        }

        var sortedIndex = this._items.length;

        if (this._itemsSortFields != null) {
            this._items.splice(this.getSortedIndex(this._items, item), 0, sortedItem);
        } else {
            this._items.push(sortedItem);
        }

        this._change.next(new DataSourceChangeArguments<TItem>(DataSourceChangeType.Add, [item]));
    }

    public replace(oldItem: TItem, newItem: TItem): void {
        if (this._items == null) {
            throw new Error("Item not found.");
        }

        var index = this._items.findIndex(x => x.item == oldItem);

        if (index == undefined || index == -1) {
            throw new Error("Item not found.");
        }

        var sortedItem = this._items[index];
        sortedItem.item = newItem;

        if (this._itemsTextFilter != null) {
            sortedItem.hidden = !this.itemContainsText(sortedItem.item, this._itemsTextFilter);
        } else {
            sortedItem.hidden = false;
        }

        if (this._itemsSortFields != null && this._itemsSortFields.length > 0) {
            this._items.splice(index, 1);
            var sortedIndex = this.getSortedIndex(this._items, sortedItem.item);
            this._items.splice(sortedIndex, 0, sortedItem);
        }

        this._change.next(new DataSourceChangeArguments(DataSourceChangeType.Replace, [newItem], [oldItem]));
    }

    public remove(item: TItem): void {
        if (this._items == null) {
            throw new Error("Item not found.");
        }

        var index = this._items.findIndex(x => x.item == item);

        if (index == undefined || index == -1) {
            throw new Error("Item not found.");
        }

        var originalIndex = this._items[index].originalIndex;

        this._items.splice(index, 1);

        for (var i = 0; i < this._items.length; i++) {
            if (this._items[i].originalIndex > originalIndex) {
                this._items[i].originalIndex--;
            }
        }

        this._change.next(new DataSourceChangeArguments(DataSourceChangeType.Remove, undefined, [item]));
    }

    public update(): void {
        this._change.next(new DataSourceChangeArguments<TItem>(DataSourceChangeType.Reset));
    }

    private applySort(sortFields: SortColumn[] | undefined): void {
        var isSorted = JSON.stringify(this._itemsSortFields || "") == JSON.stringify(sortFields || "");

        this._itemsSortFields = sortFields;

        if (isSorted) {
            return;
        }

        if (this._itemsSortFields == undefined || this._itemsSortFields.length == 0) {
            this._items.sort((item1, item2) => {
                return item1.originalIndex > item2.originalIndex ? 1 : -1;
            });
        } else {
            this._items.sort((item1, item2) => {
                return this.compareItems(item1.item, item2.item, this._itemsSortFields);
            });
        }
    }

    protected compareItems(item1: TItem, item2: TItem, sortFields: SortColumn[] | undefined): number {
        if (sortFields == undefined) {
            return 0;
        }
        
        for (var i = 0; i < sortFields.length; i++) {
            var sortResult = this.compareItemsByField(item1, item2, sortFields[i].name);

            if (sortResult != 0) {
                if (sortFields[i].descending) {
                    return -sortResult;
                }
                else {
                    return sortResult;
                }
            }
        }

        return 0;
    }

    protected compareItemsByField(item1: TItem, item2: TItem, fieldName: string): number {
        var a = item1[fieldName];
        var b = item2[fieldName];

        if (a == null && b == null) {
            return 0;
        }

        if (a == null || b == null) {
            return a == null ? -1 : 1;
        }

        if (typeof a == "string") {
            a = a.toLowerCase();
        }

        if (typeof b == "string") {
            b = b.toLowerCase();
        }

        if (a == b) {
            return 0;
        }

        return a > b ? 1 : -1;
    }

    private getSortedIndex(array: ArrayItem<TItem>[], item: TItem, fromInclusive?: number, toInclusive?: number): number {
        if (fromInclusive == null) {
            fromInclusive = 0;
        }

        if (toInclusive == null) {
            toInclusive = array.length - 1;
        }

        if (fromInclusive == toInclusive) {
            if (this.compareItems(item, array[fromInclusive].item, this._itemsSortFields) == 1) {
                return fromInclusive + 1;
            }

            return fromInclusive;
        }

        var middle = fromInclusive + Math.round((toInclusive - fromInclusive) / 2);
        var compareResult = this.compareItems(array[middle].item, item, this._itemsSortFields);

        if (compareResult >= 0) {
            return this.getSortedIndex(array, item, middle + 1, toInclusive);
        } else {
            return this.getSortedIndex(array, item, fromInclusive, middle - 1);
        }
    }

    private applyTextFilter(): void {
        var isFiltered = this._itemsTextFilter == this._textFilter;
        var isIncremental = this._textFilter != null && (this._itemsTextFilter == null || this._textFilter.startsWith(this._itemsTextFilter));

        this._itemsTextFilter = this._textFilter;

        if (isFiltered) {
            return;
        }

        if (this._textFilter == null) {
            this._items.forEach((item) => {
                item.hidden = false;
            });
        } else {
            var filterWords = this.getWords(this._textFilter);

            this._items.forEach((item) => {
                if (isIncremental && item.hidden) {
                    return;
                }

                item.hidden = this.itemContainsWords(item.item, filterWords);
            });
        }
    }

    private getWords(text: string): string[] {
        if (text == null) {
            return [];
        }

        return text
            .toLowerCase()
            .split(" ")
            .filter(w => w != null && w.trim().length > 0);
    }

    private itemContainsText(item: TItem, text: string): boolean {
        return this.itemContainsWords(item, this.getWords(text));
    }

    protected itemContainsWords(item: TItem, words: string[]): boolean {
        if (words == null || words.length == 0) {
            return true;
        }

        for (var memberName in item) {
            var value = item[memberName];

            if (typeof value == "function") {
                continue;
            }

            if (value == null) {
                return false;
            }

            if (typeof value != "string") {
                value = value.toString();
            }

            value = value.toLowerCase() as string;

            if (words.every(w => value.includes(w))) {
                return true;
            }
        }

        return false;
    }
}