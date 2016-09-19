import { Component, ViewChild, ElementRef } from '@angular/core';

import { MemoEditComponent } from '../../components/memo-edit/memo-edit.component';

import * as template from "./memo-edit-demo.component.html";
import * as styles from "./memo-edit-demo.component.scss";

@Component({
    selector: 'memo-edit-demo',
    template: template,
    styles: [styles]
})
export class MemoEditDemoComponent {
    @ViewChild(MemoEditComponent)
    public memoEdit: MemoEditComponent;

    constructor() {
    }
}