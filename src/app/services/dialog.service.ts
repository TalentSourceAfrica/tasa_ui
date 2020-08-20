import { Injectable, TemplateRef, Component } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  dialogReff: any;
  constructor(public dialog: MatDialog) {}

  public open<T>(component: ComponentType<T> | TemplateRef<T>, dialogConfig?: any) {
    const dialogRef = this.dialog.open(component, dialogConfig);
    this.dialogReff = dialogRef;

    return dialogRef;
  }
}
