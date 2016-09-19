import { Component, ViewChild, ElementRef } from '@angular/core';

import { FlatButtonComponent } from '../../components/flat-button/flat-button.component';

import * as template from "./flat-button-demo.component.html";
import * as styles from "./flat-button-demo.component.scss";

@Component({
    selector: 'flat-button-demo',
    template: template,
    styles: [styles]
})
export class FlatButtonDemoComponent {
    @ViewChild(FlatButtonComponent)
    public flatButton: FlatButtonComponent;

    constructor() {
    }
}