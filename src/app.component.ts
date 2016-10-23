import { Component } from '@angular/core';

import { Data } from './test-data';
import { ArrayDataSource } from './data/array-data-source';
import './styles/styles.scss';
import './rxjs-operators';

@Component({
    selector: 'my-app',
    styleUrls: ['./app.component.scss'],
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor() {
    }
}