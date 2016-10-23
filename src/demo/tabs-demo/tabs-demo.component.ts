import { Component, ViewChild, ElementRef } from '@angular/core';

import { TabsComponent } from '../../components/tabs/tabs.component';

@Component({
    selector: 'tabs-demo',
    styleUrls: ['./tabs-demo.component.scss'],
    templateUrl: './tabs-demo.component.html'
})
export class TabsDemoComponent {
    @ViewChild(TabsComponent)
    public tabs: TabsComponent;

    constructor() {
    }
}