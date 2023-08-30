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

const getPropertyRow = (property) => {
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

const getEventHandlerRow = (eventHandler) => {
  return [
    eventHandler.label,
    eventHandler.handlerDescription,
    eventHandler.contextBlocks ? eventHandler.contextBlocks.map(block => `${block.label}: \`\``).join(', ') : '',
  ]
};

const getActionRow = (action) => {
    return [
      action.label,
      action.inputs ? action.inputs.map(input => `${input.label}: \`\``).join(', ') : '',
      action.returns ? action.returns.map(returnValue => `${returnValue.label}: \`\``).join(', ') : '',
    ]
};

const propertyColumns = ['Property', 'Type', 'Default Value', 'Logic', 'Data Binding', 'UI Setting', 'Description'];

const propertyRows = component.properties.map(property => getPropertyRow(property));

fs.writeFileSync('table.md', markdownTable([propertyColumns, ...propertyRows]));

const eventColumns = ['Name', 'Triggers', 'Context Blocks'];

const eventRows = component.eventHandlers.map(eventHandler => getEventHandlerRow(eventHandler));

fs.appendFileSync('table.md', '\n\n' + markdownTable([eventColumns, ...eventRows]));

const actionColumns = ['Action', 'Inputs', 'Returns'];

const actionRows = component.actions.map(action => getActionRow(action));

fs.appendFileSync('table.md', '\n\n' + markdownTable([actionColumns, ...actionRows]));
