import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'

import AddIcon from '@material-ui/icons/Add'

import { setDashboardFilter, setDashboardShowArchived } from 'actions/ui'

import styles from './styles'

const tabs = {
  all: {
    title: 'All Bills',
    key: 'all',
    index: 0,
  },
  mine: {
    title: 'Outgoing',
    key: 'mine',
    index: 1,
  },
  others: {
    title: 'Incoming',
    key: 'others',
    index: 2,
  },
}

export default
withStyles(styles)(connect(
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
      <div className={classes.title}>
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
      </div>
      <FormGroup row>
        <FormControlLabel
          control={(
            <Switch
              color="primary"
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
    <Toolbar variant="dense" className={classes.toolbar}>
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
          <Tab key={key} label={tabs[key].title} />
        )))}
      </Tabs>
    </Toolbar>
  </React.Fragment>
)))
