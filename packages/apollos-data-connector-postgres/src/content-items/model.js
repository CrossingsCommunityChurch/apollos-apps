import { DataTypes } from 'sequelize';
import { defineModel, configureModel } from '../postgres';

const createModel = defineModel({
  modelName: 'contentItem',
  resolveType: () => 'UniversalContentItem', // shouldn't get called, ContentItem will be set on the shovel.
  external: true,
  attributes: {
    title: DataTypes.TEXT,
    summary: DataTypes.TEXT,
    htmlContent: DataTypes.TEXT,
    publishAt: DataTypes.DATE,
    active: DataTypes.BOOLEAN,
  },
});

const setupModel = configureModel(() => {});

export { createModel, setupModel };
