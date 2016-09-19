import { Component, ViewChild, ElementRef } from '@angular/core';

import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';

import * as template from "./toggle-button-demo.component.html";
import * as styles from "./toggle-button-demo.component.scss";

@Component({
    selector: 'toggle-button-demo',
    template: template,
    styles: [styles]
})
export class ToggleButtonDemoComponent {
    @ViewChild(ToggleButtonComponent)
    public toggleButton: ToggleButtonComponent;

    constructor() {
    }
}