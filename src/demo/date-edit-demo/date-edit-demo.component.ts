import { Component, ViewChild, ElementRef } from '@angular/core';

import { DateEditComponent } from '../../components/date-edit/date-edit.component';

@Component({
    selector: 'date-edit-demo',
    styleUrls: ['./date-edit-demo.component.scss'],
    templateUrl: './date-edit-demo.component.html'
})
export class DateEditDemoComponent {
    @ViewChild(DateEditComponent)
    public dateEdit: DateEditComponent;

    constructor() {
    }
}