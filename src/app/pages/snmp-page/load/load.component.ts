import { AgentsService } from '../../../agents.service'
import { Component, OnDestroy } from '@angular/core'
import { delay } from 'rxjs/operators'
import { LoadModel } from './../../../models/load'
import { NbThemeService } from '@nebular/theme'

@Component({
  selector: 'ngx-load',
  styleUrls: ['./load.component.scss'],
  templateUrl: './load.component.html',
})
export class LoadComponent implements OnDestroy {
  loadModel: LoadModel = new LoadModel();
  metrics = [
    '.1.3.6.1.4.1.2021.10.1.3.1',
    '.1.3.6.1.4.1.2021.10.1.3.2',
    '.1.3.6.1.4.1.2021.10.1.3.3',
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
    Object.assign(this.loadModel, response.data);
    console.log(this.loadModel);
  }

  constructor(
    private theme: NbThemeService,
    private agentsService: AgentsService,
  ) {
    this.getAll();
  }

  ngOnDestroy() {}
}
