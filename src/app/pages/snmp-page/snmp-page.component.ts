import {ActivatedRoute, Router} from '@angular/router';
import {Agent} from '../../models/agent';
import {AgentsService} from '../../agents.service';
import {Component, OnInit} from '@angular/core';
import {NbMenuService} from '@nebular/theme';

interface Parametros {
  params: any;
}

@Component({
  selector: 'ngx-snmp-page',
  templateUrl: './snmp-page.component.html',
  styleUrls: ['./snmp-page.component.scss'],
})
export class SnmpPageComponent implements OnInit {
  agente: Agent = new Agent();
  isNew: boolean;
  showHistory: boolean = false;
  agentes: Agent[];

  constructor(
    private route: ActivatedRoute,
    private menuService: NbMenuService,
    private agentsService: AgentsService,
    private router: Router,
  ) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (this.route.snapshot.params['id']) {
        this.showHistory = false;
        localStorage.setItem('snmp_agent_id', this.route.snapshot.params['id']);
        this.agentes = JSON.parse(localStorage.getItem('agentes_snmp'));
        this.agente = this.agentes.find(
          a => a.id_agent === this.route.snapshot.params['id'],
        );
        this.isNew = false;
      } else {
        this.agente = new Agent();
        this.isNew = true;
      }
    });
  }

  createAgent() {
    console.log(this.agente);

    this.agentsService.addAgent(this.agente).subscribe(
      data => {
        this.agentes = [] || JSON.parse(localStorage.getItem('agentes_snmp'));
        this.agente.id_agent = data.data.id;
        this.agentes.push(this.agente);
        localStorage.setItem('agentes_snmp', JSON.stringify(this.agentes));

        this.menuService.addItems(
          [
            {
              title: `Agente ${this.agente.name}`,
              target: '_blank',
              icon: 'person-outline',
              link: `/pages/snmp/${this.agente.id_agent}`,
            },
          ],
          'menu',
        );
        this.router.navigateByUrl(`/pages/snmp/${this.agente.id_agent}`);
      },
      error => console.log(error),
    );
  }

  updateAgent(id_agent) {
    // localStorage.setItem('snmp_agent_id', id_agent);
    // const agentes = JSON.parse(localStorage.getItem('agentes_snmp'));
    // const agente = this.agentes.find(a => a.id_agent === id_agent);
    // const index = this.agentes.findIndex(
    //   item => item.id_agent == agente.id_agent,
    // );
    // console.log(agente);
    // console.log(this.agente);
    // console.log(this.agentes);
    localStorage.setItem('agentes_snmp', JSON.stringify(this.agentes));
    this.router.navigateByUrl(`/pages/snmp/`);
    // this.router.navigateByUrl(`/pages/snmp/${this.agente.id_agent}`);
    // console.log(index);
  }

  showHistorial() {
    this.showHistory = !this.showHistory;
  }
}
