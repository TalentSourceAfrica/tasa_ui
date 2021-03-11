import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';

@Component({
  selector: 'app-share-article-popup',
  templateUrl: './share-article-popup.component.html',
  styleUrls: ['./share-article-popup.component.scss'],
})
export class ShareArticlePopupComponent implements OnInit {
  public htmlContent: any;
  public popupData: any;
  config: any = {
    editable: true,
    spellcheck: true,
    height: '25rem',
    minHeight: '5rem',
    placeholder: 'Enter text here...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [
      ['bold']
      ],
    customClasses: [
      {
        name: "quote",
        class: "quote",
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: "titleText",
        class: "titleText",
        tag: "h1",
      },
    ]
  };
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ShareArticlePopupComponent>,
    public sharedService: SharedService,
    public cdr: ChangeDetectorRef
  ) {
    this.popupData = data;
  }

  submit(){
    let $t = this;
    $t.popupData.post.shareArticle = $t.htmlContent;
    $t.popupData.onSubmit($t.popupData.post);
    $t.dialogRef.close();
  }

  ngOnInit(): void {}
}
