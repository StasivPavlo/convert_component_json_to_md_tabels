import { createRequire } from 'module';
import { markdownTable } from 'markdown-table'
import fs from 'fs';

const requer = createRequire(import.meta.url);
const component = requer('./component.json');

const firstLaterToUpperCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const getProperty = (property) => {
  return [
    `${property.label}: \`${property.name}\``,
    firstLaterToUpperCase(property.type),
    property.defaultValue || ' ',
    property.hasLogicHandler ? property.handlerLabel : ' ',
    !!property.dataBinding,
    !!property.showInSettings,
    property.settingTooltip
  ]
}

const columns = ['Property', 'Type', 'Default Value', 'Logic', 'Data Binding', 'UI Setting', 'Description'];

const rows = component.properties.map(property => getProperty(property));

markdownTable([columns, ...rows]);

fs.writeFileSync('table.md', markdownTable([columns, ...rows]));
