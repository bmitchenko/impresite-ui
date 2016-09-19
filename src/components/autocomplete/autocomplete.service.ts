import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

export type AutocompleteComponentItems = any[] | Promise<any[]>;
export type AutocompleteComponentItemsResolver = { (searchText?: string, limit?: number): AutocompleteComponentItems };
export type AutocompleteDisplayMemberResolver = { (item: any): string };

@Injectable()
export class AutocompleteService {
    private _buffer = 100;
    private _displayMember: string | AutocompleteDisplayMemberResolver;
    private _items: AutocompleteComponentItems | AutocompleteComponentItemsResolver;
    private _limit: number = 8;
    private _minLength = 0;
    private _text: string;

    private _searchResult: Observable<any[]>;
    private _searchResultSource: Subject<ISearchParams>;

    private _searchResultObservable: Observable<Observable<any[]>>;
    private _searchResultObservableSource: BehaviorSubject<Observable<any[]>>;

    private _isLoading: Observable<boolean>;
    private _isLoadingSource: BehaviorSubject<boolean>;

    private _skipNextComparison = false;

    constructor() {
        this.compareQueryParams = this.compareQueryParams.bind(this);

        this._searchResultSource = new Subject<ISearchParams>();
        this._searchResult = this.createSearchResultsObservable();

        this._searchResultObservableSource = new BehaviorSubject<Observable<any[]>>(this._searchResult);
        this._searchResultObservable = this._searchResultObservableSource.asObservable();

        this._isLoadingSource = new BehaviorSubject<boolean>(false);
        this._isLoading = this._isLoadingSource.asObservable();
    }

    public get isLoading(): Observable<boolean> {
        return this._isLoading;
    }

    public get searchResultObservable(): Observable<Observable<any[]>> {
        return this._searchResultObservable;
    }

    public setBuffer(buffer: number): void {
        if (this._buffer == buffer) {
            return;
        }

        this._buffer = buffer;
        this._searchResultSource.complete();
        this._searchResultSource = new Subject<ISearchParams>();
        this._searchResult = this.createSearchResultsObservable();
        this._searchResultObservableSource.next(this._searchResult);
    }

    public setDisplayMember(displayMember: string | AutocompleteDisplayMemberResolver): void {
        if (this._displayMember == displayMember) {
            return;
        }

        this._displayMember = displayMember;
        this.search();
    }

    public setItems(items: AutocompleteComponentItems | AutocompleteComponentItemsResolver): void {
        if (this._items == items) {
            return;
        }

        this._items = items;
        this.search();
    }

    public setLimit(limit: number): void {
        if (this._limit == limit) {
            return;
        }

        this._limit = limit;
        this.search();
    }

    public setMinLength(minLength: number): void {
        if (this._minLength == minLength) {
            return;
        }

        this._minLength = minLength;
        this.search();
    }

    public setText(text?: string): void {
        if (this._text == text) {
            return;
        }

        this._text = text;
        this.search();
    }

    private search(): void {
        this._searchResultSource.next({
            displayMember: this._displayMember,
            items: this._items,
            limit: this._limit,
            minLength: this._minLength,
            text: this._text
        });
    }

    public update(): void {
        this._skipNextComparison = true;
        this.search();
    }

    private createSearchResultsObservable(): Observable<any[]> {
        return this._searchResultSource
            .asObservable()
            .distinctUntilChanged()
            .debounceTime(this._buffer)
            .do(x => this._isLoadingSource.next(true))
            .switchMap(x => this.queryItems(x))
            .do(x => this._isLoadingSource.next(false));
    }

    private compareQueryParams(p1: ISearchParams, p2: ISearchParams): boolean {
        if (this._skipNextComparison) {
            this._skipNextComparison = false;
            return false;
        }

        return p1.displayMember == p2.displayMember
            && p1.items == p2.items
            && p1.limit == p2.limit
            && p1.minLength == p2.minLength
            && (p1.text || "").toLowerCase() == (p2.text || "").toLowerCase();
    }

    private queryItems(searchParams: ISearchParams): Promise<any[]> {
        if (searchParams.items == undefined) {
            return Promise.resolve([]);
        }

        if (searchParams.minLength != undefined) {
            if ((searchParams.text || "").trim().length < searchParams.minLength) {
                return Promise.resolve([]);
            }
        }

        if (searchParams.items instanceof Array) {
            return Promise.resolve(this.filterItems(searchParams.items, searchParams.text, searchParams.displayMember, searchParams.limit));
        }

        if (searchParams.items instanceof Promise) {
            return searchParams.items.then((items) => {
                return Promise.resolve(this.filterItems(items, searchParams.text, searchParams.displayMember, searchParams.limit));
            });
        }

        var result = searchParams.items(searchParams.text, searchParams.limit);

        if (result instanceof Promise) {
            return result;
        }

        return Promise.resolve(result);
    }

    private filterItems(items: any[], text?: string, displayMember?: string | AutocompleteDisplayMemberResolver, limit?: number): any[] {
        if (limit != undefined && limit <= 0) {
            return [];
        }

        if (text != undefined && text.trim().length > 0) {
            var words = this.getWordsLowerCase(text);

            if (limit == undefined) {
                return items.filter(x => this.itemContainsWords(x, words, displayMember));
            }

            var filteredItems: any[] = [];

            for (var i = 0; i < items.length; i++) {
                if (this.itemContainsWords(items[i], words, displayMember)) {
                    filteredItems.push(items[i]);

                    if (filteredItems.length == limit) {
                        break;
                    }
                }
            }

            return filteredItems;
        }

        if (limit == undefined) {
            return items.slice(0);
        }

        return items.slice(0, limit);
    }

    private getWordsLowerCase(text?: string): string[] {
        if (text == undefined || text.trim().length == 0) {
            return [];
        }

        return text
            .split(" ")
            .map(x => x.trim().toLowerCase())
            .filter(x => x.length > 0);
    }

    private itemContainsWords(item?: any, words?: string[], displayMember?: string | AutocompleteDisplayMemberResolver): boolean {
        if (words == undefined || words.length == 0) {
            return true;
        }

        if (item == undefined) {
            return false;
        }

        var text: string = undefined;

        if (displayMember == undefined) {
            text = item.toString();
        } else {
            if (typeof displayMember == "string") {
                text = item[displayMember];
            } else {
                text = displayMember(item);
            }
        }

        if (text == undefined) {
            text = "";
        } else {
            text = text.toString();
        }

        text = text.toLowerCase();

        return words.every(x => text.indexOf(x) != -1);
    }
}

interface ISearchParams {
    displayMember?: string | AutocompleteDisplayMemberResolver;
    items?: AutocompleteComponentItems | AutocompleteComponentItemsResolver;
    limit?: number;
    minLength: number;
    text?: string;
}