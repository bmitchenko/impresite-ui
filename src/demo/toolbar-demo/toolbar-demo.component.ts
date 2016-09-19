import { Component, ViewChild, ElementRef } from '@angular/core';

import { ToolbarComponent } from '../../components/toolbar/toolbar.component';
import { Data } from '../../test-data';

import * as template from "./toolbar-demo.component.html";
import * as styles from "./toolbar-demo.component.scss";

@Component({
    selector: 'toolbar-demo',
    template: template,
    styles: [styles]
})
export class ToolbarDemoComponent {
    @ViewChild(ToolbarComponent)
    public toolbar: ToolbarComponent;

    constructor() {
    }
}