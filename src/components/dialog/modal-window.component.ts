import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import { IDialog } from "./dialog";

import * as template from "./modal-window.component.html";
import * as styles from "./modal-window.component.scss";

@Component({
    selector: 'modal-window',
    styles: [styles],
    template: template
})
export class ModalWindowComponent {
}