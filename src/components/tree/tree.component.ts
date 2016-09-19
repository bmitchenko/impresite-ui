import { Component, ElementRef, EventEmitter, Input, Output, TemplateRef, Renderer, QueryList } from '@angular/core';
import { ContentChild, ContentChildren, HostBinding, HostListener, ViewChildren } from '@angular/core';
import { OnInit, AfterViewInit } from '@angular/core';

import { ITreeNode, TreeNodeComponent } from "./tree-node.component";
import * as template from "./tree.component.html";
import * as styles from "./tree.component.scss";

@Component({
    selector: 'tree',
    styles: [styles],
    template: template
})
export class TreeComponent implements AfterViewInit {
    private _initialized = false;
    private _load: { (node: any): Promise<any[]> };
    private _nodes: any[];
    private _nodesProperty = 'nodes';
    private _params = new Map<string, any>();
    private _selectableGroups = false;
    private _selectedNode: TreeNodeComponent;

    @ContentChild(TemplateRef)
    private contentTemplate: TemplateRef<any>;

    @ViewChildren(TreeNodeComponent)
    private viewNodes: QueryList<TreeNodeComponent>;

    constructor() {
        this.nodeClick = this.nodeClick.bind(this);
    }

    public get load() {
        return this._load;
    }

    @Input()
    public set load(load) {
        if (this._load == load) {
            return;
        }

        this._load = load;

        if (this._load != undefined) {
            this.loadExpandedNodes();
        }
    }

    public get nodes(): any[] {
        return this._nodes;
    }

    @Input()
    public set nodes(nodes: any[]) {
        if (this._nodes == nodes) {
            return;
        }

        this._nodes = nodes;

        if (this._selectedNode != undefined) {
            var nodeList = this.flattenNodes(nodes);

            if (nodeList.indexOf(this._selectedNode) == -1) {
                this.selectNode(undefined);
            }
        }
    }

    public get nodesProperty(): string {
        return this._nodesProperty;
    }

    public set nodesProperty(nodesProperty: string) {
        this._nodesProperty = nodesProperty;
    }

    public get selectableGroups(): boolean {
        return this._selectableGroups;
    }

    @Input()
    public set selectableGroups(selectableGroups: boolean) {
        if (this._selectableGroups == selectableGroups) {
            return;
        }

        this._selectableGroups = selectableGroups;

        if (!selectableGroups) {
            if (this._selectedNode != undefined && this._selectedNode.expandable) {
                this.selectNode(undefined);
            }
        }
    }

    public get selectedNode(): any {
        if (this._selectedNode == undefined) {
            return undefined;
        }

        return this._selectedNode.data;
    }

    @Input()
    public set selectedNode(selectedNode: any) {
        if (this._selectedNode == undefined && selectedNode == undefined) {
            return;
        }

        if (this._selectedNode != undefined && this._selectedNode.data == selectedNode) {
            return;
        }

        if (!this._initialized) {
            this._params.set('selectedNode', selectedNode);
            return;
        }

        this.selectNode(selectedNode);
    }

    @Output()
    private selectedNodeChange = new EventEmitter<ITreeNode>();

    public ngAfterViewInit(): void {
        this._initialized = true;

        if (this._params.has('selectedNode')) {
            this.selectedNode = this._params.get('selectedNode');
        }

        if (this._load != undefined) {
            this.loadExpandedNodes();
        }

        delete this._params;
    }

    public expand(node: any): void {
        let nodeComponents = this.traceNode(node);

        nodeComponents.forEach((nodeComponent) => {
            nodeComponent.expand();
        });
    }

    public expandAll(): void {
        this.viewNodes.forEach((nodeComponent) => {
            nodeComponent.expand(true);
        });
    }

    public collapse(node: any): void {
        let nodeComponent = this.findNodeComponentByData(node);

        if (nodeComponent != undefined) {
            nodeComponent.collapse();
        }
    }

    public collapseAll(): void {
        this.viewNodes.forEach((nodeComponent) => {
            nodeComponent.collapse(true);
        });
    }

    private loadExpandedNodes(): void {
        if (this.viewNodes == undefined) {
            return;
        }

        var flattenNodes = this.flattenViewNodes(this.viewNodes.toArray());
        flattenNodes.forEach((viewNode) => {
            var node = viewNode.data[this._nodesProperty];

            if (node === undefined) {
                viewNode.load();
            }
        });
    }

    private flattenNodes(nodes: any[]): any[] {
        let result: any[] = [];

        nodes.forEach((node) => {
            result.push(node);

            if (node[this._nodesProperty] != undefined && node[this._nodesProperty].length > 0) {
                this.flattenNodes(node[this._nodesProperty]).forEach((childNode) => {
                    result.push(childNode);
                });
            }
        });

        return result;
    }

    private flattenViewNodes(viewNodes: TreeNodeComponent[]): TreeNodeComponent[] {
        let result: TreeNodeComponent[] = [];

        viewNodes.forEach((viewNode) => {
            result.push(viewNode);

            if (viewNode.viewNodes != undefined && viewNode.viewNodes.length > 0) {
                this.flattenViewNodes(viewNode.viewNodes.toArray()).forEach((childViewNode) => {
                    result.push(childViewNode);
                });
            }
        });

        return result;
    }

    private traceNode(node: any, viewNode?: TreeNodeComponent): TreeNodeComponent[] {
        if (viewNode == undefined) {
            if (this.viewNodes != undefined) {
                for (let i = 0; i < this.viewNodes.length; i++) {
                    let result = this.traceNode(node, this.viewNodes[i]);

                    if (result.length > 0) {
                        return result;
                    }
                }
            }

            return [];
        }

        if (viewNode.data == node) {
            return [viewNode];
        }

        if (viewNode.viewNodes != undefined) {
            for (let i = 0; i < viewNode.viewNodes.length; i++) {
                let result = this.traceNode(node, viewNode.viewNodes[i]);

                if (result.length > 0) {
                    result.unshift(viewNode);
                    return result;
                }
            }

        }

        return [];
    }

    private nodeClick(viewNode: TreeNodeComponent): void {
        if (viewNode.expandable) {
            viewNode.expanded = !viewNode.expanded;

            if (this.selectableGroups) {
                this.selectNode(viewNode.data, viewNode);
            }
        } else {
            this.selectNode(viewNode.data, viewNode);
        }
    }

    private selectNode(node: any, viewNode?: TreeNodeComponent) {
        if (node == undefined) {
            viewNode = undefined;
        } else {
            if (viewNode == undefined) {
                viewNode = this.findNodeComponentByData(node);
            }
        }

        if (this._selectedNode == viewNode) {
            return;
        }

        if (this._selectedNode != undefined) {
            this._selectedNode.selected = false;
        }

        this._selectedNode = viewNode;

        if (viewNode != undefined) {
            viewNode.selected = true;
        }

        this.selectedNodeChange.emit(node);
    }

    private findNodeComponentByData(node: any): TreeNodeComponent {
        var traceResult = this.traceNode(node);

        if (traceResult.length > 0) {
            return traceResult[traceResult.length - 1];
        }

        return undefined;
    }
}