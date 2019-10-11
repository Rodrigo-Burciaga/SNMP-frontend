import {ActivatedRoute} from '@angular/router';
import {AgentsService} from '../../../agents.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {CPUModel} from '../../../models/cpu';
import {forkJoin} from 'rxjs';
import {NbComponentStatus, NbGlobalPhysicalPosition, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-cpu',
  styleUrls: ['./cpu.component.scss'],
  templateUrl: './cpu.component.html',
})
export class CPUComponent implements OnDestroy, OnInit {
  cpuModel: CPUModel = new CPUModel();
  isCharge: boolean;
  metrics = [
    '.1.3.6.1.4.1.2021.11.50.0',
    '.1.3.6.1.4.1.2021.11.53.0',
    '.1.3.6.1.4.1.2021.11.52.0',
    '.1.3.6.1.4.1.2021.11.51.0',
  ];

  constructor(
    private agentsService: AgentsService,
    private activeRoute: ActivatedRoute,
    private toastrService: NbToastrService,
  ) {
    // this.getAll();
  }

  actualizar() {
    this.getAll();
  }

  getAll() {
    this.isCharge = true;
    forkJoin(
      this.metrics.map(oid => {
        return this.agentsService.getMetric(oid);
      }),
    ).subscribe(
      res => {
        res.forEach(data => {
          this.parseResponse(data);
        });
      },
      error => {
        this.makeToast();
        this.isCharge = false;
      },
      () => (this.isCharge = false),
    );
  }

  parseResponse(response) {
    Object.assign(this.cpuModel, response.data);
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      console.log('update');
      this.cpuModel = new CPUModel();
      this.getAll();
    });
  }

  makeToast() {
    this.showToast('danger', 'Error', 'No se pudo obtener los datos del CPU');
  }

  private showToast(type: NbComponentStatus, title: string, body: string) {
    const config = {
      status: type,
      destroyByClick: true,
      duration: 10000,
      hasIcon: true,
      position: NbGlobalPhysicalPosition.TOP_RIGHT,
      preventDuplicates: true,
    };
    const titleContent = title ? `${title}` : '';

    this.toastrService.show(body, `${titleContent}`, config);
  }
}
