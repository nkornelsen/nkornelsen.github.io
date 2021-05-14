import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-bezier-uvs',
  templateUrl: './bezier-uvs.component.html',
  styleUrls: ['./bezier-uvs.component.scss']
})
export class BezierUvsComponent implements OnInit {

  wasm: any;
  wasmPromise: Promise<any>;
  loading: boolean;
  fileResult: String = `4
-1.0 -1.0 0.0
1.0 -1.0 0.0
-1.0 1.0 0.0
1.0 1.0 0.0
2
1 (0.00010006938828155398, 0.9999000430107117) 2 (0.9998998045921326, 0.00009997999586630613) 0 (0.9998999238014221, 0.9998998045921326) 
1 (0.00010006938828155398, 0.9999000430107117) 3 (0.00009997999586630613, 0.00010013096471084282) 2 (0.9998998045921326, 0.00009997999586630613) 
1
((-1.1589628458023071, -1.6762653589248657, 0.0), (-0.6589628458023071, -1.1762653589248657, 0.0), (2.4685609340667725, 1.3283957242965698, 0.0)) ((-3.308171272277832, 1.3792165517807007, 0.0), (1.7162351608276367, -1.2275062799453735, 0.0), (2.963348150253296, 0.1608094573020935, 0.0))`;
  mainImage: SafeUrl | null = null;
  auxImage: string | null = null;

  @ViewChild('fileInput') fileInput: any;

  constructor(private sanitizer: DomSanitizer) { 
    this.loading = true;
    this.wasmPromise = import("../../../vector-to-mesh-uv/pkg");
    this.wasmPromise.then(x => {
      this.loading = false;
      this.wasm = x;
      console.dir(this.wasm);
    })
    .catch(err => console.error(err));
  }

  ngOnInit(): void {
  }

  say_hello(): void {
    this.wasm.greet();
  }

  onFileSelected() {
    if (typeof(FileReader) !== 'undefined' && typeof(TextDecoder) !== 'undefined') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        
        const decoder = new TextDecoder();
        
        this.fileResult = decoder.decode(e.target.result);
        console.log(this.fileResult);
      }
      reader.readAsArrayBuffer(this.fileInput.nativeElement.files[0]);
    }
  }

  onGenerateImages() {
    if (this.fileResult && this.fileResult !== "") {
      let generated_images = this.wasm.generate_images(this.fileResult);
      if (generated_images.main !== null) {
        let image = new Blob([generated_images.main.buffer], {type: "image/png"});
        
        this.mainImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image));
        console.dir(image);
      }
    }
  }

}