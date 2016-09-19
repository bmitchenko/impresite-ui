import { Component, ViewChild, ElementRef } from '@angular/core';

import { PivotComponent } from '../../components/pivot/pivot.component';
import { Data } from '../../test-data';

import * as template from "./pivot-demo.component.html";
import * as styles from "./pivot-demo.component.scss";

@Component({
    selector: 'pivot-demo',
    template: template,
    styles: [styles]
})
export class PivotDemoComponent {
    @ViewChild(PivotComponent)
    public pivot: PivotComponent;

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
}