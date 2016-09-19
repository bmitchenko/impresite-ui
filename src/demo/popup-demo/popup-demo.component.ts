import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { PopupComponent } from '../../components/popup/popup.component';

import * as template from "./popup-demo.component.html";
import * as styles from "./popup-demo.component.scss";

@Component({
    selector: 'popup-demo',
    template: template,
    styles: [styles]
})
export class PopupDemoComponent {
    private popupPositions: string[] = [
        "bottom",
        "bottom left",
        "bottom right",
        "top",
        "top left",
        "top right",
        "left",
        "left top",
        "left bottom",
        "right",
        "right top",
        "right bottom"
    ];
    
    private popupTriggers : string[] = [
        "none",
        "hover",
        "click"
    ];

    @ViewChild(PopupComponent)
    public popup: PopupComponent;

    constructor() {
    }

    private ngAfterViewInit(): void {
    }
}