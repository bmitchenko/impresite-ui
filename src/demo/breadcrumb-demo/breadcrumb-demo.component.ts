import { Component, ViewChild, ElementRef } from '@angular/core';

import { BreadcrumbComponent, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb.component';
import { Data } from '../../test-data';

@Component({
    selector: 'breadcrumb-demo',
    styleUrls: ['./breadcrumb-demo.component.scss'],
    templateUrl: './breadcrumb-demo.component.html'
})
export class BreadcrumbDemoComponent {
    @ViewChild(BreadcrumbComponent)
    public breadcrumb: BreadcrumbComponent;

    public items: BreadcrumbItem[] = [];

    constructor() {
       this.items.push(new BreadcrumbItem("Russia", "#"));
       this.items.push(new BreadcrumbItem("Crimea", "#"));
       this.items.push(new BreadcrumbItem("Sevastopol", "/#", true));
    }
}