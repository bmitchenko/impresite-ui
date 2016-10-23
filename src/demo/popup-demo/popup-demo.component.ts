import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { PopupComponent } from '../../components/popup/popup.component';

@Component({
    selector: 'popup-demo',
    styleUrls: ['./popup-demo.component.scss'],
    templateUrl: './popup-demo.component.html'
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