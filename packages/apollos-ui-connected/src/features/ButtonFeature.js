import React from 'react';
import PropTypes from 'prop-types';
import { Linking } from 'react-native';
import { useMutation, useQuery, gql } from '@apollo/client';
import { withTrackOnPress } from '@apollosproject/ui-analytics';
import { Button, PaddedView, styled } from '@apollosproject/ui-kit';

const ButtonFeature = ({ action }) => {
  const ButtonWithAnalytics = styled(
    {},
    'ui-connected.features.ButtonFeature'
  )(withTrackOnPress(Button));

  const { data: { interactions = [] } = {} } = useQuery(
    gql`
      query GetNodeInteractions($nodeId: ID) {
        interactions(nodeId: $nodeId) {
          id
          action
        }
      }
    `,
    { variables: { nodeId: action.relatedNode.id } }
  );
  const isCompleted = interactions?.some(
    (interaction) => interaction.action === 'COMPLETE'
  );
  const isDisabled = action.action === 'COMPLETE_NODE' && isCompleted;

  const [complete] = useMutation(
    gql`
      mutation CompleteNode($action: InteractionAction!, $nodeId: ID!) {
        interactWithNode(action: $action, nodeId: $nodeId) {
          success
        }
      }
    `,
    {
      variables: { action: 'COMPLETE', nodeId: action.relatedNode.id },
      refetchQueries: ['GetNodeInteractions'],
    }
  );

  const handlePress = () => {
    if (action.action === 'COMPLETE_NODE') {
      complete();
    } else {
      Linking.openURL(action.relatedNode?.url);
    }
  };

  return (
    <PaddedView>
      <ButtonWithAnalytics
        title={action?.title || 'Go!'}
        onPress={handlePress}
        disabled={isDisabled}
        trackEventName={action?.title || 'Button Clicked'}
        trackProperties={{ itemId: action?.relatedNode?.id }}
      />
    </PaddedView>
  );
};

ButtonFeature.propTypes = {
  action: PropTypes.shape({
    title: PropTypes.string,
    relatedNode: PropTypes.shape({
      id: PropTypes.string,
      url: PropTypes.string,
    }),
    action: PropTypes.string,
  }),
};

export default ButtonFeature;
