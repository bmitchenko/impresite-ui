import { Component, ViewChild, ElementRef } from '@angular/core';

import { MemoEditComponent } from '../../components/memo-edit/memo-edit.component';

@Component({
    selector: 'memo-edit-demo',
    styleUrls: ['./memo-edit-demo.component.scss'],
    templateUrl: './memo-edit-demo.component.html'
})
export class MemoEditDemoComponent {
    @ViewChild(MemoEditComponent)
    public memoEdit: MemoEditComponent;

    constructor() {
    }
}