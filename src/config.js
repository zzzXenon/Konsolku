import homeTemplate from './app/home/home.html?raw';
import cHome from './app/home/home.js';
import roleTemplate from './app/role/role.html?raw';
import cRole from './app/role/role.js';

export const appConfig = [
  {
    label: 'Home',
    state: 'home',
    url: '/home',
    template: homeTemplate,
    controller: cHome,
    icon: 'fa fa-home'
  },
  {
    label: 'Role',
    state: 'role',
    url: '/role',
    template: roleTemplate,
    controller: cRole,
    icon: 'fa fa-person'
  }
];