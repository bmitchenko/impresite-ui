import { Attribute, Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import { BreadcrumbItemComponent } from "./breadcrumb-item.component";

import * as template from "./breadcrumb.component.html";
import * as styles from "./breadcrumb.component.scss";

@Component({
    selector: 'breadcrumb',
    styles: [styles],
    template: template
})
export class BreadcrumbComponent {
    @Input()
    public items: any[];

    @Input()
    public displayMember: string | { (item: any): string };

    @Input()
    public urlMember: string | { (item: any): string };

    private getItemMember(item: any, type: 'active' | 'text' | 'url'): any {
        if (item == undefined) {
            return '';
        }

        if (item instanceof BreadcrumbItem) {
            if (type == 'active') {
                return item.active;
            }

            return type == 'text' ? item.text : item.url;
        }

        if (type == 'active') {
            return this.items.indexOf(item) == this.items.length - 1;
        }

        var memberResolver = type == 'text' ? this.displayMember : this.urlMember;
        var value: string = undefined;

        if (typeof memberResolver == 'string') {
            value = item[memberResolver];
        } else {
            value = memberResolver(item);
        }

        if (value != undefined) {
            value = value.toString();
        } else {
            value = '';
        }

        return value;
    }
}

export class BreadcrumbItem {
    public active: boolean;
    public text: string;
    public url: string;

    constructor(text: string, url?: string, active?: boolean) {
        this.active = active;
        this.text = text;
        this.url = url;
    }
}