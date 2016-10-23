import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

@Component({
    selector: 'progress-bar',
    styleUrls: ['./progress-bar.component.scss'],
    templateUrl: './progress-bar.component.html'
})
export class ProgressBarComponent {
    private _max = 100;
    private _min = 0;
    private _infinite = false;
    private _value = 0;

    public get max(): number {
        return this._max;
    }

    @Input()
    public set max(max: number) {
        this._max = max;
    }

    public get min(): number {
        return this._min;
    }

    @Input()
    public set min(min: number) {
        this._min = min;
    }

    public get infinite(): boolean {
        return this._infinite;
    }

    @Input()
    public set infinite(infinite: boolean) {
        this._infinite = infinite;
    }

    public get value(): number {
        return this._value;
    }

    @Input()
    public set value(value: number) {
        this._value = value;
    }

    private get progressPercents(): number {
        if (this._value <= this._min) {
            return 0;
        }

        if (this._value >= this._max) {
            return 100;
        }

        return Math.round((this._value - this._min) * 100 / (this._max - this._min));
    }

    @HostBinding('class.progress-bar-infinite')
    private get isInfinite() {
        return this._infinite;
    } 
}