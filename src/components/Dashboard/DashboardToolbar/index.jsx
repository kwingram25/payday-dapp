import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import AddIcon from '@material-ui/icons/Add'


// import styled from 'styled-components'

import { setDashboardFilter, setDashboardShowArchived } from 'actions/ui'

import { DashboardTitle } from './views'

const tabs = {
  all: {
    title: 'All Bills',
    key: 'all',
    index: 0,
  },
  mine: {
    title: 'Incoming',
    key: 'mine',
    index: 1,
  },
  others: {
    title: 'Outgoing',
    key: 'others',
    index: 2,
  },
}

export default
withStyles({

})(connect(
  ({ ui }) => ({
    filter: Object.keys(tabs).indexOf(ui.dashboardFilter),
    showArchived: ui.dashboardShowArchived,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators({
        setDashboardFilter,
        setDashboardShowArchived,
      }, dispatch),
    },
  }),
)(({
  classes,
  actions,
  filter,
  showArchived,
}) => (
  <React.Fragment>
    <Toolbar>
      <DashboardTitle>
        <Typography variant="h6">
          My Bills
        </Typography>
        <Button
          variant="fab"
          mini
          color="primary"
          aria-label="Add"
          component={Link}
          to="/bill/new"
        >
          <AddIcon />
        </Button>
      </DashboardTitle>
      <FormGroup row>
        <FormControlLabel
          control={(
            <Switch
              checked={showArchived}
              onChange={(event, checked) => {
                actions.setDashboardShowArchived(
                  checked,
                )
              }}
            />
          )}
          label="Show Archived"
        />
      </FormGroup>
    </Toolbar>

    <Toolbar variant="dense" style={{justifyContent: 'center'}}>
      <Tabs
        indicatorColor="primary"
        textColor="primary"
        value={filter}
        onChange={(event, value) => {
          actions.setDashboardFilter(
            Object.keys(tabs)[value],
          )
        }}
      >
        {Object.keys(tabs).map(key => ((
          <Tab label={tabs[key].title} />
        )))}
      </Tabs>
    </Toolbar>
  </React.Fragment>
)))
