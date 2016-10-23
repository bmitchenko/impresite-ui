import { Attribute, Component, Input } from '@angular/core';

@Component({
    selector: 'breadcrumb-item',
    styleUrls: ['./breadcrumb-item.component.scss'],
    templateUrl: './breadcrumb-item.component.html'
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