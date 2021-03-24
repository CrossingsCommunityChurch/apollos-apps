import React from 'react';
import PropTypes from 'prop-types';
import Modal, { ModalHeader } from '../../Modal';
import FollowListSearch from './FollowListSearch';

const FollowListSearchModal = ({
  onSearch,
  open,
  setModalOpen,
  title,
  ...props
}) => {
  return (
    <Modal
      animationType="slide"
      onRequestClose={() => setModalOpen(false)}
      visible={open}
    >
      <ModalHeader
        onNext={() => setModalOpen(false)}
        onNextText="Done"
        title={title}
      />
      <FollowListSearch onSearch={onSearch} {...props} />
    </Modal>
  );
};

FollowListSearchModal.propTypes = {
  title: PropTypes.string,
  open: PropTypes.bool,
  setModalOpen: PropTypes.func,
  onSearch: PropTypes.func,
  onHide: PropTypes.func,
  onConfirm: PropTypes.func,
  onFollow: PropTypes.func,
  results: PropTypes.arrayOf(PropTypes.object),
};

FollowListSearchModal.defaultProps = {
  title: 'Find People to Follow',
  onSearch: () => {},
  open: false,
};

export default FollowListSearchModal;
