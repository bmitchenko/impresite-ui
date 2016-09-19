import { Component } from '@angular/core';

import { Data } from './test-data';
import { ArrayDataSource } from './data/array-data-source';
import './styles/styles.scss';
import './rxjs-operators';

import * as template from "./app.component.html";
import * as styles from "./app.component.scss";

@Component({
    selector: 'my-app',
    template: template,
    styles: [styles]
})
export class AppComponent {
    constructor() {
    }
}