import { Component, ViewChild, ElementRef, Input } from '@angular/core';

import { CheckBoxComponent } from '../../components/check-box/check-box.component';

import * as template from "./check-box-demo.component.html";
import * as styles from "./check-box-demo.component.scss";

@Component({
    selector: 'check-box-demo',
    template: template,
    styles: [styles]
})
export class CheckBoxDemoComponent {
    @ViewChild(CheckBoxComponent)
    public checkBox: CheckBoxComponent;

    public flagValue: number = 0;
    public pushValue: number[] = [];

    public get pushValueText(): string {
        return JSON.stringify(this.pushValue);
    }
}