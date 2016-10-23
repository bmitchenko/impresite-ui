import { Component, ViewChild, ElementRef } from '@angular/core';

import { ToggleButtonComponent } from '../../components/toggle-button/toggle-button.component';

@Component({
    selector: 'toggle-button-demo',
    styleUrls: ['./toggle-button-demo.component.scss'],
    templateUrl: './toggle-button-demo.component.html'
})
export class ToggleButtonDemoComponent {
    @ViewChild(ToggleButtonComponent)
    public toggleButton: ToggleButtonComponent;

    constructor() {
    }
}