import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'

const buttonClasses = isDisabled =>
  classNames('Column__btn-close', { 'Column__btn-close--disabled': isDisabled })

const Column = ({ title, children, renderAction, onClose, isVisible, canClose }) => (
  isVisible &&
    <div className="Column">
      <div className="Column__header">
        <h3 className="Column__name">{title}</h3>
        <div className="Column__actions">
          {renderAction()}
          <button
            type="button"
            title={!canClose && "You can't close all columns"}
            className={buttonClasses(!canClose)}
            onClick={onClose}>

            <i className="mi md-16">close</i>
          </button>
        </div>
      </div>
      <div className="Column__body">{children}</div>
    </div>
);

Column.propTypes = {
  title: PropTypes.string.isRequired,
  renderAction: PropTypes.func
}

Column.defaultProps = {
  renderAction: () => null
}

export default Column;
