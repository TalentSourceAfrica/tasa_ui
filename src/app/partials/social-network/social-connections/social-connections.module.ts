import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialConnectionsComponent } from './social-connections.component';
import { MaterialModule } from '@app/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule],
  declarations: [SocialConnectionsComponent],
  exports: [SocialConnectionsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})

export class SocialConnectionsModule {}
