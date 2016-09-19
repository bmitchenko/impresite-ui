import { Component, ViewChild, ElementRef } from '@angular/core';

import { YandexMapComponent } from '../../components/yandex-map/yandex-map.component';

import * as template from "./yandex-map-demo.component.html";
import * as styles from "./yandex-map-demo.component.scss";

@Component({
    selector: 'yandex-map-demo',
    template: template,
    styles: [styles]
})
export class YandexMapDemoComponent {
    @ViewChild(YandexMapComponent)
    public yandexMap: YandexMapComponent;

    constructor() {
    }
}