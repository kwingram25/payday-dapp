import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import classNames from 'classnames'

import withStyles from '@material-ui/core/styles/withStyles'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import TableSortLabel from '@material-ui/core/TableSortLabel'

import { setDashboardSort } from 'actions/ui'

import { cellStyles } from '../styles'
import { tableColumns } from '../utils'

export default
@connect(
  ({ ui }) => ({
    sortField: ui.dashboardSortField,
    sortOrder: ui.dashboardSortOrder,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators({
        setDashboardSort,
      }, dispatch),
    },
  }),
)
@withStyles(cellStyles)
class EnhancedTableHead extends React.Component {
  onTableSort = (field) => {
    const { actions, sortField, sortOrder } = this.props
    let order = true

    if (sortField === field) {
      order = !sortOrder
    }

    actions.setDashboardSort(field, order)
  };

  render() {
    const {
      sortField, sortOrder, classes,
    } = this.props

    return (
      <TableHead>
        <TableRow padding="dense">
          {tableColumns.map(({ id, label }) => (
            <TableCell
              classes={{
                root: classNames(classes.base, classes[id]),
              }}
              key={id}
              {...(sortField === id
                ? { sortDirection: sortOrder ? 'desc' : 'asc' }
                : {})}
            >
              <TableSortLabel
                active={sortField === id}
                direction={sortOrder ? 'desc' : 'asc'}
                onClick={() => this.onTableSort(id)}
              >
                {label}
              </TableSortLabel>
            </TableCell>
          ), this)}
        </TableRow>
      </TableHead>
    )
  }
}
