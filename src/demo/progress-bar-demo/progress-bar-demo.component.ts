import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';

import * as template from "./progress-bar-demo.component.html";
import * as styles from "./progress-bar-demo.component.scss";

@Component({
    selector: 'progress-bar-demo',
    template: template,
    styles: [styles]
})
export class ProgressBarDemoComponent implements AfterViewInit {
    @ViewChild(ProgressBarComponent)
    public progressBar: ProgressBarComponent;

    public ngAfterViewInit(): void {
        this.progressBar.value = 50;
    }
}