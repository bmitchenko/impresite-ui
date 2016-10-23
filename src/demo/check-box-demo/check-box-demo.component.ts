import { Component, ViewChild, ElementRef, Input } from '@angular/core';

import { CheckBoxComponent } from '../../components/check-box/check-box.component';

@Component({
    selector: 'check-box-demo',
    styleUrls: ['./check-box-demo.component.scss'],
    templateUrl: './check-box-demo.component.html'
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