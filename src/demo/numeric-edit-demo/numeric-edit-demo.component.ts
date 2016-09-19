import { Component, ViewChild, ElementRef } from '@angular/core';

import { NumericEditComponent } from '../../components/numeric-edit/numeric-edit.component';

import * as template from "./numeric-edit-demo.component.html";
import * as styles from "./numeric-edit-demo.component.scss";

@Component({
    selector: 'numeric-edit-demo',
    template: template,
    styles: [styles]
})
export class NumericEditDemoComponent {
    @ViewChild(NumericEditComponent)
    public numericEdit: NumericEditComponent;

    constructor() {
    }
}