import { ActivatedRoute } from '@angular/router'
import { AgentsService } from '../../../agents.service'
import { Component, OnDestroy } from '@angular/core'
import { delay } from 'rxjs/operators'
import { DiskModel } from './../../../models/disk'
import { forkJoin } from 'rxjs'
import { MemoryModel } from './../../../models/memory'
import {
  NbThemeService,
  NbToastrService,
  NbComponentStatus,
  NbGlobalPhysicalPosition,
} from '@nebular/theme';

@Component({
  selector: 'ngx-memory',
  styleUrls: ['./memoria.component.scss'],
  templateUrl: './memoria.component.html',
})
export class MemoryComponent implements OnDestroy {
  optionsSwap: any = {};
  optionsReal: any = {};
  themeSubscription: any;
  echartsIntance: any;
  isCharge: boolean = true;
  memoryModel: MemoryModel = new MemoryModel();
  metrics = [
    '.1.3.6.1.4.1.2021.4.3.0',
    '.1.3.6.1.4.1.2021.4.4.0',
    '.1.3.6.1.4.1.2021.4.5.0',
    '.1.3.6.1.4.1.2021.4.6.0',
    '.1.3.6.1.4.1.2021.4.11.0',
    '.1.3.6.1.4.1.2021.4.13.0',
    '.1.3.6.1.4.1.2021.4.14.0',
    '.1.3.6.1.4.1.2021.4.15.0',
  ];
  swapData = [
    {
      value: 20,
      name: 'Usada',
    },
    { value: 32, name: 'Disponible' },
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
    Object.assign(this.memoryModel, response.data);
    if (this.memoryModel.avail_swap && this.memoryModel.total_swap) {
      this.chargeSwapChart();
    }

    if (this.memoryModel.total_real && this.memoryModel.avail_real) {
      this.chargeRealChar();
    }
  }

  onChartInit(ec) {
    this.echartsIntance = ec;
  }

  ngAfterViewInit() {}

  chargeSwapChart() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.optionsSwap = {
        backgroundColor: echarts.bg,
        color: [
          colors.warningLight,
          colors.infoLight,
          colors.dangerLight,
          colors.successLight,
          colors.primaryLight,
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Usada', 'Disponible'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Memoria',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              {
                value:
                  this.memoryModel.total_swap - this.memoryModel.avail_swap,
                name: 'Usada',
              },
              {
                value: this.memoryModel.avail_swap,
                name: 'Disponible',
              },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  chargeRealChar() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors = config.variables;
      const echarts: any = config.variables.echarts;

      this.optionsReal = {
        backgroundColor: echarts.bg,
        color: [
          colors.warningLight,
          colors.infoLight,
          colors.dangerLight,
          colors.successLight,
          colors.primaryLight,
        ],
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          left: 'left',
          data: ['Usada', 'Disponible'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        series: [
          {
            name: 'Memoria',
            type: 'pie',
            radius: '80%',
            center: ['50%', '50%'],
            data: [
              {
                value:
                  this.memoryModel.total_real - this.memoryModel.avail_real,
                name: 'Usada',
              },
              { value: this.memoryModel.avail_real, name: 'Disponible' },
            ],
            itemStyle: {
              emphasis: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: echarts.itemHoverShadowColor,
              },
            },
            label: {
              normal: {
                textStyle: {
                  color: echarts.textColor,
                },
              },
            },
            labelLine: {
              normal: {
                lineStyle: {
                  color: echarts.axisLineColor,
                },
              },
            },
          },
        ],
      };
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription ? this.themeSubscription.unsubscribe() : null;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      console.log('update');
      this.memoryModel = new MemoryModel();
      this.getAll();
    });
  }

  makeToast() {
    this.showToast(
      'danger',
      'Error',
      'No se pudo obtener los datos del la memoria',
    );
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
