import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer, QueryList } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChild, ViewChildren } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import * as template from "./tree-node.component.html";
import * as styles from "./tree-node.component.scss";

export interface ITreeNode {
    expanded?: boolean;
    nodes?: ITreeNode[];
    selected?: boolean;
    text?: string;
}

@Component({
    selector: 'tree-node',
    styles: [styles],
    template: template
})
export class TreeNodeComponent {
    private _clickCallback: { (node: TreeNodeComponent): void };
    private _data: any;
    private _level = 0;
    private _loadingStatus = 'Загрузка...';

    @Input()
    private nodesProperty: string;

    @Input()
    private loadFunction: { (node: any): Promise<any[]> };

    @HostBinding('class.tree-node-expanded')
    private _expanded = false;

    @HostBinding('class.tree-node-loading')
    private _loading = false;

    @HostBinding('class.tree-node-selected')
    private _selected = false;

    private _template: TemplateRef<any>;

    @ViewChildren(TreeNodeComponent)
    public viewNodes: QueryList<TreeNodeComponent>;

    public get clickCallback() {
        return this._clickCallback;
    }

    @Input()
    public set clickCallback(clickCallback) {
        this._clickCallback = clickCallback;
    }

    public get data(): ITreeNode {
        return this._data;
    }

    @Input()
    public set data(data: ITreeNode) {
        this._data = data;
    }

    public get expanded(): boolean {
        return this._expanded;
    }

    public set expanded(expanded: boolean) {
        this._expanded = expanded;
    }

    public get level(): number {
        return this._level;
    }

    @Input()
    public set level(level: number) {
        this._level = level;
    }

    public get nodes(): any[] {
        return this._data[this.nodesProperty];
    }

    public get selected(): boolean {
        return this._selected;
    }

    public set selected(selected: boolean) {
        this._selected = selected;
    }

    public get template(): TemplateRef<any> {
        return this._template;
    }

    @Input()
    public set template(template: TemplateRef<any>) {
        this._template = template;
    }

    @HostBinding('class.tree-node-expandable')
    public get expandable(): boolean {
        var nodes = this._data[this.nodesProperty];

        if (nodes === undefined && this.loadFunction != undefined) {
            return true;
        }

        return nodes != undefined && nodes.length > 0;
    }

    private get buttonWidth(): number {
        return 16 + this._level * 16;
    }

    public load(): Promise<any> {
        this._loading = true;

        return this.loadFunction(this.data).then((result) => {
            if (result === undefined) {
                this._data.nodes = null;
            } else {
                this._data.nodes = result;
            }
        }).catch((error) => {
            this._loadingStatus = 'Error.'
            console.log(error);
        }).then(() => {
            this._loading = false;
        });
    }

    public collapse(recursive: boolean = false): void {
        this.setExpanded(false, recursive);
    }

    public expand(recursive: boolean = false): void {
        this.setExpanded(true, recursive);
    }

    private setExpanded(expanded: boolean, recursive: boolean): void {
        this.expanded = expanded;

        if (recursive) {
            this.viewNodes.forEach((node) => {
                if (expanded) {
                    node.expand(true);
                } else {
                    node.collapse(true);
                }
            });
        }
    }

    private nodeClick(): void {
        this._clickCallback(this);
    }
}