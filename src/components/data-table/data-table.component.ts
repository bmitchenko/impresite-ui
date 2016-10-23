import { Component, Directive, EventEmitter } from '@angular/core';
import { TemplateRef, ViewContainerRef, ElementRef } from '@angular/core';
import { Input, Output, ContentChild, ContentChildren,  ViewChild, QueryList, HostListener } from '@angular/core';
import { AfterViewInit, OnDestroy } from '@angular/core';
import '../../rxjs-operators';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { IDataSource } from '../../data/data-source';
import { DataColumnComponent } from "./data-column.component";
import { DataTableService } from "./data-table.service";
import { SortColumn } from "../../data/sort-column";
import { IPagedList } from "../../data/paged-list";
import { DataSourceChangeArguments } from "../../data/data-source-change-arguments";
import { DataSourceChangeType } from "../../data/data-source-change-type";

@Directive({
    selector: '[data-status-text]',
})
export class DataStatusTextDirective {
    constructor(public templateRef: TemplateRef<any>, public viewContainerRef: ViewContainerRef) {
    }
}

@Component({
    selector: 'data-table',
    styleUrls: ['./data-table.component.scss'],
    templateUrl: './data-table.component.html',
    providers: [
        DataTableService
    ]
})
export class DataTableComponent implements AfterViewInit, OnDestroy {
    private _buffer: number = 100;
    private _footer: boolean = false;
    private _header: boolean = true;
    private _data: IDataSource<any>;
    private _dataScrollTop = 0;
    private _dataSubscription: Subscription | null;
    private _page: number = 1;
    private _pageCount = 1;
    private _pageSize: number;
    private _rows: any[];
    private _rowsObservableSubscription: Subscription;
    private _rowsSubscription: Subscription | null;
    private _scrollPaddingRight = 0;
    private _selectedRow: any;
    private _service: DataTableService;

    @ContentChildren(DataColumnComponent)
    private columns: QueryList<DataColumnComponent>;

    @ContentChild(DataStatusTextDirective)
    private statusText: DataStatusTextDirective;

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

    public get data(): IDataSource<any> {
        return this._data;
    }

    @Input()
    public set data(data: IDataSource<any>) {
        if (this._data == data) {
            return;
        }

        if (this._dataSubscription != null) {
            this._dataSubscription.unsubscribe();
            this._dataSubscription = null;
        }

        this._data = data;

        if (this._data.change != null) {
            this._dataSubscription = this._data.change.subscribe(this.dataChangeSubscriptionHandler);
        }

        this._service.setData(this._data);
    }

    public get footer(): boolean {
        return this._footer;
    }

    @Input()
    public set footer(footer: boolean) {
        this._footer = footer;
    }

    public get header(): boolean {
        return this._header;
    }

    @Input()
    public set header(header: boolean) {
        this._header = header;
    }

    public get page(): number {
        return this._page;
    }

    @Input()
    public set page(page: number) {
        if (this._page == page) {
            return;
        }

        this._page = page;
        this._service.setPage(page);
        this._dataScrollTop = 0;
    }

    @Output()
    protected pageChange = new EventEmitter<number>();

    public get pageSize(): number {
        return this._pageSize;
    }

    @Input()
    public set pageSize(pageSize: number) {
        if (this._pageSize == pageSize) {
            return;
        }

        this._pageSize = pageSize;
        this._service.setPageSize(pageSize);
    }

    public get selectedRow(): any {
        return this._selectedRow;
    }

    @Input()
    public set selectedRow(selectedRow: any) {
        if (this._selectedRow == selectedRow) {
            return;
        }

        this._selectedRow = selectedRow;
    }

    @Output()
    protected selectedRowChange = new EventEmitter<any>();

    private get isFirstPage(): boolean {
        return this._page == 1;
    }

    private get isLastPage(): boolean {
        return this._page == this._pageCount;
    }

    @ViewChild("dataElem")
    private dateElem: ElementRef;

