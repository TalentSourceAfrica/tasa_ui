import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-our-team',
  templateUrl: './our-team.component.html',
  styleUrls: ['./our-team.component.scss'],
})
export class OurTeamComponent implements OnInit {
  popupData: any;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private dialogRef: MatDialogRef<OurTeamComponent>) {
    this.popupData = data;
  }

  ngOnInit(): void {}
}
