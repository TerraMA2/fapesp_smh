import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MapComponent } from './map/map.component';
import { AnaliseMensalComponent } from './dashboard/analise-mensal/analise-mensal.component';
import { AnaliseDiariaComponent } from './dashboard/analise-diaria/analise-diaria.component';

import { FormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Imports PrimeFaceNg Components
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ProgressBarModule } from 'primeng/progressbar';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SliderModule } from 'primeng/slider';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SidebarModule } from 'primeng/sidebar';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { AccordionModule } from 'primeng/accordion';
import { SpinnerModule } from 'primeng/spinner';
import { TableModule } from 'primeng/table';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TabMenuModule } from 'primeng/tabmenu';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    AnaliseMensalComponent,
    AnaliseDiariaComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    RadioButtonModule,
    CheckboxModule,
    ProgressBarModule,
    InputSwitchModule,
    SliderModule,
    ButtonModule,
    DialogModule,
    SidebarModule,
    ChartModule,
    CalendarModule,
    InputTextModule,
    ProgressSpinnerModule,
    DropdownModule,
    AccordionModule,
    SpinnerModule,
    TableModule,
    SelectButtonModule,
    TabMenuModule,
    ScrollPanelModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
