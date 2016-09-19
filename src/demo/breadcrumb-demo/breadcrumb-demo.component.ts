import { Component, ViewChild, ElementRef } from '@angular/core';

import { BreadcrumbComponent, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb.component';
import { Data } from '../../test-data';

import * as template from "./breadcrumb-demo.component.html";
import * as styles from "./breadcrumb-demo.component.scss";

@Component({
    selector: 'breadcrumb-demo',
    template: template,
    styles: [styles]
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