import { Injectable } from "@angular/core";
import { Http, Response } from "@angular/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { IDataSource } from '../../data/data-source';
import { IPagedList } from '../../data/paged-list';
import { SortColumn } from "../../data/sort-column";

@Injectable()
export class DataTableService {
    private _buffer = 100;
    private _rows: Observable<IPagedList<any>>;
    private _rowsObservable: Observable<Observable<IPagedList<any>>>;
    private _rowsObservableSource: Subject<Observable<IPagedList<any>>>;
    private _isLoading: Observable<boolean>;
    private _isLoadingSource: BehaviorSubject<boolean>;
    private _searchParams: BehaviorSubject<ISearchParams>;
    private _skipNextComparison = false;
    private _sortColumns: Observable<SortColumn[]>;
    private _sortColumnsSource: Subject<SortColumn[]>;

    constructor() {
        this.compareQueryParams = this.compareQueryParams.bind(this);
        this.compareSort = this.compareSort.bind(this);

        this._isLoadingSource = new BehaviorSubject<boolean>(false);
        this._searchParams = new BehaviorSubject<ISearchParams>({});
        this._sortColumnsSource = new Subject<SortColumn[]>();


        this._rows = this.createRowsObservable();
        this._rowsObservableSource = new BehaviorSubject<Observable<IPagedList<any>>>(this._rows);
        this._rowsObservable = this._rowsObservableSource.asObservable();

        this._isLoading = this._isLoadingSource.asObservable();

        this._sortColumns = this._sortColumnsSource
            .asObservable()
            .distinctUntilChanged(this.compareSort);
    }

    public get isLoading(): Observable<boolean> {
        return this._isLoading;
    }

    public get rowsObservable(): Observable<Observable<IPagedList<any>>> {
        return this._rowsObservable;
    }

    public get sortColumns(): Observable<SortColumn[]> {
        return this._sortColumns;
    }

    public setBuffer(buffer: number) {
        if (this._buffer == buffer) {
            return;
        }

        this._searchParams.complete();
        this._rows = this.createRowsObservable();
        this._rowsObservableSource.next(this._rows);
    }

    public setData(data: IDataSource<any>) {
        if (this._searchParams.value.data == data) {
            return;
        }

        var params = this.cloneSearchParams();
        params.data = data;

        this._searchParams.next(params);
    }

    public setPage(page: number) {
        if (this._searchParams.value.page == page) {
            return;
        }

        var params = this.cloneSearchParams();
        params.page = page;

        this._searchParams.next(params);
    }

    public setPageSize(pageSize: number) {
        if (this._searchParams.value.pageSize == pageSize) {
            return;
        }

        var params = this.cloneSearchParams();
        params.pageSize = pageSize;

        this._searchParams.next(params);
    }

    public setColumnSort(name: string, direction: "asc" | "desc" | "none", order: number) {
        var params = this.cloneSearchParams();

        if (params.sort == null) {
            params.sort = [];
        }

        var column = params.sort.find(x => x.name == name);
        var columnIndex = column == null ? -1 : params.sort.indexOf(column);

        if (direction == "none") {
            if (column != null) {
                params.sort.splice(columnIndex, 1);
            }
        }
        else {
            if (column == null) {
                column = { descending: direction == "desc", name: name };
            }

            if (columnIndex != order) {
                if (columnIndex != -1) {
                    params.sort.splice(columnIndex, 1, column);
                }

                params.sort.splice(order, 0, column);
            }
        }

        this._sortColumnsSource.next(params.sort);
        this._searchParams.next(params);
    }

    public toggleColumnSort(name: string, multisort: boolean) {
        var params = this.cloneSearchParams();

        if (params.sort == null) {
            params.sort = [];
        }

        var column = params.sort.find(x => x.name == name);

        if (column != null) {
            column.descending = !column.descending;
        }

        if (multisort) {
            if (column == null) {
                params.sort.push({ descending: false, name: name });
            } else {
                if (!column.descending) {
                    params.sort.splice(params.sort.indexOf(column), 1);
                }
            }
        }
        else {
            if (column == null) {
                params.sort = [{ descending: false, name: name }];
            } else {
                params.sort = [column];
            }
        }

        this._sortColumnsSource.next(params.sort);
        this._searchParams.next(params);
    }

    public update(): void {
        this._skipNextComparison = true;
        this._searchParams.next(this._searchParams.value);
    }

    private cloneSearchParams(): ISearchParams {
        var value = this._searchParams.value;

        return {
            data: value.data,
            page: value.page,
            pageSize: value.pageSize,
            sort: value.sort == null ? null : JSON.parse(JSON.stringify(value.sort))
        };
    }

    private createRowsObservable(): Observable<IPagedList<any>> {
        var buffer = this._buffer;

        if (buffer == null || buffer < 10) {
            buffer = 10;
        }

        return this._searchParams
            .asObservable()
            .distinctUntilChanged()
            .debounceTime(buffer)
            .do(x => this._isLoadingSource.next(true))
            .switchMap(x => this.queryRows(x))
            .do(x => this._isLoadingSource.next(false));
    }

    private compareQueryParams(p1: ISearchParams, p2: ISearchParams): boolean {
        if (this._skipNextComparison) {
            this._skipNextComparison = false;
            return false;
        }

        return p1.data == p2.data
            && p1.page == p2.page
            && p1.pageSize == p2.pageSize
            && this.compareSort(p1.sort, p2.sort);
    }

    private compareSort(s1: SortColumn[] | undefined, s2: SortColumn[] | undefined): boolean {
        if ((s1 == undefined || s1.length == 0) && (s2 == undefined || s2.length == 0)) {
            return true;
        }

        return JSON.stringify(s1 || "") == JSON.stringify(s2 || "");
    }

    private queryRows(searchParams: ISearchParams): Promise<IPagedList<any>> {
        if (searchParams.data == null) {
            var emptyResult: IPagedList<any> = {
                limit: 0,
                items: [],
                offset: 0,
                totalCount: 0
            };

            return Promise.resolve(emptyResult);
        }

        if (searchParams.pageSize) {
            if (searchParams.page == null) {
                searchParams.page = 1;                
            } 

            var offset = (searchParams.page - 1) * searchParams.pageSize;
            var limit = searchParams.pageSize;

            return searchParams.data.getItems(searchParams.sort, offset, limit);
        }

        return searchParams.data.getItems(searchParams.sort);
    }
}

interface ISearchParams {
    data?: IDataSource<any>;
    page?: number;
    pageSize?: number;
    sort?: SortColumn[];
}