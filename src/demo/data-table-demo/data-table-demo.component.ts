import { Component, ViewChild, ElementRef } from '@angular/core';

import { Data } from '../../test-data';
import { DataTableComponent } from '../../components/data-table/data-table.component';
import { ArrayDataSource } from '../../data/array-data-source';

@Component({
    selector: 'data-table-demo',
    styleUrls: ['./data-table-demo.component.scss'],
    templateUrl: './data-table-demo.component.html'
})
export class DataTableDemoComponent {
    public currentStatus = "Status text example.";

    @ViewChild(DataTableComponent)
    public dataTable: DataTableComponent;

    constructor() {
    }

    public ngAfterViewInit(): void {
        this.dataTable.data = new ArrayDataSource<any>(Data.Customers); 
        this.dataTable.pageSize = 50;
        this.dataTable.footer = true;
    }

    public deleteClick(row: any, ev: Event): boolean {
        alert("Row button click. ID: " + row.id);
        ev.preventDefault();
        return false;
    }
}