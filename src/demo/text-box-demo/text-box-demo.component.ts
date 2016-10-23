import { Component, ViewChild, ElementRef } from '@angular/core';

import { TextBoxComponent } from '../../components/text-box/text-box.component';

@Component({
    selector: 'text-box-demo',
    styleUrls: ['./text-box-demo.component.scss'],
    templateUrl: './text-box-demo.component.html',
})
export class TextBoxDemoComponent {
    @ViewChild(TextBoxComponent)
    public textBox: TextBoxComponent;

    constructor() {
    }
}