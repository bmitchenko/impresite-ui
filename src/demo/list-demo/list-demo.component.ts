import { Component, ViewChild, ElementRef } from '@angular/core';

import { ListComponent } from '../../components/list/list.component';
import { Data } from '../../test-data';

import * as template from "./list-demo.component.html";
import * as styles from "./list-demo.component.scss";

@Component({
    selector: 'list-demo',
    template: template,
    styles: [styles]
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