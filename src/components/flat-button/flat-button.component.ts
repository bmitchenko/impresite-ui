import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

@Component({
    selector: 'flat-button',
    styleUrls: ['./flat-button.component.scss'],
    templateUrl: './flat-button.component.html'
})
export class FlatButtonComponent {
    private _enabled = true;

    @HostBinding("attr.disabled")
    public get hostDisabled(): string {
        if (this._enabled) {
            return undefined;
        }

        return "disabled";
    }

    @HostListener('click')
    private hostClick(): void {
        if (this._enabled) {
            this.click.emit();
        }
    }

    public get enabled(): boolean {
        return this._enabled;
    }

    @Input()
    public set enabled(enabled: boolean) {
        if (this._enabled == enabled) {
            return;
        }

        this._enabled = enabled;
    }

    public click = new EventEmitter<any>();
}