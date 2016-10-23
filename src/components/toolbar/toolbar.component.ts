import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

@Component({
    selector: 'toolbar',
    styleUrls: ['./toolbar.component.scss'],
    templateUrl: './toolbar.component.html'
})
export class ToolbarComponent implements OnInit, AfterViewInit {
    private _hostElement: ElementRef;
    private _initialized = false;
    private _params: { [name: string]: any } = {};
    private _renderer: Renderer;

    constructor(hostElement: ElementRef, renderer: Renderer) {
        this._hostElement = hostElement;
        this._renderer = renderer;
    }

    @ContentChild(TemplateRef)
    private itemTemplate: TemplateRef<any>;

    public ngOnInit(): void {
        this._initialized = true;

        delete this._params;
    }

    public ngAfterViewInit(): void {
        // if (this._autofocus) {
        //     this._renderer.invokeElementMethod(this._hostElement.nativeElement, "focus");
        // }

        // this.popup.target = this._hostElement;
    }
}