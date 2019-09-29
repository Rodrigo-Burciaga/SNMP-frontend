import { AgentsService } from '../../../agents.service'
import { Component, OnDestroy } from '@angular/core'
import { CPUModel } from '../../../models/cpu'
import { delay } from 'rxjs/operators'
import { NbThemeService } from '@nebular/theme'

@Component({
  selector: 'ngx-cpu',
  styleUrls: ['./cpu.component.scss'],
  templateUrl: './cpu.component.html',
})
export class CPUComponent implements OnDestroy {
  cpuModel: CPUModel = new CPUModel();
  metrics = [
    '.1.3.6.1.4.1.2021.11.50.0',
    '.1.3.6.1.4.1.2021.11.53.0',
    '.1.3.6.1.4.1.2021.11.52.0',
    '.1.3.6.1.4.1.2021.11.51.0',
  ];

  actualizar() {
    this.getAll();
  }

  getAll() {
    this.metrics.forEach(oid => {
      this.agentsService.getMetric(oid).subscribe(
        data => {
          this.parseResponse(data);
        },
        error => console.log(error),
      );
    });
  }

  parseResponse(response) {
    Object.assign(this.cpuModel, response.data);
  }

  constructor(
    private theme: NbThemeService,
    private agentsService: AgentsService,
  ) {
    this.getAll();
  }

  ngOnDestroy() {}
}
