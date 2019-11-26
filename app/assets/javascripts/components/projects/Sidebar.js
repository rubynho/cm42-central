import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames'
import * as Column from '../../models/beta/column'

const linkClasses = isDisabled =>
  classNames('Sidebar__link', { 'Sidebar__link--disabled': isDisabled })

const sidebarClasses = isOpened => classNames('Sidebar', { 'Sidebar--opened': isOpened })

const Sidebar = ({ onToggleColumn, visibleColumns }) => {
  const [isSidebarOpen, setSidebar] = useState(false)

  return (
    <div className={sidebarClasses(isSidebarOpen)}>
      <ul className='Sidebar__items'>
        <li className='Sidebar__link' onClick={() => setSidebar(!isSidebarOpen)}>
          <i className='mi Sidebar__icon'>{isSidebarOpen ? 'close' : 'menu'}</i>
        </li>
        <li
          className={linkClasses(!visibleColumns[Column.CHILLY_BIN])}
          onClick={() => onToggleColumn(Column.CHILLY_BIN)}>

          <i className='mi Sidebar__icon'>ac_unit</i>
          Chilly Bin
        </li>
        <li
          className={linkClasses(!visibleColumns[Column.BACKLOG])}
          onClick={() => onToggleColumn(Column.BACKLOG)}>

          <i className='mi Sidebar__icon'>list</i>
          Backlog
        </li>
        <li
          className={linkClasses(!visibleColumns[Column.DONE])}
          onClick={() => onToggleColumn(Column.DONE)}>

          <i className='mi Sidebar__icon'>done</i>
          Done
        </li>
        <li className='Sidebar__divider' />
      </ul>
    </div>
  )
}

Sidebar.propTypes = {
  onToggleColumn: PropTypes.func.isRequired,
  visibleColumns: PropTypes.object.isRequired
}

export default Sidebar
