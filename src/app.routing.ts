import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AutocompleteDemoComponent } from './demo/autocomplete-demo/autocomplete-demo.component';
import { BreadcrumbDemoComponent } from './demo/breadcrumb-demo/breadcrumb-demo.component';
import { ButtonDemoComponent } from './demo/button-demo/button-demo.component';
import { CalendarDemoComponent } from './demo/calendar-demo/calendar-demo.component';
import { CheckBoxDemoComponent } from './demo/check-box-demo/check-box-demo.component';
import { ComboBoxDemoComponent } from './demo/combo-box-demo/combo-box-demo.component';
import { DataTableDemoComponent } from './demo/data-table-demo/data-table-demo.component';
import { DateEditDemoComponent } from './demo/date-edit-demo/date-edit-demo.component';
import { DialogDemoComponent } from './demo/dialog-demo/dialog-demo.component';
import { ErrorListDemoComponent } from './demo/error-list-demo/error-list-demo.component';
import { FlatButtonDemoComponent } from './demo/flat-button-demo/flat-button-demo.component';
import { ListDemoComponent } from './demo/list-demo/list-demo.component';
import { MemoEditDemoComponent } from './demo/memo-edit-demo/memo-edit-demo.component';
import { NumericEditDemoComponent } from './demo/numeric-edit-demo/numeric-edit-demo.component';
import { PivotDemoComponent } from './demo/pivot-demo/pivot-demo.component';
import { PopupDemoComponent } from './demo/popup-demo/popup-demo.component';
import { ProgressBarDemoComponent } from './demo/progress-bar-demo/progress-bar-demo.component';
import { RadioButtonDemoComponent } from './demo/radio-button-demo/radio-button-demo.component';
import { TabsDemoComponent } from './demo/tabs-demo/tabs-demo.component';
import { TextBoxDemoComponent } from './demo/text-box-demo/text-box-demo.component';
import { ToggleButtonDemoComponent } from './demo/toggle-button-demo/toggle-button-demo.component';
import { ToolbarDemoComponent } from './demo/toolbar-demo/toolbar-demo.component';
import { TreeDemoComponent } from './demo/tree-demo/tree-demo.component';
import { YandexMapDemoComponent } from './demo/yandex-map-demo/yandex-map-demo.component';

const appRoutes: Routes = [
    { path: '', redirectTo: '/autocomplete', pathMatch: 'full' },
    { path: 'autocomplete', component: AutocompleteDemoComponent },
    { path: 'breadcrumb', component: BreadcrumbDemoComponent },
    { path: 'button', component: ButtonDemoComponent },
    { path: 'calendar', component: CalendarDemoComponent },
    { path: 'check-box', component: CheckBoxDemoComponent },
    { path: 'combo-box', component: ComboBoxDemoComponent },
    { path: 'data-table', component: DataTableDemoComponent },
    { path: 'date-edit', component: DateEditDemoComponent },
    { path: 'dialog', component: DialogDemoComponent },
    { path: 'error-list', component: ErrorListDemoComponent },
    { path: 'flat-button', component: FlatButtonDemoComponent },
    { path: 'list', component: ListDemoComponent },
    { path: 'memo-edit', component: MemoEditDemoComponent },
    { path: 'numeric-edit', component: NumericEditDemoComponent },
    { path: 'pivot', component: PivotDemoComponent },
    { path: 'popup', component: PopupDemoComponent },
    { path: 'progress-bar', component: ProgressBarDemoComponent },
    { path: 'radio-button', component: RadioButtonDemoComponent },
    { path: 'tabs', component: TabsDemoComponent },
    { path: 'text-box', component: TextBoxDemoComponent },
    { path: 'toggle-button', component: ToggleButtonDemoComponent },
    { path: 'toolbar', component: ToolbarDemoComponent },
    { path: 'tree', component: TreeDemoComponent },
    { path: 'yandex-map', component: YandexMapDemoComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);