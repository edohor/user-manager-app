import { BrowserModule } from '@angular/platform-browser'
import { NgModule } from '@angular/core'
import { AppRoutingModule } from './app-routing.module' // Add this import statement

// Other imports and declarations

@NgModule({
    imports: [
        BrowserModule,
        AppRoutingModule, // Add the AppRoutingModule to the imports array
    ],
    declarations: [
        /* ... */
    ],
    bootstrap: [
        /* ... */
    ],
})
export class AppModule {}
