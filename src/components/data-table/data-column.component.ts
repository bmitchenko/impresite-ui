import { Component, ContentChild, Directive, EventEmitter, Input, Output, TemplateRef, ViewContainerRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DataTableService } from "./data-table.service";
import '../../rxjs-operators';
import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { SortColumn } from "../../data/sort-column";

@Directive({
    selector: '[header-cell]',
})
export class DataColumnHeaderCellDirective {
    constructor(public templateRef: TemplateRef<any>, public viewContainerRef: ViewContainerRef) {
    }
}

@Directive({
    selector: '[cell]',
})
export class DataColumnCellDirective {
    constructor(public templateRef: TemplateRef<any>, public viewContainerRef: ViewContainerRef) {
    }
}

@Directive({
    selector: '[footer-cell]',
})
export class DataColumnFooterCellDirective {
    constructor(public templateRef: TemplateRef<any>, public viewContainerRef: ViewContainerRef) {
    }
}

@Component({
    selector: 'data-column',
    template: '',
})
export class DataColumnComponent implements AfterViewInit, OnDestroy {
    private _isViewInitialized = false;
    private _name: string;
    private _serviceSortColumnsSubscription: Subscription;
    private _sort: ColumnSortDirection;
    private _sortOrder: number = -1;
    private _visible = true;

    @ContentChild(DataColumnHeaderCellDirective)
    public headerData: DataColumnHeaderCellDirective;

    @ContentChild(DataColumnCellDirective)
    public cellData: DataColumnCellDirective;

    @ContentChild(DataColumnFooterCellDirective)
    public footerData: DataColumnFooterCellDirective;

    @Input()
    public class: string;

    @Input()
    public footer: string;

    @Input()
    public header: string;

    @Input()
    public maxWidth: string;

    @Input()
    public minWidth: string;

    public get name(): string {
        return this._name;
    }

    @Input()
    public set name(name: string) {
        if (this._name == name) {
            return;
        }

        var oldName = this._name;
        this._name = name;

        if (this._isViewInitialized) {
            this.updateService(oldName);
        }
    }

    public get sort(): ColumnSortDirection {
        return this._sort;
    }

    @Input()
    public set sort(sort: ColumnSortDirection) {
        if (this._sort == sort) {
            return;
        }

        this._sort = sort;

        if (this._isViewInitialized) {
            this.updateService();
        }
    }

    @Output()
    public sortChange: EventEmitter<string> = new EventEmitter<string>();

    public get sortOrder(): number {
        return this._sortOrder;
    }

    @Input()
    public set sortOrder(sortOrder: number) {
        if (this._sortOrder == sortOrder) {
            return;
        }

        this._sortOrder = sortOrder;

        if (this._isViewInitialized) {
            this.updateService();
        }
    }

    @Output()
    public sortOrderChange: EventEmitter<number> = new EventEmitter<number>();

    public get visible(): boolean {
        return this._visible;
    }

    @Input()
    public set visible(visible: boolean) {
        if (this._visible == visible) {
            return;
        }

        this._visible = visible;

        if (this._isViewInitialized) {
            this.updateService();
        }
    }

    constructor(private service: DataTableService) {
        this.onSortColumnsChanged = this.onSortColumnsChanged.bind(this);
        this._serviceSortColumnsSubscription = service.sortColumns.subscribe(this.onSortColumnsChanged);
    }

    public ngAfterViewInit(): void {
        if (this._name && this._sort != null && this._sort != "none") {
            this.service.setColumnSort(this.name, this._sort, this._sortOrder);
        }

        this._isViewInitialized = true;
    }

    public ngOnDestroy(): void {
        this._serviceSortColumnsSubscription.unsubscribe();
    }

    private onSortColumnsChanged(sortColumns: SortColumn[]): void {
        if (this._sort == null) {
            return;
        }

        if (sortColumns == null) {
            sortColumns = [];
        }

        var column = sortColumns.find(x => x.name == this.name);

        var sort: ColumnSortDirection = column == null ? "none" : (column.descending ? "desc" : "asc");
        var sortOrder = column == null ? -1 : sortColumns.indexOf(column);

        if (this._sort != sort) {
            this._sort = sort;
            this.sortChange.emit("none");
        }

        if (this._sortOrder != sortOrder) {
            this._sortOrder = sortOrder;
            this.sortOrderChange.emit(sortOrder);
        }
    }

    private updateService(oldName?: string): void {
        if (oldName) {
            this.service.setColumnSort(oldName, "none", -1);
        }

        if (this._visible && this.name) {
            this.service.setColumnSort(this.name, this.sort, this.sortOrder);
        }
        else {
            this.service.setColumnSort(this.name, "none", -1);
        }
    }
}

type ColumnSortDirection = "asc" | "desc" | "none";