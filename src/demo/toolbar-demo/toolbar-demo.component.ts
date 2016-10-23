import { Component, ViewChild, ElementRef } from '@angular/core';

import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Data } from '../../test-data';

@Component({
    selector: 'toolbar-demo',
    styleUrls: ['./toolbar-demo.component.scss'],
    templateUrl: './toolbar-demo.component.html'
})
export class ToolbarDemoComponent {
    @ViewChild(ToolbarComponent)
    public toolbar: ToolbarComponent;

    constructor() {
    }
}