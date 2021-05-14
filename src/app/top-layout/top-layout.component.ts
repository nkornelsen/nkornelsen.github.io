import { Component, OnInit } from '@angular/core';

class TabData {
  id: Number;
  name: String;
  checked: boolean;

  constructor(id: Number, name: String, checked: boolean) {
    this.id = id;
    this.name = name;
    this.checked = checked;
  }
}

@Component({
  selector: 'app-top-layout',
  templateUrl: './top-layout.component.html',
  styleUrls: ['./top-layout.component.scss']
})
export class TopLayoutComponent implements OnInit {
  tabs: Array<TabData>;

  constructor() {
    this.tabs = [
      new TabData(0, "Projects", true)
    ];
  }

  ngOnInit(): void {
  }

}