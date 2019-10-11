/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import {Component, OnInit} from '@angular/core';
import {AnalyticsService} from './@core/utils/analytics.service';
import {AgentsService} from './agents.service';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {

      constructor(private analytics: AnalyticsService,
              private agentsService: AgentsService) {
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
    this.agentsService.findAll().subscribe(response => {
      if (response.data) {
        localStorage.removeItem('agentes_snmp');
        this.agentsService.agentes = response.data.agents;
        console.log(this.agentsService.agentes, '-----------------------------------------');
        localStorage.setItem('agentes_snmp', JSON.stringify(this.agentsService.agentes));
      }
    }, error => {
      console.log(error);
    });
  }
}
