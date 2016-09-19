import { NgModule, TRANSLATIONS, TRANSLATIONS_FORMAT, LOCALE_ID } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';
import { BreadcrumbItemComponent } from './components/breadcrumb/breadcrumb-item.component';
import { ButtonComponent } from './components/button/button.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { CheckBoxComponent } from './components/check-box/check-box.component';
import { ComboBoxComponent } from './components/combo-box/combo-box.component';
import { DataTableComponent, DataStatusTextDirective } from './components/data-table/data-table.component';
import { DataColumnComponent, DataColumnCellDirective, DataColumnFooterCellDirective, DataColumnHeaderCellDirective } from "./components/data-table/data-column.component";
import { DateEditComponent } from './components/date-edit/date-edit.component';
import { DialogHostComponent } from './components/dialog/dialog-host.component';
import { DialogService } from './components/dialog/dialog.service';
import { ErrorListComponent } from './components/error-list/error-list.component';
import { FlatButtonComponent } from './components/flat-button/flat-button.component';
import { ListComponent } from './components/list/list.component';
import { MemoEditComponent } from './components/memo-edit/memo-edit.component';
import { MessageDialog } from './components/dialog/message.dialog';
import { ModalWindowComponent } from './components/dialog/modal-window.component';
import { NumericEditComponent } from './components/numeric-edit/numeric-edit.component';
import { PivotComponent } from './components/pivot/pivot.component';
import { PivotItemComponent } from './components/pivot/pivot-item.component';
import { PopupComponent } from './components/popup/popup.component';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { RadioButtonComponent } from './components/radio-button/radio-button.component';
import { TabContentDirective } from './components/tabs/tab-content.directive';
import { TabLabelDirective } from './components/tabs/tab-label.directive';
import { TabDirective } from './components/tabs/tab.directive';
import { TabsComponent } from './components/tabs/tabs.component';
import { TextBoxComponent } from './components/text-box/text-box.component';
import { ToggleButtonComponent } from './components/toggle-button/toggle-button.component';
import { ToggleButtonOptionComponent } from './components/toggle-button/toggle-button-option.component';
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { TreeComponent } from './components/tree/tree.component';
import { TreeNodeComponent } from './components/tree/tree-node.component';
import { YandexMapComponent } from './components/yandex-map/yandex-map.component';

import { FocusedDirective } from './directives/focused.directive';
import { ScrollTopDirective } from './directives/scroll-top.directive';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        RouterModule
    ],
    exports: [
        AutocompleteComponent,
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        ButtonComponent,
        CalendarComponent,
        CheckBoxComponent,
        ComboBoxComponent,
        DataColumnCellDirective,
        DataColumnComponent,
        DataColumnFooterCellDirective,
        DataColumnHeaderCellDirective,
        DataStatusTextDirective,
        DataTableComponent,
        DateEditComponent,
        ErrorListComponent,
        FlatButtonComponent,
        FocusedDirective,
        ListComponent,
        MemoEditComponent,
        ModalWindowComponent,
        MessageDialog,
        DialogHostComponent,
        NumericEditComponent,
        PivotComponent,
        PivotItemComponent,
        PopupComponent,
        ProgressBarComponent,
        RadioButtonComponent,
        ScrollTopDirective,
        TabContentDirective,
        TabLabelDirective,
        TabDirective,
        TabsComponent,
        TextBoxComponent,
        ToggleButtonComponent,
        ToggleButtonOptionComponent,
        ToolbarComponent,
        TreeComponent,
        TreeNodeComponent,
        YandexMapComponent
    ],
    declarations: [
        AutocompleteComponent,
        BreadcrumbComponent,
        BreadcrumbItemComponent,
        ButtonComponent,
        CalendarComponent,
        CheckBoxComponent,
        ComboBoxComponent,
        DataColumnCellDirective,
        DataColumnComponent,
        DataColumnFooterCellDirective,
        DataColumnHeaderCellDirective,
        DataStatusTextDirective,
        DataTableComponent,
        DateEditComponent,
        ErrorListComponent,
        FlatButtonComponent,
        FocusedDirective,
        ListComponent,
        MemoEditComponent,
        MessageDialog,
        ModalWindowComponent,
        DialogHostComponent,
        NumericEditComponent,
        PivotComponent,
        PivotItemComponent,
        PopupComponent,
        ProgressBarComponent,
        RadioButtonComponent,
        ScrollTopDirective,
        TabContentDirective,
        TabLabelDirective,
        TabDirective,
        TabsComponent,
        TextBoxComponent,
        ToggleButtonComponent,
        ToggleButtonOptionComponent,
        ToolbarComponent,
        TreeComponent,
        TreeNodeComponent,
        YandexMapComponent
    ], 
    entryComponents: [
        MessageDialog
    ],
    providers: [
        DialogService
    ]
})
export class ImpresiteUiModule { }