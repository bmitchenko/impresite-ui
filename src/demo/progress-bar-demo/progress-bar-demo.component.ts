import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { ProgressBarComponent } from '../../components/progress-bar/progress-bar.component';

@Component({
    selector: 'progress-bar-demo',
    styleUrls: ['./progress-bar-demo.component.scss'],
    templateUrl: './progress-bar-demo.component.html'
})
export class ProgressBarDemoComponent implements AfterViewInit {
    @ViewChild(ProgressBarComponent)
    public progressBar: ProgressBarComponent;

    public ngAfterViewInit(): void {
        this.progressBar.value = 50;
    }
}