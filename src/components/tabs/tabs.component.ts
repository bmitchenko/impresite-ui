import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer } from '@angular/core';
import { ContentChild, ContentChildren, QueryList, HostBinding, HostListener, ViewChild } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import { TabContentDirective } from './tab-content.directive';
import { TabLabelDirective } from './tab-label.directive';
import { TabDirective } from './tab.directive';

import * as template from "./tabs.component.html";
import * as styles from "./tabs.component.scss";

@Component({
    selector: 'tabs',
    styles: [styles],
    template: template
})
export class TabsComponent {
    private _selectedIndex = -1;

    @ContentChildren(TabDirective)
    private tabs: QueryList<TabDirective>;

    @Input()
    public get selectedIndex(): number {
        return this._selectedIndex;
    }

    public set selectedIndex(selectedIndex: number) {
        if (this._selectedIndex == selectedIndex) {
            return;
        }

        this._selectedIndex = selectedIndex;
        this.selectedIndexChange.emit(selectedIndex);
    }

    @Output()
    public selectedIndexChange = new EventEmitter<number>();

    private get activeTab(): TabDirective {
        if (this.tabs == undefined || this.tabs.length == 0) {
            return undefined;
        }

        var index = this.selectedIndex;

        if (index == undefined || index < 0 || index > this.tabs.length - 1) {
            index = 0;
        }

        return this.tabs.toArray()[index];
    }

    private tabLabelClick(tab: TabDirective): void {
        this.selectedIndex = this.tabs.toArray().indexOf(tab);
    }
}