import { Component, ViewChild, ElementRef } from '@angular/core';

import { CalendarComponent } from '../../components/calendar/calendar.component';

import * as template from "./calendar-demo.component.html";
import * as styles from "./calendar-demo.component.scss";

@Component({
    selector: 'calendar-demo',
    template: template,
    styles: [styles]
})
export class CalendarDemoComponent {
    @ViewChild(CalendarComponent)
    public calendar: CalendarComponent;

    constructor() {
    }
}