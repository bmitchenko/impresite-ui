import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import * as template from './calendar.component.html';
import * as styles from "./calendar.component.scss";

@Component({
    selector: 'calendar',
    styles: [styles],
    template: template
})
export class CalendarComponent {
    private _dayMilliseconds: number = 1000 * 60 * 60 * 24;
    private _parent: Date = new Date();
    private _parentName: string;
    private _level: CalendarLevel = CalendarLevel.Month;
    private _items: ICalendarItem[];
    private _date: Date;
    private _headerVisible = true;
    private _isDays = true;
    private _isMonths = false;
    private _isYears = false;

    constructor() {
        this.update();
    }

    public get date(): Date {
        return this._date;
    }

    @Input()
    public set date(date: Date) {
        if (this.compareDates(this._date, date)) {
            return;
        }

        if (date != undefined && isNaN(date.getTime())) {
            throw new Error('Invalid date.');
        }

        this._date = date;
        this.dateChanged.emit(date);

        if (date != undefined) {
            this.setParent(date);
            this.setLevel(CalendarLevel.Month);
        }

        this.update();
    }

    @Output()
    public dateChanged = new EventEmitter<Date>();

    @Output()
    public dateSelected = new EventEmitter<Date>();

    private setLevel(level: CalendarLevel): void {
        this._level = level;
        this.update();
    }

    private setParent(date: Date): void {
        this._parent = new Date(date.getTime());
        this.update();
    }

    private update(): void {
        this._parentName = this.getParentName(this._parent, this._level);
        this._headerVisible = this._level == CalendarLevel.Month;
        this._isDays = this._level == CalendarLevel.Month;
        this._isMonths = this._level == CalendarLevel.Year;
        this._isYears = this._level == CalendarLevel.Decade;

        var dates: Date[];

        switch (this._level) {
            case CalendarLevel.Decade:
                dates = this.getYears(this._parent.getFullYear());
                break;
            case CalendarLevel.Year:
                dates = this.getMonths(this._parent.getFullYear());
                break;
            case CalendarLevel.Month:
                dates = this.getDays(this._parent.getFullYear(), this._parent.getMonth());
                break;
            default:
                break;
        }

        var items: ICalendarItem[] = [];
        var now = new Date();

        dates.forEach((date) => {
            var isGrayed = !this.isChildOf(date, this._parent, this._level);
            var isSelected = false;
            var isToday = this._level == CalendarLevel.Month ? this.compareDates(date, now) : this.isChildOf(now, date, this._level + 1);

            if (this._date != undefined) {
                isSelected = this._level == CalendarLevel.Month ? this.compareDates(date, this._date) : this.isChildOf(this._date, date, this._level + 1);
            }

            items.push({
                isGrayed: isGrayed,
                isSelected: isSelected,
                isToday: isToday,
                text: this.getName(date, this._level + 1),
                value: date
            });
        });

        this._items = items;
    }

    private getYears(decade: number): Date[] {
        return this.createSequence(-1, 12).map(x => new Date(decade + x, 0, 1));
    }

    private getMonths(year: number): Date[] {
        return this.createSequence(0, 12).map(x => new Date(year, x, 1));
    }

    private getDays(year: number, month: number): Date[] {
        var firstDayOfMonth = new Date(year, month, 1);
        var dow = firstDayOfMonth.getDay();
        var firstMonday = dow == 0 ? this.addDays(firstDayOfMonth, -6) : this.addDays(firstDayOfMonth, 1 - dow);
        var dates: Date[] = [];

        for (var i = 0; i < 42; i++) {
            dates.push(this.addDays(firstMonday, i));
        }

        return dates;
    }

    private createSequence(start: number, length: number): number[] {
        var sequence: number[] = [];

        for (var i = 0; i < length; i++) {
            sequence.push(start + i);
        }

        return sequence;
    }

    private compareDates(d1?: Date, d2?: Date): boolean {
        if (d1 != undefined && d2 != undefined) {
            return d1.toDateString() == d2.toDateString();
        } else {
            return d1 == undefined && d2 == undefined;
        }
    }

    private getName(date: Date, level: CalendarLevel): string {
        switch (level) {
            case CalendarLevel.Year:
                return date.getFullYear().toString();

            case CalendarLevel.Month:
                return this.getMonthName(date.getMonth()).substr(0, 3).toLowerCase();

            case CalendarLevel.Day:
                return date.getDate().toString();

            default: return undefined;
        }
    }

    private getParentName(date: Date, level: CalendarLevel): string {
        switch (level) {
            case CalendarLevel.Decade:
                let year = date.getFullYear();
                return `${year} - ${year + 9}`;

            case CalendarLevel.Year:
                return date.getFullYear().toString();

            case CalendarLevel.Month:
                return this.getMonthName(date.getMonth()) + ' ' + date.getFullYear();

            default: return undefined;
        }
    }

    private getMonthName(month: number): string {
        var date = new Date(2000, month, 1);
        var monthName = date
            .toLocaleString(navigator.language, { month: "long" })
            .trim()
            .replace('\u200E', '') // remove LTR;

        return monthName.substr(0, 1).toUpperCase() + monthName.substr(1);
    }

    private addDays(date: Date, days: number): Date {
        return new Date(date.getTime() + this._dayMilliseconds * days);
    }

    private isChildOf(date: Date, parent: Date, parentLevel: CalendarLevel): boolean {
        switch (parentLevel) {
            case CalendarLevel.Decade:
                var decadeStart = parent.getFullYear();
                var year = date.getFullYear();
                return year >= decadeStart && year < decadeStart + 10;

            case CalendarLevel.Year:
                return date.getFullYear() == parent.getFullYear();

            case CalendarLevel.Month:
                return date.getFullYear() == parent.getFullYear() && date.getMonth() == parent.getMonth();

            default:
                return false;
        }
    }

    private previousPage(): void {
        this.setPage(-1);
    }

    private nextPage(): void {
        this.setPage(1);
    }

    private setPage(delta: number): void {
        switch (this._level) {
            case CalendarLevel.Decade:
                this._parent.setFullYear(this._parent.getFullYear() + delta * 10);
                break;

            case CalendarLevel.Year:
                this._parent.setFullYear(this._parent.getFullYear() + delta);
                break;

            case CalendarLevel.Month:
                this._parent.setMonth(this._parent.getMonth() + delta);
                break;

            default:
                break;
        }

        this.update();
    }

    private levelUp(): void {
        if (this._level == CalendarLevel.Decade) {
            return;
        }

        if (this._level == CalendarLevel.Year) {
            var decadeStart = Math.floor(this._parent.getFullYear() / 10) * 10;
            this._parent.setFullYear(decadeStart);
        }

        this._level--;

        this.update();
    }

    private itemClick(value: Date): void {
        switch (this._level) {
            case CalendarLevel.Decade:
            case CalendarLevel.Year:
                this._parent = value;
                this._level++;
                this.update();
                break;

            case CalendarLevel.Month:
                this.date = value;
                this.dateSelected.emit(value);
                break;

            default:
                break;
        }
    }
}

interface ICalendarItem {
    isGrayed: boolean;
    isSelected: boolean;
    isToday: boolean;
    text: string;
    value: Date;
}

enum CalendarLevel {
    Decade = 0,
    Year = 1,
    Month = 2,
    Day = 3
}