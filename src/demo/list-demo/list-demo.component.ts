import { Component, ViewChild, ElementRef } from '@angular/core';

import { ListComponent } from '../../components/list/list.component';
import { Data } from '../../test-data';

@Component({
    selector: 'list-demo',
    styleUrls: ['./list-demo.component.scss'],
    templateUrl: './list-demo.component.html'
})
export class ListDemoComponent {
    @ViewChild(ListComponent)
    public list: ListComponent;

    constructor() {
    }

    private ngAfterViewInit() {
        this.list.items = Data.Customers.slice(0, 30);
    }
}