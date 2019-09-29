import { DashboardModule } from './dashboard/dashboard.module'
import { ECommerceModule } from './e-commerce/e-commerce.module'
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module'
import { NbCardModule, NbMenuModule } from '@nebular/theme'
import { NgModule } from '@angular/core'
import { PagesComponent } from './pages.component'
import { PagesRoutingModule } from './pages-routing.module'
import { SnmpPageModule } from './snmp-page/snmp-page.module'
import { ThemeModule } from '../@theme/theme.module'

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    SnmpPageModule,
    NbCardModule,
  ],
  declarations: [PagesComponent],
  entryComponents: [],
})
export class PagesModule {}