    constructor(service: DataTableService) {
        this.dataChangeSubscriptionHandler = this.dataChangeSubscriptionHandler.bind(this);
        this.rowsObservableSubscriptionHandler = this.rowsObservableSubscriptionHandler.bind(this);
        this.rowsSubscriptionHandler = this.rowsSubscriptionHandler.bind(this);

        this._service = service;
        this._rowsObservableSubscription = this._service.rowsObservable.subscribe(this.rowsObservableSubscriptionHandler);
    }

    @HostListener('window:resize', ['$event'])
    private onResize() {
        this.updateHeaderPaddingRight();
    }

    public ngDoCheck(): void {
        this.updateHeaderPaddingRight();
    }

    public ngAfterViewInit(): void {
        this.updateHeaderPaddingRight();
    }

    public ngOnDestroy(): void {
        [this._dataSubscription, this._rowsSubscription, this._rowsObservableSubscription].forEach((subscription) => {
            if (subscription != null) {
                subscription.unsubscribe();
            }
        });
    }

    private updateHeaderPaddingRight(): void {
        var elem = this.dateElem.nativeElement as HTMLElement;

        if (elem.offsetHeight >= elem.scrollHeight + 2) {
            this._scrollPaddingRight = 0;
        } else {
            if (navigator.userAgent.indexOf("Edge") > 0) {
                this._scrollPaddingRight = 12;
            } else {
                this._scrollPaddingRight = 17;
            }
        }
    }

    private dataChangeSubscriptionHandler(changes: DataSourceChangeArguments<any>): void {
        switch (changes.changeType) {

            case DataSourceChangeType.Add:
                changes.added!.forEach((row) => {
                    this._rows.push(row);
                });
                break;

            case DataSourceChangeType.Remove:
                changes.removed!.forEach((removedRow) => {
                    var removedIndex = this._rows.indexOf(removedRow);

                    if (removedIndex != -1) {
                        this._rows.splice(removedIndex, 1);

                        if (this._selectedRow = removedRow) {
                            this.deselectRow();
                        }
                    }
                });
                break;

            case DataSourceChangeType.Replace:
                changes.removed!.forEach((removedRow, i) => {
                    var removedIndex = this._rows.indexOf(removedRow);

                    if (removedIndex != -1) {
                        this._rows.splice(removedIndex, removedRow, changes.added![i]);

                        if (this._selectedRow = removedRow) {
                            this.deselectRow();
                        }
                    }
                });
                break;

            default:
                this._service.update();
                break;
        }
    }

    private rowsObservableSubscriptionHandler(rowsObservable: Observable<IPagedList<any>>) {
        if (this._rowsSubscription != null) {
            this._rowsSubscription.unsubscribe();
            this._rowsSubscription = null;
        }

        if (rowsObservable != null) {
            this._rowsSubscription = rowsObservable.subscribe(this.rowsSubscriptionHandler);
        }
    }

    private rowsSubscriptionHandler(rows: IPagedList<any>) {
        this._rows = rows.items;
        this._pageCount = Math.ceil(rows.totalCount / this.pageSize);

        if (this._selectedRow != null) {
            if (this._rows == null || this._rows.indexOf(this._selectedRow) == -1) {
                this.deselectRow();
            }
        }
    }

    protected previousPage(): void {
        this.deselectRow();

        if (this.page > 1) {
            this.page--;
        }
    }

    protected nextPage(): void {
        this.deselectRow();

        if (this.page < this._pageCount) {
            this.page++;
        }
    }

    protected headerClick(column: DataColumnComponent, event: MouseEvent): void {
        if (column.sort) {
            this.deselectRow();
            this.page = 1;
            this._dataScrollTop = 0
            this._service.toggleColumnSort(column.name, event.ctrlKey);
        }
    }

    protected rowClick(row: any): void {
        this.selectedRow = row;
        this.selectedRowChange.emit(row);
    }

    private deselectRow(): void {
        if (this._selectedRow != null) {
            this._selectedRow = null;
            this.selectedRowChange.emit(null);
        }
    }

    // TODO:
    // grid.scrollTo(row, scrollTop?)
    // grid.loaded(): Promise<Row[]>
}