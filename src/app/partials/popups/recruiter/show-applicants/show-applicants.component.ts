import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-show-applicants',
  templateUrl: './show-applicants.component.html',
  styleUrls: ['./show-applicants.component.scss'],
})
export class ShowApplicantsComponent implements OnInit {
  popupData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<ShowApplicantsComponent>) {
    this.popupData = JSON.parse(JSON.stringify(data));
  }

  ngOnInit(): void {}
}
