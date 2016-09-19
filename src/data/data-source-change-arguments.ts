import { DataSourceChangeType } from "./data-source-change-type";

export class DataSourceChangeArguments<TRow> {
    constructor(public changeType?: DataSourceChangeType, public added?: TRow[], public removed?: TRow[]) {
    }
}