import { Component, ViewChild, ElementRef } from '@angular/core';

import { CalendarComponent } from '../../components/calendar/calendar.component';

@Component({
    selector: 'calendar-demo',
    styleUrls: ['./calendar-demo.component.scss'],
    templateUrl: './calendar-demo.component.html'
})
export class CalendarDemoComponent {
    @ViewChild(CalendarComponent)
    public calendar: CalendarComponent;

    constructor() {
    }
}