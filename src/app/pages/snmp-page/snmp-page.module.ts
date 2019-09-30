import { CommonModule } from '@angular/common'
import { CPUComponent } from './cpu/cpu.component'
import { DiskComponent } from './disk/disk.component'
import { DiskHComponent } from './disk-history/disk-h.component'
import { FormsModule } from '@angular/forms'
import { HistoryComponent } from './history/history.component'
import { LoadComponent } from './load/load.component'
import { MemoryComponent } from './memoria/memoria.component'
import { NgModule } from '@angular/core'
import { NgxEchartsModule } from 'ngx-echarts'
import { RamHComponent } from './ram-history/ram-h.component'
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
import { MemoryHComponent } from './memory-history copy/memory-h.component';

@NgModule({
  declarations: [
    SnmpPageComponent,
    SystemComponent,
    MemoryComponent,
    DiskComponent,
    CPUComponent,
    LoadComponent,
    HistoryComponent,
    DiskHComponent,
    RamHComponent,
    MemoryHComponent,
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
