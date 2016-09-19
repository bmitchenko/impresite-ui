import { Component, ViewChild, ElementRef } from '@angular/core';

import { TextBoxComponent } from '../../components/text-box/text-box.component';

import * as template from "./text-box-demo.component.html";
import * as styles from "./text-box-demo.component.scss";

@Component({
    selector: 'text-box-demo',
    template: template,
    styles: [styles]
})
export class TextBoxDemoComponent {
    @ViewChild(TextBoxComponent)
    public textBox: TextBoxComponent;

    constructor() {
    }
}