import { Agent } from '../models/agent'
import { Component, TemplateRef } from '@angular/core'
import { MENU_ITEMS } from './pages-menu'
import { NbDialogService } from '@nebular/theme'
import { NbMenuService } from '@nebular/theme'
@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu" tag="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  menu = MENU_ITEMS;
  agentes: Agent[];
  constructor(
    menu: NbMenuService,
    private menuService: NbMenuService,
    private dialogService: NbDialogService,
  ) {
    menu.onItemClick().subscribe(item => {
      console.log(item);
    });
    const menuAgentes: any[] = new Array();
    if (localStorage.getItem('agentes_snmp')) {
      this.agentes = JSON.parse(localStorage.getItem('agentes_snmp'));
      this.agentes.forEach(agent => {
        // this.addMenuItem(agent);
        menuAgentes.push({
          title: `Agente ${agent.name}`,
          target: '_blank',
          icon: 'person-outline',
          link: `/pages/snmp/${agent.id_agent}`,
        });
      });
      console.log(menuAgentes);
      // this.addMenuItem()
      this.menuService.addItems(menuAgentes, 'menu');
    }
  }

  addMenuItem(agente: Agent) {
    console.log('add item');
    console.log(agente);
    this.menuService.addItems(
      [
        {
          title: `Agente ${agente.name}`,
          target: '_blank',
          icon: 'person-outline',
          link: `/pages/snmp/${agente.id_agent}`,
        },
      ],
      'menu',
    );
  }
}
