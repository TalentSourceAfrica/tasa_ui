import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create-requirement',
  templateUrl: './create-requirement.component.html',
  styleUrls: ['./create-requirement.component.scss'],
})
export class CreateRequirementComponent implements OnInit {
  requirementConfig: any = {
    isLoading: false,
    isStart: true,
    isFirst: true,
    requirement: {},
  };
  constructor() {}

  ngOnInit(): void {}
}
