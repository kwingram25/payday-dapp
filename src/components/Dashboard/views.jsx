import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Paper from '@material-ui/core/Paper'
import Checkbox from '@material-ui/core/Checkbox'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Switch from '@material-ui/core/Switch'
import IconButton from '@material-ui/core/IconButton'
import Tooltip from '@material-ui/core/Tooltip'
import DeleteIcon from '@material-ui/icons/Delete'
import FilterListIcon from '@material-ui/icons/FilterList'
import { lighten } from '@material-ui/core/styles/colorManipulator'

import styled from 'styled-components'

export const DashboardWrapper = styled(Paper)`
  padding: 12px;
  max-width: 1000px;
  flex-grow: 1;
  min-height: 100vh;
`

export const BillRow = ({ children, isPaid, ...props }) => {
  const Component = styled(TableRow)({
    cursor: 'pointer !important;',
    ...(isPaid ? { opacity: '0.5 !important' } : {}),
  })

  return <Component {...props}>{children}</Component>
}


const CompactCell = styled(TableCell)`
  padding-right: 8px !important;
  padding-left: 8px !important;
`

export const DetailsCell = styled(CompactCell)`
  min-width: 200px;

  & > div {
    display: flex;
    justify-content: flex-start;
    align-items: center;
  }
`

export const AmountCell = styled(CompactCell)`
`

export const DateCell = styled(CompactCell)`
`

export const StatusCell = styled(CompactCell)`
`

export const ActionsCell = styled(CompactCell)`
  width: 40px;
`

const tableColumns = [
  {
    id: 'date',
    numeric: false,
    disablePadding: false,
    label: 'Date',
    Component: DateCell,
  },
  {
    id: 'target',
    numeric: false,
    disablePadding: true,
    label: 'Details',
    Component: DetailsCell,
  },
  {
    id: 'amount',
    numeric: false,
    disablePadding: false,
    label: 'Amount',
    Component: AmountCell,
  },
  {
    id: 'actions',
    numeric: false,
    disablePadding: false,
    label: '',
    Component: ActionsCell,
  },
]

export class EnhancedTableHead extends React.Component {
  createSortHandler = property => (event) => {
    this.props.onRequestSort(event, property)
  };

  render() {
    const {
      onSelectAllClick, order, orderBy, numSelected, rowCount,
    } = this.props

    return (
      <TableHead>
        <TableRow padding="dense">
          {tableColumns.map(({
            id, label, Component,
          }) => (
            <Component
              key={id}
              sortDirection={orderBy === id ? order : false}
            >
              <Tooltip
                title="Sort"
                placement="bottom-start"
                enterDelay={300}
              >
                <TableSortLabel
                  active={orderBy === id}
                  direction={order}
                  onClick={this.createSortHandler(id)}
                >
                  {label}
                </TableSortLabel>
              </Tooltip>
            </Component>
          ), this)}
        </TableRow>
      </TableHead>
    )
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const toolbarStyles = theme => ({
  root: {
    padding: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
        color: theme.palette.secondary.main,
        backgroundColor: lighten(theme.palette.secondary.light, 0.85),
      }
      : {
        color: theme.palette.text.primary,
        backgroundColor: theme.palette.secondary.dark,
      },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
})

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

export const EnhancedTableToolbar = withStyles(toolbarStyles)((props) => {
  const {
    classes, filter, showArchived, onSetFilter = () => {}, onSetShowArchived = () => {},
  } = props

  return (
    <React.Fragment>
      <Toolbar>
        <div className={classes.title}>
          <Typography variant="h6" id="tableTitle">
          My Bills
          </Typography>
        </div>
        <FormGroup row>
          <FormControlLabel
            control={(
              <Switch
                checked={showArchived}
                onChange={onSetShowArchived}
              />
          )}
            label="Show Archived"
          />
        </FormGroup>
      </Toolbar>

      <Toolbar>

        <Tabs
          ba
          indicatorColor="primary"
          textColor="default"
          value={tabs[filter].index}
          onChange={onSetFilter}
        >
          {Object.keys(tabs).map(key => ((
            <Tab label={tabs[key].title} />
          )))}
        </Tabs>
      </Toolbar>
    </React.Fragment>
  )
})

// <div className={classes.spacer} />
// <div className={classes.actions}>
//   {numSelected > 0 ? (
//     <Tooltip title="Delete">
//       <IconButton aria-label="Delete">
//         <DeleteIcon />
//       </IconButton>
//     </Tooltip>
//   ) : (
//     <Tooltip title="Filter list">
//       <IconButton aria-label="Filter list">
//         <FilterListIcon />
//       </IconButton>
//     </Tooltip>
//   )}
// </div>
