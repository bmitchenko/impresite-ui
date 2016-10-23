import { Component, ViewChild, ElementRef } from '@angular/core';

import { YandexMapComponent } from '../../components/yandex-map/yandex-map.component';

@Component({
    selector: 'yandex-map-demo',
    styleUrls: ['./yandex-map-demo.component.scss'],
    templateUrl: './yandex-map-demo.component.html'
})
export class YandexMapDemoComponent {
    @ViewChild(YandexMapComponent)
    public yandexMap: YandexMapComponent;

    constructor() {
    }
}