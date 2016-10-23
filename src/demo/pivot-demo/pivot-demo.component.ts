import { Component, QueryList, ViewChild, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';

import { PivotComponent } from '../../components/pivot/pivot.component';
import { Data } from '../../test-data';

@Component({
    selector: 'pivot-demo',
    styleUrls: ['./pivot-demo.component.scss'],
    templateUrl: './pivot-demo.component.html'
})
export class PivotDemoComponent implements AfterViewInit {
    @ViewChild(PivotComponent)
    public pivot: PivotComponent;

    @ViewChildren(PivotComponent)
    public pivots: QueryList<PivotComponent>;

    private statusList = ['For Rent', 'For Sale', 'Sold'];
    private status: string;

    private groupList = [
        { name: 'New', count: 15 },
        { name: 'Approved', count: 2 },
        { name: 'In Progress', count: 12 },
        { name: 'Done', count: 259 }
    ];
    private group: any;

    constructor() {
    }

    public ngAfterViewInit() {
        this.pivots.forEach((pivot) => {
            pivot.selectedIndex = 0;
        });
    }
}