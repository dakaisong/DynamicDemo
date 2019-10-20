import {
  Component,
  ViewChild,
  ViewContainerRef,
  Compiler,
  Injector,
  NgModule,
  ComponentFactory,
  Input,
  OnInit
} from "@angular/core";

import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { HtmlElement, subElement } from "../model/htmlElement";

@Component({
  selector: "app-dynamic",
  templateUrl: "./dynamic.component.html",
  styleUrls: ["./dynamic.component.scss"]
})
export class DynamicComponent {
  @ViewChild("dmroom", { read: ViewContainerRef }) dmRoom: ViewContainerRef;
  //Html json should be from http request
  componetJson = {
    data: [
      {
        h2: "hello1",
        h5: "This is Hello World 1",
        p: "this is example"
      },
      {
        h2: "hello2",
        h5: "This is Hello World 2",
        p: "this is example"
      },
      {
        h2: "hello3",
        h5: "This is Hello World 3",
        p: "this is example"
      }
    ],
    selectorName: "my-selector",
    tag: "div",
    class: "main",
    style: "",
    subDiv: [
      {
        tag: "h2",
        class: "",
        style: "",
        value: true
      },
      {
        tag: "h5",
        class: "",
        style: "",
        value: true
      },
      {
        tag: "div",
        class: "fakeimg",
        style: "height:200px;background:grey;",
        value: false
      },
      {
        tag: "p",
        class: "",
        style: "",
        value: true
      }
    ]
  };

  constructor(private compiler: Compiler) {}

  createComponent() {
    let template = this.prepareTemplate(this.componetJson);
    this.createModule(this.compiler, template).then(factory => {
      const inject = Injector.create({
        providers: [],
        parent: this.dmRoom.injector
      });
      let cmpRef = this.dmRoom.createComponent(factory, 0, inject, []);
      // send data to input of component
      cmpRef.instance.var1 = this.componetJson.data;
      console.log("the instance is " + cmpRef.instance.var1);
    });
  }

  async createModule(
    compiler: Compiler,
    templateP: any
  ): Promise<ComponentFactory<any>> {
    @Component({
      selector: "app-dynamic",
      template: templateP
    })
    class DyCom implements OnInit {
      @Input() var1: any;
      list: any;
      constructor() {}

      ngOnInit() {
        console.log(this.var1);
        this.list = this.var1;
      }
    }

    @NgModule({
      imports: [CommonModule, RouterModule],
      declarations: [DyCom]
    })
    class DyModule {}
    //create dynamic module
    const moduleWithComponentFactory = await compiler.compileModuleAndAllComponentsAsync(
      DyModule
    );

    return moduleWithComponentFactory.componentFactories.find(
      x => x.componentType === DyCom
    );
  }

  //Create selector tampalte
  prepareTemplate(htmlTamplateP: HtmlElement) {
    let htmlStruct: HtmlElement = htmlTamplateP;
    let template = "";

    if (htmlStruct.tag !== null) {
      template += "<" + htmlStruct.tag;
      template += htmlStruct.class ? " class= '" + htmlStruct.class + "'" : "";
      template += htmlStruct.class ? " style= '" + htmlStruct.style + "'" : "";
      if (htmlStruct.data.length > 0) {
        template += ' *ngFor =" let item of list "';
      }
      template += ">";
      if (htmlStruct.data.length > 0) {
        for (const el of htmlStruct.subDiv) {
          for (const key in htmlStruct.data[0]) {
            // send each props to sub element
            if (el["tag"] === key && el["value"]) {
              template += this.prepareSubDiv(el, key);
            } else if (!el["value"]) {
              template += this.prepareSubDiv(el);
            }
          }
        }
      }

      template += "</" + htmlStruct.tag + ">";
    }
    return template;
  }

  //Generate sub div element
  prepareSubDiv(htmlTamplateP: subElement, dataP?: any) {
    let data = dataP;
    let subElement = htmlTamplateP;
    let template = "";
    template += "<" + subElement.tag;
    template += subElement.class ? " class= '" + subElement.class + "'" : "";
    template += subElement.class ? " style= '" + subElement.style + "'" : "";
    template += ">";
    template += "{{ item." + data + "}}";
    template += "</" + subElement.tag + ">";

    return template;
  }
}
