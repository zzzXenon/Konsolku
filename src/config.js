import homeTemplate from './app/home/home.html?raw';
import cHome from './app/home/home.js';
import userTemplate from './app/user/user.html?raw';
import cUser from './app/user/user.js';
import personTemplate from './app/person/person.html?raw';
import cPerson from './app/person/person.js';
import roleTemplate from './app/role/role.html?raw';
import cRole from './app/role/role.js';
import featureTemplate from './app/feature/feature.html?raw';
import cFeature from './app/feature/feature.js';
import enumTemplate from './app/enum/enum.html?raw';
import cEnum from './app/enum/enum.js';
import flagTemplate from './app/flag/flag.html?raw';
import cFlag from './app/flag/flag.js';

export const appConfig = [
  {
    label: 'Home',
    state: 'home',
    url: '/home',
    template: homeTemplate,
    controller: cHome,
    icon: 'fa-solid fa-house'
  },
  {
    label: 'Enum & Flag',
    children: [
      {
        label: 'Enum',
        state: 'enum',
        url: '/enum',
        template: enumTemplate,
        controller: cEnum,
        icon: 'fa-solid fa-tags'
      },
      {
        label: 'Flag',
        state: 'flag',
        url: '/flag',
        template: flagTemplate,
        controller: cFlag,
        icon: 'fa-solid fa-tags'
      }
    ]
  },
  {
    label: 'User Management',
    icon: '👥',
    children: [
      {
        label: 'User',
        state: 'user',
        url: '/user',
        template: userTemplate,
        controller: cUser,
        icon: 'fa-solid fa-user'
      },
      {
        label: 'Person',
        state: 'person',
        url: '/person',
        template: personTemplate,
        controller: cPerson,
        icon: 'fa-solid fa-people-group'
      },
      {
        label: 'Role',
        state: 'role',
        url: '/role',
        template: roleTemplate,
        controller: cRole,
        icon: 'fa-solid fa-user-tag'
      },
      {
        label: 'Feature',
        state: 'feature',
        url: '/feature',
        template: featureTemplate,
        controller: cFeature,
        icon: 'fa-solid fa-table'
      }
    ]
  },
];