import { ActivatedRoute } from '@angular/router'
import { AgentsService } from '../../../agents.service'
import { Component, OnDestroy } from '@angular/core'
import { CPUModel } from '../../../models/cpu'
import { delay } from 'rxjs/operators'
import { forkJoin } from 'rxjs'
import {
  NbThemeService,
  NbComponentStatus,
  NbGlobalPhysicalPosition,
  NbToastrService,
} from '@nebular/theme';

@Component({
  selector: 'ngx-disk-h',
  styleUrls: ['./disk-h.component.scss'],
  templateUrl: './disk-h.component.html',
})
export class DiskHComponent implements OnDestroy {
  charName = 'disk';
  themeSubscription: any;
  options: any;
  optionsChar = [
    { value: '1', label: 'Option 1', checked: true },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' },
    { value: '4', label: 'Option 4' },
    { value: '4', label: 'Option 5' },
  ];

  isCharge: boolean;

  actualizar() {
    // this.getAll();
  }

  getAll() {
    this.updateCharDisk(1);
  }

  parseResponse(response) {
    // Object.assign(this.cpuModel, response.data);
  }

  constructor(
    private theme: NbThemeService,
    private agentsService: AgentsService,
    private activeRoute: ActivatedRoute,
    private toastrService: NbToastrService,
  ) {
    // this.getAll();
  }

  ngOnDestroy() {}

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
    this.agentsService.getDiskHistory(time).subscribe(
      res => {
        console.log(res);
        if (res.data) {
          const data = new Array();
          const time = new Array();
          res.data.disk.forEach(metric => {
            data.push(metric.avail_disk / 1000000);
            time.push(metric.date);
          });
          console.log(data);
          console.log(time);
          this.showDiskChart(data, time);
        } else {
          this.makeToast('No hay datos');
        }
      },
      error => this.makeToast('No se pudo obtener la informaciono de procesos'),
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
          data: ['Procesos'],
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
            name: 'Mail marketing',
            type: 'line',
            stack: 'Total amount',
            areaStyle: { normal: { opacity: echarts.areaOpacity } },
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
