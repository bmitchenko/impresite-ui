import { BehaviorSubject } from "rxjs/BehaviorSubject";
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";
import { Subscription } from "rxjs/Subscription";

import { DataSourceChangeArguments } from "./data-source-change-arguments";
import { IPagedList } from "./paged-list";
import { SortColumn } from "./sort-column";

export interface IDataSource<TItem> {
    change?: Observable<DataSourceChangeArguments<TItem>>;
    getItems(sort?: SortColumn[], offset?: number, limit?: number): Promise<IPagedList<TItem>>;
}