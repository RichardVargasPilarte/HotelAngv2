import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// Modulos
import { SharedModule } from './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { ComponentsModule } from './components/components.module';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { jwtInterceptor } from './interceptors/jwt.interceptor';
import {UserGuard } from '../app/guards/user.guard';

import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';

import { environment } from '../environments/environment';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    AuthModule,
    ComponentsModule,
  ],
  providers: [
    provideAnimationsAsync(),
    {provide: MAT_DATE_LOCALE, useValue: 'es-ES'},
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: jwtInterceptor,
      multi: true,
    },
    UserGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
