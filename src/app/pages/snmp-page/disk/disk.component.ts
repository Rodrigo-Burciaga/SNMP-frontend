import { ActivatedRoute } from '@angular/router'
import { AgentsService } from '../../../agents.service'
import { Component, OnDestroy } from '@angular/core'
import { delay } from 'rxjs/operators'
import { DiskModel } from './../../../models/disk'
import { forkJoin } from 'rxjs'
import {
  NbThemeService,
  NbToastrService,
  NbGlobalPhysicalPosition,
  NbComponentStatus,
} from '@nebular/theme';

@Component({
  selector: 'ngx-disk',
  styleUrls: ['./disk.component.scss'],
  templateUrl: './disk.component.html',
})
export class DiskComponent implements OnDestroy {
  private alive = true;
  diskModel: DiskModel = new DiskModel();
  isCharge: boolean = true;
  metrics = [
    // '.1.3.6.1.4.1.2021.9.1.2.1',
    '.1.3.6.1.4.1.2021.9.1.7.3',
    '.1.3.6.1.4.1.2021.9.1.6.3',
    '.1.3.6.1.4.1.2021.9.1.8.3',
    '.1.3.6.1.4.1.2021.9.1.9.3',
  ];
  data;
  value = 30;
  option: any = {};
  themeSubscription: any;

  actualizar() {
    this.getAll();
  }

  createFork() {
    return forkJoin(
      this.metrics.map(oid => {
        return this.agentsService.getMetric(oid);
      }),
    );
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
    Object.assign(this.diskModel, response.data);
    if (this.diskModel.disk_percent) {
      this.value = this.diskModel.disk_percent;
      this.chargeDiskChart();
    }
  }

  set chartValue(value: number) {
    this.value = value;

    if (this.option.series) {
      this.option.series[0].data[0].value = value;
      this.option.series[0].data[1].value = 100 - value;
      this.option.series[1].data[0].value = value;
    }
  }

  constructor(
    private theme: NbThemeService,
    private agentsService: AgentsService,
    private activeRoute: ActivatedRoute,
    private toastrService: NbToastrService,
  ) {
    // this.getAll();
  }

  chargeDiskChart() {
    this.themeSubscription = this.theme
      .getJsTheme()
      .pipe(delay(1))
      .subscribe(config => {
        const solarTheme: any = config.variables.solar;

        this.option = Object.assign(
          {},
          {
            tooltip: {
              trigger: 'item',
              formatter: '{a} <br/>{b} : {c} ({d}%)',
            },
            series: [
              {
                name: ' ',
                clockWise: true,
                hoverAnimation: false,
                type: 'pie',
                center: ['45%', '50%'],
                radius: solarTheme.radius,
                data: [
                  {
                    value: this.value,
                    name: ' ',
                    label: {
                      normal: {
                        position: 'center',
                        formatter: '{d}%',
                        textStyle: {
                          fontSize: '22',
                          fontFamily: config.variables.fontSecondary,
                          fontWeight: '600',
                          color: config.variables.fgHeading,
                        },
                      },
                    },
                    tooltip: {
                      show: false,
                    },
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: solarTheme.gradientLeft,
                          },
                          {
                            offset: 1,
                            color: solarTheme.gradientRight,
                          },
                        ]),
                        shadowColor: solarTheme.shadowColor,
                        shadowBlur: 0,
                        shadowOffsetX: 0,
                        shadowOffsetY: 3,
                      },
                    },
                    hoverAnimation: false,
                  },
                  {
                    value: 100 - this.value,
                    name: ' ',
                    tooltip: {
                      show: false,
                    },
                    label: {
                      normal: {
                        position: 'inner',
                      },
                    },
                    itemStyle: {
                      normal: {
                        color: solarTheme.secondSeriesFill,
                      },
                    },
                  },
                ],
              },
              {
                name: ' ',
                clockWise: true,
                hoverAnimation: false,
                type: 'pie',
                center: ['45%', '50%'],
                radius: solarTheme.radius,
                data: [
                  {
                    value: this.value,
                    name: ' ',
                    label: {
                      normal: {
                        position: 'inner',
                        show: false,
                      },
                    },
                    tooltip: {
                      show: false,
                    },
                    itemStyle: {
                      normal: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                          {
                            offset: 0,
                            color: solarTheme.gradientLeft,
                          },
                          {
                            offset: 1,
                            color: solarTheme.gradientRight,
                          },
                        ]),
                        shadowColor: solarTheme.shadowColor,
                        shadowBlur: 7,
                      },
                    },
                    hoverAnimation: false,
                  },
                  {
                    value: 28,
                    name: ' ',
                    tooltip: {
                      show: false,
                    },
                    label: {
                      normal: {
                        position: 'inner',
                      },
                    },
                    itemStyle: {
                      normal: {
                        color: 'none',
                      },
                    },
                  },
                ],
              },
            ],
          },
        );
      });
  }

  ngOnDestroy() {
    this.alive = false;
    this.themeSubscription ? this.themeSubscription.unsubscribe() : null;
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      console.log('update');
      this.diskModel = new DiskModel();
      this.value = 0;
      this.getAll();
    });
  }

  makeToast() {
    this.showToast('danger', 'Error', 'No se pudo obtener los datos del disco');
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
