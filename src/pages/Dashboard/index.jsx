import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Link } from 'react-router-dom'

import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TablePagination from '@material-ui/core/TablePagination'
import Paper from '@material-ui/core/Paper'
import Fade from '@material-ui/core/Fade'

import AddIcon from '@material-ui/icons/Add'

import { editBill, viewBill, deleteBill } from 'actions/navigation'
import { setDashboardFilter, setDashboardShowArchived, setDashboardSort } from 'actions/ui'

import Loader from 'components/Loader'

import DashboardToolbar from './DashboardToolbar'
import DashboardTableHead from './DashboardTableHead'
import DashboardTableRow from './DashboardTableRow'

import styles from './styles'

const sortMapping = (field) => {
  switch (field) {
    case 'details':
      return ({ isOwned, owner, target }) => (isOwned ? target : owner)
    default:
      return ({ [field]: value }) => value
  }
}

const sortDesc = (a, b, field) => {
  const sortFn = sortMapping(field)
  if (sortFn(b) < sortFn(a)) {
    return -1
  }
  if (sortFn(b) > sortFn(a)) {
    return 1
  }
  return 0
}

const stableSort = (array, cmp) => {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })
  return stabilizedThis.map(el => el[0])
}

const rowsPerPage = 10

export default
@connect(
  ({
    bills, contacts, payments, ui,
  }) => {
    const isReady = (
      bills.data
      && contacts.data
      && payments.data && !(
        bills.fetching
        || contacts.fetching
        || payments.fetching
      )
    )

    if (!isReady) {
      return { isReady }
    }

    return {
      isReady,
      data: bills.data && Object.values(bills.data),
      contacts: contacts.data,
      filter: ui.dashboardFilter,
      showArchived: ui.dashboardShowArchived,
      sortField: ui.dashboardSortField,
      sortOrder: ui.dashboardSortOrder,
    }
  },
  dispatch => ({
    actions: {
      ...bindActionCreators({
        editBill,
        viewBill,
        deleteBill,
        setDashboardFilter,
        setDashboardShowArchived,
        setDashboardSort,
      }, dispatch),
    },
  }),
)
@withStyles(styles)
class Dashboard extends React.Component {
  state = {
    fadeIn: true,
    page: 0,
  };

  componentWillUnmount() {
    this.setState({ fadeIn: false })
  }

  onTableSort = (event, property) => {
    const { actions, sortField, sortOrder } = this.props
    const field = property
    let order = true

    if (sortField === property && sortOrder === true) {
      order = !sortOrder
    }

    actions.setDashboardSort(order, field)
  };

  onPageSelect = (event, page) => {
    this.setState({ page })
  };

  sorter = () => {
    const { sortField, sortOrder } = this.props

    return sortOrder
      ? (a, b) => sortDesc(a, b, sortField)
      : (a, b) => -sortDesc(a, b, sortField)
  }


  prepareData = () => {
    const {
      data, filter, showArchived,
    } = this.props

    return stableSort(data, this.sorter())
      .filter(({ isOwned, isClosed }) => {
        if (isClosed && !showArchived) {
          return false
        }
        switch (filter) {
          case 'mine':
            return isOwned
          case 'others':
            return !isOwned
          case 'all':
          default:
            return true
        }
      })
  }

  render() {
    const {
      data, isReady, classes,
    } = this.props
    const {
      page, fadeIn,
    } = this.state

    if (!isReady) {
      return (
        <Fade in={fadeIn}>
          <Paper className={classes.root} elevation={0}>
            <Loader size={40} />
          </Paper>
        </Fade>
      )
    }

    const rows = this.prepareData()

    return (
      <Fade in={fadeIn}>
        <Paper className={classes.root} elevation={0}>
          <DashboardToolbar />
          <div className={classes.tableWrapper}>
            <Table padding="dense" className={classes.table} aria-labelledby="tableTitle">
              <DashboardTableHead />
              <TableBody>
                {rows
                  .slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage,
                  )
                  .map(({ id }) => (
                    <DashboardTableRow key={id} id={id} />
                  ))}
              </TableBody>
            </Table>
            {(rows.length === 0) && (
              <div className={classes.empty}>
                <Button
                  className={classes.addButton}
                  size="large"
                  variant="contained"
                  color="primary"
                  component={Link}
                  to="/bill/new"
                >
                  <AddIcon className={classes.addIcon} />
                  Create a New Bill
                </Button>
              </div>
            )}
          </div>
          {(rows.length > rowsPerPage) && (
            <TablePagination
              component="div"
              count={data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              rowsPerPageOptions={[]}
              backIconButtonProps={{
                'aria-label': 'Previous Page',
              }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={(e, p) => {
                this.setState({ page: p })
              }}
            />
          )}
        </Paper>
      </Fade>
    )
  }
}
