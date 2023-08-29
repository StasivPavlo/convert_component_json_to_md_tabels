import { createRequire } from 'module';
import { markdownTable } from 'markdown-table'
import fs from 'fs';

const requer = createRequire(import.meta.url);
const component = requer('./component.json');

const firstLaterToUpperCase = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const getSelectOptions = (options) => {
  return options.map(option => {
    return `${option.label}: \`${option.value}\``;
  }).join(', ');
};

const getPropertyTypeHandler = (property) => {
  if (property.type === 'select') {
    return firstLaterToUpperCase(property.type) + ' ' + `[${ getSelectOptions(property.options) }]`;
  }

  return firstLaterToUpperCase(property.type);
};

const getDefaultValue = (property) => {
  switch (property.type) {
    case 'color': return property.defaultValue ? `\"${property.defaultValue}\"` : '';
    case 'text': return property.defaultValue ? `\"${property.defaultValue}\"` : '';
    case 'number': return property.defaultValue ? `${property.defaultValue}` : '';
    case 'checkbox': return property.defaultValue ? `\`${property.defaultValue}\`` : '\`false\`';
    case 'select':
      const selectedOption = property.options.find(option => option.value === property.defaultValue);

      return `${selectedOption.label}: \`${selectedOption.value}\``;
    default: return property.defaultValue;
  }
}

const getProperty = (property) => {
  return [
    `${property.label}: \`${property.name}\``,
    getPropertyTypeHandler(property),
    getDefaultValue(property),
    property.hasLogicHandler ? property.handlerLabel : ' ',
    property.dataBinding ? 'YES' : 'NO',
    property.showInSettings ? 'YES' : 'NO',
    property.settingTooltip
  ]
};

const columns = ['Property', 'Type', 'Default Value', 'Logic', 'Data Binding', 'UI Setting', 'Description'];

const rows = component.properties.map(property => getProperty(property));

fs.writeFileSync('table.md', markdownTable([columns, ...rows]));
