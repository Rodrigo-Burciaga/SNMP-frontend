import { NbMenuItem } from '@nebular/theme'

export const MENU_ITEMS: NbMenuItem[] = [
  {
    title: 'AGENTES',
    icon: 'people-outline',
    group: true,
  },
  {
    title: 'Snmp',
    icon: 'home-outline',
    link: '/pages/snmp',
  },
  {
    title: 'Add Agents',
    target: '_blank',
    icon: 'plus-outline',
    link: '/pages/snmp',
  },
];
