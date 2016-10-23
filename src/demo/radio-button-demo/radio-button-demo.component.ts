import { Component, ViewChild, ElementRef } from '@angular/core';

import { RadioButtonComponent } from '../../components/radio-button/radio-button.component';

@Component({
    selector: 'radio-button-demo',
    styleUrls: ['./radio-button-demo.component.scss'],
    templateUrl: './radio-button-demo.component.html'
})
export class RadioButtonDemoComponent {
    @ViewChild(RadioButtonComponent)
    public radioButton: RadioButtonComponent;

    public value: number = 1;

    public get valueText(): string {
        return this.value.toString();
    }
}