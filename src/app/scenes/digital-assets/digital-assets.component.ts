import { Component, OnInit, ViewChild } from '@angular/core';

//service
import { SharedService } from '@app/services/shared.service';
import { AuthenticationService, CredentialsService } from '@app/auth';

//extra
import { Gallery } from 'angular-gallery';

@Component({
  selector: 'app-digital-assets',
  templateUrl: './digital-assets.component.html',
  styleUrls: ['./digital-assets.component.scss'],
})
export class DigitalAssetsComponent implements OnInit {
  suppFiles: any;
  doc = '';
  @ViewChild('dafile', { static: false }) public dafile: any;
  galleryImages: any;
  constructor(
    public sharedService: SharedService,
    public authenticationService: AuthenticationService,
    public credentialsService: CredentialsService,
    private gallery: Gallery
  ) {
    console.log(this.user);
  }

  prepareSupportedNames() {
    let $t = this;
    $t.suppFiles = ['jpg', 'png', 'gif', 'svg', 'avi, mp4', 'pdf', 'xls', 'docx', 'ppt', 'text', 'xml'];
  }

  callUpload() {
    this.dafile.nativeElement.click();
  }

  showGallery(doc: any) {
    let prop: any = {
      images: [],
    };
    prop.images = this.user.gcpdocument.map((doc: any) => {
      if (doc.type == '.png' || doc.type == '.jpeg' || doc.type == '.jpg' || doc.type == '.webp') {
        return { path: doc.url };
      }
    });
    prop.images = prop.images.filter((d: any) => typeof d != 'undefined');
    const index = this.sharedService.plugins.undSco.findIndex(prop.images, (d: any) => d.path == doc.url);
    prop = { ...prop, index };
    this.gallery.load(prop);
  }

  showDocViewer(doc: any) {
    this.doc = doc.url;
  }

  handleFileInput(event: any) {
    let $t = this;
    let apiUrl = $t.sharedService.urlService.apiCallWithParams('uploadMultiFile', { '{email}': $t.user.email });
    let files = event.target.files;
    var form = new FormData();
    Object.keys(files).forEach((index: any) => {
      form.append('files', files[index], files[index].name);
    });

    $t.sharedService.uiService.showApiStartPopMsg('Uploading Documents...');

    $t.sharedService.configService.post(apiUrl, form).subscribe(
      (response: any) => {
        $t.sharedService.uiService.showApiSuccessPopMsg('Documents Uploaded...');
        $t.user['gcpdocument'] = [...$t.user['gcpdocument'], ...response.responseObj];
        $t.authenticationService.login($t.user);
      },
      (error) => {
        $t.sharedService.uiService.showApiErrorPopMsg('Something Went Wrong, Please Try Again After Sometime...');
      }
    );
  }

  deleteDoc(_doc: any) {
    this.user['gcpdocument'] = this.user.gcpdocument.filter((d: any) => d.url != _doc.url);
    this.authenticationService.login(this.user);
  }

  get user(): any | null {
    const credentials = this.credentialsService.credentials;
    return credentials ? credentials : null;
  }
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.prepareSupportedNames();

    // Get the modal
    var modal = document.getElementById('myModal');

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = (event: any) => {
      if (event.target == modal) {
        modal.style.display = 'none';
      }
    };
  }
}
