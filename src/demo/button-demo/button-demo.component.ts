import { Component, ViewChild, ElementRef } from '@angular/core';

import { ButtonComponent } from '../../components/button/button.component';

import * as template from "./button-demo.component.html";
import * as styles from "./button-demo.component.scss";

@Component({
    selector: 'button-demo',
    template: template,
    styles: [styles]
})
export class ButtonDemoComponent {
    @ViewChild(ButtonComponent)
    public button: ButtonComponent;

    constructor() {
    }
}