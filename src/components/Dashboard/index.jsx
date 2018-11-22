import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import keyBy from 'lodash.keyby'

import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import Fade from '@material-ui/core/Fade'

import { mdPanelStyles } from 'config/styles'

import { editBill, viewBill, deleteBill } from 'actions/navigation'
import { setDashboardFilter, setDashboardShowArchived } from 'actions/ui'

import Loader from 'components/Loader'

import DashboardToolbar from './DashboardToolbar'
import DashboardTableRow from './DashboardTableRow'

import {
  EnhancedTableHead,
} from './views'

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)
}

const rowsPerPage = 20

const styles = theme => ({
  root: {
    // [theme.breakpoints.down('sm')]: {
    //   backgroundColor: theme.palette.secondary.main,
    // },
    [theme.breakpoints.up('md')]: {
      ...mdPanelStyles,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',

    },
    // [theme.breakpoints.up('lg')]: {
    //   backgroundColor: green[500],
    // },
  },
  table: {
  },
  tableWrapper: {
    padding: '0 12px',
    overflowX: 'auto',
    flexGrow: 1,
  },
})

export default
@connect(
  ({ bills, contacts, ui }) => ({
    data: bills.data && Object.values(bills.data),
    contacts: contacts.data,
    filter: ui.dashboardFilter,
    showArchived: ui.dashboardShowArchived,
  }),
  dispatch => ({
    actions: {
      ...bindActionCreators({
        editBill,
        viewBill,
        deleteBill,
        setDashboardFilter,
        setDashboardShowArchived,
      }, dispatch),
    },
  }),
)
@withStyles(styles)
class Dashboard extends React.Component {
  state = {
    fadeIn: true,
    order: 'desc',
    orderBy: 'date',
    selected: [],
    // data: [
    //   createData('Cupcake', 305, 3.7, 67, 4.3),
    //   createData('Donut', 452, 25.0, 51, 4.9),
    //   createData('Eclair', 262, 16.0, 24, 6.0),
    //   createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    //   createData('Gingerbread', 356, 16.0, 49, 3.9),
    //   createData('Honeycomb', 408, 3.2, 87, 6.5),
    //   createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    //   createData('Jelly Bean', 375, 0.0, 94, 0.0),
    //   createData('KitKat', 518, 26.0, 65, 7.0),
    //   createData('Lollipop', 392, 0.2, 98, 0.0),
    //   createData('Marshmallow', 318, 0, 81, 2.0),
    //   createData('Nougat', 360, 19.0, 9, 37.0),
    //   createData('Oreo', 437, 18.0, 63, 4.0),
    // ],
    page: 0,
    rowsPerPage: 5,
  };

  componentWillUnmount() {
    this.setState({ fadeIn: false })
  }

  handleRequestSort = (event, property) => {
    const orderBy = property
    let order = 'desc'

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc'
    }

    this.setState({ order, orderBy })
  };

  handleSelectAllClick = (event) => {
    if (event.target.checked) {
      this.setState(state => ({ selected: state.data.map(n => n.id) }))
      return
    }
    this.setState({ selected: [] })
  };

  handleClick = (event, id) => {
    const { selected } = this.state
    const selectedIndex = selected.indexOf(id)
    let newSelected = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      )
    }

    this.setState({ selected: newSelected })
  };

  handleChangePage = (event, page) => {
    this.setState({ page })
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rowsPerPage: event.target.value })
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  render() {
    const {
      actions, data, contacts, classes, filter, showArchived,
    } = this.props
    const {
      order, orderBy, selected, page, fadeIn,
    } = this.state

    if (!data || !contacts) {
      return (
        <Fade in={fadeIn}>
          <Paper className={classes.root}>
            <Loader size={40} />
          </Paper>
        </Fade>
      )
    }

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage)

    return (
      <Fade in={fadeIn}>
        <Paper elevation={0} className={classes.root}>
          <DashboardToolbar />
          <div className={classes.tableWrapper}>
            <Table padding="dense" className={classes.table} aria-labelledby="tableTitle">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={this.handleSelectAllClick}
                onRequestSort={this.handleRequestSort}
                rowCount={data.length}
              />
              <TableBody>
                {stableSort(data, getSorting(order, orderBy))
                  .filter(({ isOwned, isPaid }) => {
                    if (isPaid && !showArchived) {
                      return false
                    }
                    switch (filter) {
                      case 'all':
                        return true
                      case 'mine':
                        return isOwned
                      case 'others':
                        return !isOwned
                    }
                  })
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map(bill => (
                    <DashboardTableRow bill={bill} />
                  ))
                }
              </TableBody>
            </Table>
          </div>
          {(data.length > rowsPerPage) && (
          <TablePagination
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Previous Page',
            }}
            nextIconButtonProps={{
              'aria-label': 'Next Page',
            }}
            onChangePage={this.handleChangePage}
          />
          )}
        </Paper>
      </Fade>
    )
  }
}
