import { CommonModule } from '@angular/common'
import { CPUComponent } from './cpu/cpu.component'
import { DiskComponent } from './disk/disk.component'
import { FormsModule } from '@angular/forms'
import { LoadComponent } from './load/load.component'
import { MemoryComponent } from './memoria/memoria.component'
import { NgModule } from '@angular/core'
import { NgxEchartsModule } from 'ngx-echarts'
import { SnmpPageComponent } from './snmp-page.component'
import { SystemComponent } from './system/system.component'
import { ThemeModule } from '../../@theme/theme.module'
import {
  NbCardModule,
  NbUserModule,
  NbButtonModule,
  NbTabsetModule,
  NbActionsModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbInputModule,
  NbSpinnerModule,
} from '@nebular/theme';

@NgModule({
  declarations: [
    SnmpPageComponent,
    SystemComponent,
    MemoryComponent,
    DiskComponent,
    CPUComponent,
    LoadComponent,
  ],
  imports: [
    NbInputModule,
    CommonModule,
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    NbSpinnerModule,
  ],
})
export class SnmpPageModule {}
