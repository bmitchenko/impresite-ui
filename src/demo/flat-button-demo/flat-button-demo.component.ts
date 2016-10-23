import { Component, ViewChild, ElementRef } from '@angular/core';

import { FlatButtonComponent } from '../../components/flat-button/flat-button.component';

@Component({
    selector: 'flat-button-demo',
    styleUrls: ['./flat-button-demo.component.scss'],
    templateUrl: './flat-button-demo.component.html'
})
export class FlatButtonDemoComponent {
    @ViewChild(FlatButtonComponent)
    public flatButton: FlatButtonComponent;

    constructor() {
    }
}