import { parseGlobalId, createGlobalId } from '@apollosproject/server-core';
import RockApolloDataSource from '@apollosproject/rock-apollo-data-source';
import ApollosConfig from '@apollosproject/config';
import { flatten, get, chunk } from 'lodash';

export default class Interactions extends RockApolloDataSource {
  resource = 'Interactions';

  ADDITIONAL_INTERACTIONS_MAP = {
    ContentItem: {
      COMPLETE: this.updateSeriesStarted.bind(this),
    },
    PrayerRequest: {
      PRAY: this.incrementPrayer.bind(this),
    },
  };

  async incrementPrayer({ id }) {
    const { PrayerRequest } = this.context.dataSources;
    return PrayerRequest.incrementPrayed(id);
  }

  async updateSeriesStarted({ id }) {
    const { ContentItem } = this.context.dataSources;
    // Get all the parents
    let seriesParents = [];
    try {
      // The Rock Way
      seriesParents = await (
        await ContentItem.getCursorByChildContentItemId(id)
      ).get();
    } catch (e) {
      console.log(e);
      // The postgres way
      const model = await ContentItem.getFromId(id);
      const parent = await model.getParent();
      if (parent) seriesParents = [parent];
    }
    return Promise.all(
      seriesParents.map(async (seriesParent) => {
        // Check to see if we have started the series before
        const parentType =
          seriesParent.apollosType || ContentItem.resolveType(seriesParent);
        const nodeId =
          seriesParent.apollosId || createGlobalId(seriesParent.id, parentType);
        const otherInteractions = await this.getInteractionsForCurrentUserAndNodes(
          {
            nodeIds: [nodeId],
            actions: ['SERIES_START'],
          }
        );
        // If we haven't, mark it as started
        if (!otherInteractions.length) {
          await this.createNodeInteraction({
            nodeId,
            action: 'SERIES_START',
            additional: false, // we pass this prop to avoid recursive interaction creation
          });
        }
      })
    );
  }

  async createAdditionalInteractions({ id, __type, action }) {
    // Get all the typenames for an entity.
    // This will likely be something like, [UniversalContentItem, ContentItem]
    const normalizedTypeNames = this.context.models.Node.getPossibleDataModels({
      schema: this.context.schema,
      __type,
    });
    // For each of this types
    return Promise.all(
      normalizedTypeNames.map(async (normalizedType) => {
        // do we have a function to call?
        const possibleFunction = get(
          this.ADDITIONAL_INTERACTIONS_MAP,
          `${normalizedType}.${action}`
        );
        // if so, call it.
        if (possibleFunction) {
          return possibleFunction({ id, __type, action });
        }
        return null;
      })
    );
  }

  async createContentItemInteraction({ itemId, operationName, itemTitle }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;
    const { id } = parseGlobalId(itemId);

    const interactionComponent = await RockConstants.contentItemInteractionComponent(
      {
        contentItemId: id,
        // Don't want to recreate channels if name changes
        // In the future, we could use itemTitle here.
        contentName: id,
      }
    );
    const currentUser = await Auth.getCurrentPerson();
    const interactionId = await this.post('/Interactions', {
      PersonAliasId: currentUser.primaryAliasId,
      InteractionComponentId: interactionComponent.id,
      Operation: operationName,
      InteractionDateTime: new Date().toJSON(),
      InteractionSummary: `${operationName} - ${itemTitle}`,
      InteractionData: `${itemId}`,
    });

    return this.get(`/Interactions/${interactionId}`);
  }

  async getInteractionsForCurrentUserAndNodes({ nodeIds, actions = [] }) {
    let currentUser;
    try {
      currentUser = await this.context.dataSources.Auth.getCurrentPerson();
    } catch (e) {
      return [];
    }

    if (nodeIds.length === 0) {
      return [];
    }

    if (ApollosConfig.ROCK.USE_PLUGIN) {
      // need to split up the request for ASP.NET
      return flatten(
        await Promise.all(
          chunk(nodeIds, 10).map(async (group) =>
            this.request(
              `/Apollos/GetInteractionsByForeignKeys?keys=${group.join(',')}`
            )
              .filterOneOf(actions.map((a) => `Operation eq '${a}'`))
              .andFilter(`PersonAliasId eq ${currentUser.primaryAliasId}`)
              .get()
          )
        )
      );
    }
    console.warn(
      'Fetching interactions without the Rock plugin is extremly inefficient\n\nWe highly recommend using plugin version 1.6.0 or higher'
    );
    return flatten(
      await Promise.all(
        nodeIds.map(async (nodeId) =>
          this.request()
            .filterOneOf(actions.map((a) => `Operation eq '${a}'`))
            .andFilter(
              `(ForeignKey eq '${nodeId}') and (PersonAliasId eq ${currentUser.primaryAliasId})`
            )
            .get()
        )
      )
    );
  }

  getNodeInteractionsForCurrentUser({ nodeId, actions = [] }) {
    return this.getInteractionsForCurrentUserAndNodes({
      nodeIds: [nodeId],
      actions,
    });
  }

  async getInteractionsForCurrentUser({ actions = [] }) {
    let currentUser;
    try {
      currentUser = await this.context.dataSources.Auth.getCurrentPerson();
    } catch (e) {
      return [];
    }
    return this.request()
      .filterOneOf(actions.map((a) => `Operation eq '${a}'`))
      .andFilter(`PersonAliasId eq ${currentUser.primaryAliasId}`)
      .get();
  }

  async createNodeInteraction({ nodeId, action, additional = true }) {
    const {
      dataSources: { RockConstants, Auth },
    } = this.context;
    const { id, __type } = parseGlobalId(nodeId);

    const entityType = await RockConstants.modelType(__type);

    if (!entityType) {
      console.error(
        'nodeId is an invalid (non-rock) entity type. This is not yet supported.'
      );
      return { success: false };
    }

    const interactionComponent = await RockConstants.interactionComponent({
      entityId: id,
      entityTypeId: entityType.id,
      entityTypeName: entityType.friendlyName,
    });

    const currentUser = await Auth.getCurrentPerson();

    // Currently it throws an error for a postgres created prayer, this will be fixed once they are shoveled back
    // into Rock or on command during the prayer creation
    try {
      await this.post('/Interactions', {
        PersonAliasId: currentUser.primaryAliasId,
        InteractionComponentId: interactionComponent.id,
        Operation: action,
        InteractionDateTime: new Date().toJSON(),
        InteractionSummary: `${action}`,
        ForeignKey: nodeId,
      });
    } catch (e) {
      console.warn(e);
    }

    if (additional) {
      this.createAdditionalInteractions({ id, __type, action });
    }

    return {
      success: true,
      nodeId,
    };
  }
}
