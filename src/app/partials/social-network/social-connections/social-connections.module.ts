import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialConnectionsComponent } from './social-connections.component';
import { MaterialModule } from '@app/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SocialnetworkService } from '@app/scenes/social-network/socialnetwork.service';
import { NameFilterModule } from '@app/pipes/name-filter.pipe';

@NgModule({
  imports: [CommonModule, MaterialModule, FormsModule, ReactiveFormsModule, RouterModule, NameFilterModule],
  declarations: [SocialConnectionsComponent],
  exports: [SocialConnectionsComponent],
  providers: [SocialnetworkService],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class SocialConnectionsModule {}
