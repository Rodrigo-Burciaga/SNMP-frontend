import {ActivatedRoute} from '@angular/router';
import {AgentsService} from '../../../agents.service';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbComponentStatus, NbGlobalPhysicalPosition, NbThemeService, NbToastrService} from '@nebular/theme';

@Component({
  selector: 'ngx-load-h',
  styleUrls: ['./load-h.component.scss'],
  templateUrl: './load-h.component.html',
})
export class LoadHComponent implements OnDestroy, OnInit {
  charName = 'load';
  themeSubscription: any;
  options: any;
  optionsChar = [
    {value: '1', label: '5 minutos', checked: true},
    {value: '2', label: '15 minutos'},
    {value: '3', label: '1 hora'},
    {value: '4', label: '5 hora'},
    {value: '5', label: '1 dia'},
  ];

  isCharge: boolean;

  constructor(
    private theme: NbThemeService,
    private agentsService: AgentsService,
    private activeRoute: ActivatedRoute,
    private toastrService: NbToastrService,
  ) {
    // this.getAll();
  }

  actualizar() {
    // this.getAll();
  }

  getAll() {
    this.updateCharDisk(1);
  }

  parseResponse(response) {
    // Object.assign(this.cpuModel, response.data);
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      // console.log('update');
      // this.cpuModel = new CPUModel();
      this.getAll();
    });
  }

  updateCharDisk(e) {
    this.getDisk(e);
  }

  getDisk(time) {
    this.isCharge = true;
    this.agentsService.getLoadHistory(time).subscribe(
      res => {
        console.log(res);
        if (res.data) {
          const data = [];
          const tiempo = [];
          res.data.load.forEach(metric => {
            data.push(metric.load);
            tiempo.push(metric.date);
          });
          console.log(data);
          console.log(tiempo);
          this.showDiskChart(data, tiempo);
        } else {
          this.makeToast('No hay datos');
        }
        this.isCharge = false;
      },
      error => {
        this.makeToast('No se pudo obtener la informaciono de procesos');
        this.isCharge = true;
      },
    );
  }

  showDiskChart(data, time) {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {
      const colors: any = config.variables;
      const echarts: any = config.variables.echarts;

      this.options = {
        backgroundColor: echarts.bg,
        color: [
          colors.warningLight,
          colors.infoLight,
          colors.dangerLight,
          colors.successLight,
          colors.primaryLight,
        ],
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: echarts.tooltipBackgroundColor,
            },
          },
        },
        legend: {
          data: ['Carga'],
          textStyle: {
            color: echarts.textColor,
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            data: time,
            axisTick: {
              alignWithLabel: true,
            },
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisLine: {
              lineStyle: {
                color: echarts.axisLineColor,
              },
            },
            splitLine: {
              lineStyle: {
                color: echarts.splitLineColor,
              },
            },
            axisLabel: {
              textStyle: {
                color: echarts.textColor,
              },
            },
          },
        ],
        series: [
          {
            name: 'Carga',
            type: 'line',
            stack: 'Total amount',
            areaStyle: {normal: {opacity: echarts.areaOpacity}},
            data: data,
          },
        ],
      };
    });
  }

  makeToast(text: string) {
    this.showToast('danger', 'Error', text);
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
