import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrderComponent} from "./order/order.component";
import {CartComponent} from "./cart/cart.component";

const routes: Routes = [
  {path: 'cart', component: CartComponent},
  {path: 'order', component: OrderComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class OrderRoutingModule { }
