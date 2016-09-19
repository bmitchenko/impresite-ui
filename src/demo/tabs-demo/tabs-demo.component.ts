import { Component, ViewChild, ElementRef } from '@angular/core';

import { TabsComponent } from '../../components/tabs/tabs.component';

import * as template from "./tabs-demo.component.html";
import * as styles from "./tabs-demo.component.scss";

@Component({
    selector: 'tabs-demo',
    template: template,
    styles: [styles]
})
export class TabsDemoComponent {
    @ViewChild(TabsComponent)
    public tabs: TabsComponent;

    constructor() {
    }
}