import {ActivatedRoute} from '@angular/router';
import {AgentsService} from '../../../agents.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {forkJoin} from 'rxjs';
import {LoadModel} from '../../../models/load';
import {NbComponentStatus, NbGlobalPhysicalPosition, NbThemeService, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-load',
  styleUrls: ['./load.component.scss'],
  templateUrl: './load.component.html',
})
export class LoadComponent implements OnDestroy, OnInit {
  loadModel: LoadModel = new LoadModel();
  isCharge: boolean = true;
  metrics = [
    '.1.3.6.1.4.1.2021.10.1.3.1',
    '.1.3.6.1.4.1.2021.10.1.3.2',
    '.1.3.6.1.4.1.2021.10.1.3.3',
  ];

  constructor(
    private theme: NbThemeService,
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
    Object.assign(this.loadModel, response.data);
    console.log(this.loadModel);
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      console.log('update');
      this.loadModel = new LoadModel();
      this.getAll();
    });
  }

  ngOnDestroy() {
  }

  makeToast() {
    this.showToast('danger', 'Error', 'No se pudo obtener los datos de carga');
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
