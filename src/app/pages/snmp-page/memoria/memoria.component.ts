import { AgentsService } from '../../../agents.service'
import { Component, OnDestroy } from '@angular/core'
import { delay } from 'rxjs/operators'
import { MemoryModel } from './../../../models/memory'
import { NbThemeService } from '@nebular/theme'

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
  ) {
    this.getAll();
  }

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
    this.themeSubscription.unsubscribe();
  }
}
