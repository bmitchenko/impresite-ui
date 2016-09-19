import { Component, ViewChild, ElementRef } from '@angular/core';

import { RadioButtonComponent } from '../../components/radio-button/radio-button.component';

import * as template from "./radio-button-demo.component.html";
import * as styles from "./radio-button-demo.component.scss";

@Component({
    selector: 'radio-button-demo',
    template: template,
    styles: [styles]
})
export class RadioButtonDemoComponent {
    @ViewChild(RadioButtonComponent)
    public radioButton: RadioButtonComponent;

    public value: number = 1;

    public get valueText(): string {
        return this.value.toString();
    }
}