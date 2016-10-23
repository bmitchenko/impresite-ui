import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import { IDialog } from "./dialog";

@Component({
    selector: 'modal-window',
    styleUrls: ['./modal-window.component.scss'],
    templateUrl: './modal-window.component.html'
})
export class ModalWindowComponent {
}