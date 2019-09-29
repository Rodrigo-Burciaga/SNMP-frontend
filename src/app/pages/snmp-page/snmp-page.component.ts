import { ActivatedRoute, Router } from '@angular/router'
import { Agent } from '../../models/agent'
import { AgentsService } from '../../agents.service'
import { Component, OnInit } from '@angular/core'
import { NbMenuService } from '@nebular/theme'

@Component({
  selector: 'ngx-snmp-page',
  templateUrl: './snmp-page.component.html',
  styleUrls: ['./snmp-page.component.scss'],
})
export class SnmpPageComponent {
  agente: Agent = new Agent();
  isNew: boolean;
  agentes: Agent[];
  constructor(
    private route: ActivatedRoute,
    private menuService: NbMenuService,
    private agentsService: AgentsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      if (params.params.id) {
        localStorage.setItem('snmp_agent_id', params.params.id);
        this.isNew = false;
      } else {
        this.isNew = true;
      }
    });
  }

  createAgent() {
    console.log(this.agente);

    this.agentsService.addAgent(this.agente).subscribe(
      data => {
        this.agentes = JSON.parse(localStorage.getItem('agentes_snmp'));
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
}
