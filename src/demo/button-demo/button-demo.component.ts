import { Component, ViewChild, ElementRef } from '@angular/core';

import { ButtonComponent } from '../../components/button/button.component';

@Component({
    selector: 'button-demo',
    styleUrls: ['./button-demo.component.scss'],
    templateUrl: './button-demo.component.html'
})
export class ButtonDemoComponent {
    @ViewChild(ButtonComponent)
    public button: ButtonComponent;

    constructor() {
    }
}