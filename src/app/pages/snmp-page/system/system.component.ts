import { ActivatedRoute } from '@angular/router'
import { AgentsService } from './../../../agents.service'
import { Component, OnDestroy } from '@angular/core'
import { delay } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import { SystemModel } from './../../../models/system'
import {
  NbThemeService,
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';

@Component({
  selector: 'ngx-system',
  styleUrls: ['./system.component.scss'],
  templateUrl: './system.component.html',
})
export class SystemComponent implements OnDestroy {
  isCharge: boolean = true;
  private metrics = [
    '.1.3.6.1.2.1.1.3.0',
    '.1.3.6.1.2.1.1.4.0',
    '.1.3.6.1.2.1.1.5.0',
    '.1.3.6.1.2.1.1.6.0',
    // '.1.3.6.1.2.1.25.1.2.0',
    '.1.3.6.1.2.1.25.1.5.0',
    '.1.3.6.1.2.1.25.1.6.0',
    '.1.3.6.1.2.1.25.1.7.0',
  ];
  private toUpdate = [
    '.1.3.6.1.2.1.1.4.0', //contacto
    '.1.3.6.1.2.1.1.5.0', //Sysname
    '.1.3.6.1.2.1.1.6.0', //Location
  ];
  systemModel: SystemModel = new SystemModel();
  value = 70;
  option: any = {};
  themeSubscription: any;

  constructor(
    private theme: NbThemeService,
    private agentsService: AgentsService,
    private activeRoute: ActivatedRoute,
    private toastrService: NbToastrService,
  ) {
    // this.getAll();
  }

  updateSystem() {
    this.isCharge = true;
    const upContacto = this.agentsService.updateAgent(
      this.toUpdate[0],
      this.systemModel.system_contact,
    );
    const upSysName = this.agentsService.updateAgent(
      this.toUpdate[1],
      this.systemModel.system_name,
    );
    const upLocation = this.agentsService.updateAgent(
      this.toUpdate[2],
      this.systemModel.system_location,
    );
    forkJoin([upContacto, upSysName, upLocation]).subscribe(
      res => {
        console.log('update')
      },
      error => {
        this.makeToast();
        this.isCharge = false;
      },
      () => (this.isCharge = false),
    );
  }

  set chartValue(value: number) {
    this.value = value;

    if (this.option.series) {
      this.option.series[0].data[0].value = value;
      this.option.series[0].data[1].value = 100 - value;
      this.option.series[1].data[0].value = value;
    }
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
    Object.assign(this.systemModel, response.data);
    // console.log(this.systemModel);
  }

  ngAfterViewInit() {
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
    this.themeSubscription.unsubscribe();
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      console.log('update');
      this.systemModel = new SystemModel();
      this.getAll();
    });
  }

  makeToast() {
    this.showToast(
      'danger',
      'Error',
      'No se pudo obtener los datos del sistema',
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
