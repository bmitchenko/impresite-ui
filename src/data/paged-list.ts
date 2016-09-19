export interface IPagedList<T> {
    items: T[];
    offset: number;
    limit: number;
    totalCount: number;
}