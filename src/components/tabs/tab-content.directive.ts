import { Directive, TemplateRef } from '@angular/core';

@Directive({
    selector: '[tab-content]',
})
export class TabContentDirective {
    constructor(public templateRef: TemplateRef<any>) {
    }
}