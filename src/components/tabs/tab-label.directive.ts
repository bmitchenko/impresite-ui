import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[tab-label]',
})
export class TabLabelDirective {
    constructor(public templateRef: TemplateRef<any>) {
    }
}