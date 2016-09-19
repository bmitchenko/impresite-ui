import { Component, ViewChild, ElementRef } from '@angular/core';

import { DateEditComponent } from '../../components/date-edit/date-edit.component';

import * as template from "./date-edit-demo.component.html";
import * as styles from "./date-edit-demo.component.scss";

@Component({
    selector: 'date-edit-demo',
    template: template,
    styles: [styles]
})
export class DateEditDemoComponent {
    @ViewChild(DateEditComponent)
    public dateEdit: DateEditComponent;

    constructor() {
    }
}