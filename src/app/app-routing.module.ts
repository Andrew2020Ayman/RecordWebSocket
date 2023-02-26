import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RecordComponent } from './views/record/record.component';

const routes: Routes = [
  {path: '',redirectTo: 'record', pathMatch: 'full' }, 
  {path: 'record' , component: RecordComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
