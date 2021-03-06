import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@edx/paragon';

class ActionButtonWithModal extends React.Component {
  // eslint-disable-next-line react/state-in-constructor
  state = {
    isModalOpen: false,
  };

  setIsModalOpen = isModalOpen => this.setState({ isModalOpen });

  render() {
    const {
      buttonClassName, buttonLabel, renderModal, variant,
    } = this.props;
    const { isModalOpen } = this.state;
    return (
      <>
        <Button
          variant={variant}
          className={buttonClassName}
          onClick={() => this.setIsModalOpen(true)}
        >
          {buttonLabel}
        </Button>
        {isModalOpen && renderModal({
          closeModal: () => this.setIsModalOpen(false),
        })}
      </>
    );
  }
}

ActionButtonWithModal.propTypes = {
  buttonLabel: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
  variant: PropTypes.string.isRequired,
  buttonClassName: PropTypes.string,
  renderModal: PropTypes.func.isRequired,
};

ActionButtonWithModal.defaultProps = {
  buttonClassName: null,
};

export default ActionButtonWithModal;
