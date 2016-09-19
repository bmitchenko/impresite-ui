import { Attribute, Component, Input } from '@angular/core';

import * as template from "./breadcrumb-item.component.html";
import * as styles from "./breadcrumb-item.component.scss";

@Component({
    selector: 'breadcrumb-item',
    styles: [styles],
    template: template
})
export class BreadcrumbItemComponent {
    private _active: boolean | string = false;

    public get active(): boolean | string {
        return this._active;
    }

    @Input()
    public set active(active: boolean | string) {
        this._active = active == true || active == 'true' || active == '';
    }

    @Input()
    public url: string;
}