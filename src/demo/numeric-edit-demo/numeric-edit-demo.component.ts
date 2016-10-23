import { Component, ViewChild, ElementRef } from '@angular/core';

import { NumericEditComponent } from '../../components/numeric-edit/numeric-edit.component';

@Component({
    selector: 'numeric-edit-demo',
    styleUrls: ['./numeric-edit-demo.component.scss'],
    templateUrl: './numeric-edit-demo.component.html'
})
export class NumericEditDemoComponent {
    @ViewChild(NumericEditComponent)
    public numericEdit: NumericEditComponent;

    constructor() {
    }
}