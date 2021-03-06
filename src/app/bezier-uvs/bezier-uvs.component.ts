import { Component, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-bezier-uvs',
  templateUrl: './bezier-uvs.component.html',
  styleUrls: ['./bezier-uvs.component.scss']
})
export class BezierUvsComponent implements OnInit {

  outputTypes = [
    {value: "bezier",
    viewValue: "Bezier Derivative"}, 
    {value: "distance",
    viewValue: "Distance to Curve"}, 
    {value: "coords",
    viewValue: "Coordinates of Points"}, 
    {value: "length",
    viewValue: "Length Along Curve + Offsets"}
  ];

  selectedOutput: any;
  wasm: any;
  wasmPromise: Promise<any>;
  loading: boolean;
  width: number = 255;
  height: number = 255;
  currentlyProcessing: boolean = false;
  worker: Worker | null;
  generated_images: any;
  fileResult: String = `4
-1 -1 1
1 -1 1
-1 1 1
1 1 1
2
1 (0, 1) 2 (1, 0) 0 (1, 1) 
1 (0, 1) 3 (0, 0) 2 (1, 0) 
1
((-1.1589628458023071, -1.6762653589248657, 1), (-0.6589628458023071, -1.1762653589248657, 1), (2.4685609340667725, 1.3283957242965698, 1)) ((-3.308171272277832, 1.3792165517807007, 1), (1.7162351608276367, -1.2275062799453735, 1), (2.963348150253296, 0.1608094573020935, 1))`;
  mainImage: SafeUrl | null = null;
  auxImage: SafeUrl | null = null;

  @ViewChild('fileInput') fileInput: any;

  constructor(private sanitizer: DomSanitizer) { 
    this.loading = true;
    this.wasmPromise = import("../../../vector-to-mesh-uv/pkg");
    this.wasmPromise.then(x => {
      this.loading = false;
      this.wasm = x;
    })
    .catch(err => console.error(err));

    if (typeof Worker !== 'undefined') {
      // Create a new
      this.worker = new Worker('./bezier-uvs.worker', { type: 'module' });
      this.worker.onmessage = ({ data }) => {
        this.generated_images = data;
        this.onGenerationComplete();
      };
    } else {
      this.worker = null;
    }
  }

  ngOnInit(): void {
    this.selectedOutput = this.outputTypes[0].value;
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
      }
      reader.readAsArrayBuffer(this.fileInput.nativeElement.files[0]);
    }
  }

  onGenerateImages() {
    if (this.fileResult && this.fileResult !== "") {
      this.mainImage = null;
      this.auxImage = null;
      this.currentlyProcessing = true;
      if (this.worker !== null) {
        this.worker.postMessage({
          fileResult: this.fileResult,
          selectedOutput: this.selectedOutput,
          width: this.width,
          height: this.height
        });
      } else {
        this.generated_images = this.wasm.generate_images(this.fileResult, this.selectedOutput, this.width, this.height);
        this.onGenerationComplete();
      }
    }
  }

  onGenerationComplete() {
    this.currentlyProcessing = false;
    if (this.generated_images) {
      if (this.generated_images.main !== null) {
        let image = new Blob([this.generated_images.main.buffer], {type: "image/png"});
        
        this.mainImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image));
      }
      if (this.generated_images.aux !== null) {
        let image = new Blob([this.generated_images.aux.buffer], {type: "image/png"});
        
        this.auxImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image));
      }
        
    }
  }

}