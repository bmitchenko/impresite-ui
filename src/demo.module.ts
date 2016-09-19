import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { ImpresiteUiModule } from './impresite-ui.module';
import { FormsModule } from '@angular/forms';

import { routing } from './app.routing';
import { AppComponent } from './app.component';

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
import { RegistrationComponent } from './demo/dialog-demo/registration.component';
import { TabsDemoComponent } from './demo/tabs-demo/tabs-demo.component';
import { TextBoxDemoComponent } from './demo/text-box-demo/text-box-demo.component';
import { ToggleButtonDemoComponent } from './demo/toggle-button-demo/toggle-button-demo.component';
import { ToolbarDemoComponent } from './demo/toolbar-demo/toolbar-demo.component';
import { TreeDemoComponent } from './demo/tree-demo/tree-demo.component';
import { YandexMapDemoComponent } from './demo/yandex-map-demo/yandex-map-demo.component';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ImpresiteUiModule,
        routing
    ],
    declarations: [
        AppComponent,
        AutocompleteDemoComponent,
        BreadcrumbDemoComponent,
        ButtonDemoComponent,
        CalendarDemoComponent,
        CheckBoxDemoComponent,
        ComboBoxDemoComponent,
        DataTableDemoComponent,
        DateEditDemoComponent,
        DialogDemoComponent,
        ErrorListDemoComponent,
        FlatButtonDemoComponent,
        ListDemoComponent,
        MemoEditDemoComponent,
        NumericEditDemoComponent,
        PivotDemoComponent,
        PopupDemoComponent,
        ProgressBarDemoComponent,
        RadioButtonDemoComponent,
        RegistrationComponent,
        TabsDemoComponent,
        TextBoxDemoComponent,
        ToggleButtonDemoComponent,
        ToolbarDemoComponent,
        TreeDemoComponent,
        YandexMapDemoComponent
    ],
    entryComponents: [
        RegistrationComponent
    ],
    providers: [
    ],
    bootstrap: [AppComponent]
})
export class DemoModule { }