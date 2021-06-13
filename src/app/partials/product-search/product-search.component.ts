import { Component, OnInit } from '@angular/core';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-product-search',
  templateUrl: './product-search.component.html',
  styleUrls: ['./product-search.component.scss'],
})
export class ProductSearchComponent implements OnInit {
  // search config before login
  searchTextBeforeLogin: any = '';
  public searchDropdownValue = [
    {
      name: 'Course',
      value: 'course',
      placeholder: 'Type computer science, design, finance...',
    },
    {
      name: 'Gig',
      value: 'gig',
      placeholder: 'Type html, content, web development, data analyst...',
    },
    {
      name: 'Job',
      value: 'job',
      placeholder: 'Type architect, data analyst...',
    },
  ];
  selectedSearchDrp = this.searchDropdownValue[0];
  constructor(private sharedService: SharedService) {}

  onSearch() {
    switch (this.selectedSearchDrp.value) {
      case 'course':
        this.onCourseSearch('text');
        break;
      case 'job':
        this.sharedService.utilityService.onJobSearch(this.searchTextBeforeLogin);
        break;
      case 'gig':
        this.sharedService.utilityService.onGigSearch(this.searchTextBeforeLogin);
        break;
    }
  }

  onCourseSearch(_type: string, _val?: string) {
    if (_type === 'text') {
      this.sharedService.utilityService.onCourseSearch(this.searchTextBeforeLogin, _type);
    } else {
      this.sharedService.utilityService.onCourseSearch(_val, _type);
    }
  }
  ngOnInit(): void {}
}
