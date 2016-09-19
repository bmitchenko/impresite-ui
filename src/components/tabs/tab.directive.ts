import { Directive, ContentChild } from '@angular/core';

import { TabContentDirective } from './tab-content.directive';
import { TabLabelDirective } from './tab-label.directive';

@Directive({
    selector: 'tab'
})
export class TabDirective {
    @ContentChild(TabLabelDirective)
    public label: TabLabelDirective;

    @ContentChild(TabContentDirective)
    public content: TabContentDirective;
}