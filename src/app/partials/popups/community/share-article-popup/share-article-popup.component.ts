import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SharedService } from '@app/services/shared.service';
import { Editor } from 'ngx-editor';

@Component({
  selector: 'app-share-article-popup',
  templateUrl: './share-article-popup.component.html',
  styleUrls: ['./share-article-popup.component.scss'],
})

export class ShareArticlePopupComponent implements OnInit {
  public editor: Editor;
  public htmlContent = '';
  public popupData: any;
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

  ngOnInit(): void {
    this.editor = new Editor();
  }

  ngOnDestroy(): void {
    this.editor.destroy();
  }
}
