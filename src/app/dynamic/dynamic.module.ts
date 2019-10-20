import { NgModule } from "@angular/core";

import { DynamicComponent } from "./dynamic.component";
import { DynamicModuleRoutingModule } from "./dynamic-routing.module";

@NgModule({
  declarations: [DynamicComponent],
  entryComponents: [],
  imports: [DynamicModuleRoutingModule]
})
export class DynamicModule {}
