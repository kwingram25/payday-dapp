import React from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import classNames from 'classnames'

import withStyles from '@material-ui/core/styles/withStyles'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import IconButton from '@material-ui/core/IconButton'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'

import OpenInNewIcon from '@material-ui/icons/OpenInNew'

import Etherscan from 'providers/etherscan'

import EthBalance from 'components/EthBalance'

import styles from './styles'

const columns = [
  {
    label: 'Date',
    id: 'date',
    key: 'date',
  },
  {
    label: 'Amount',
    id: 'amount',
    key: 'amount',
  },
  {
    label: 'Transaction Hash',
    id: 'tx-hash',
    key: 'txHash',
  },
  {
    label: 'Explorer',
    id: 'view',
    key: 'actions',
  },
]


export default
@connect(
  ({ bills, payments }, { billId }) => ({
    bill: bills.data[billId],
    data: payments.data[billId],
  }),
)
@withStyles(styles)
class Payments extends React.Component {
  prepareData = () => {
    const { data } = this.props

    return data
  }

  render() {
    const { bill, classes } = this.props
    return (
      <ExpansionPanel
        classes={{
          root: classes.root,
          expanded: classes.root,
        }}
        elevation={12}
      >
        <ExpansionPanelSummary
          expandIcon={(
            <ExpandMoreIcon />
          )}
        >
          Payments
        </ExpansionPanelSummary>
        <ExpansionPanelDetails className={classes.details}>
          <div className={classes.tableWrapper}>
            <Table className={classes.table} padding="dense">
              <TableHead>
                <TableRow padding="dense">
                  {columns.map(({
                    label, id, key,
                  }) => (
                    <TableCell
                      className={classNames(classes.cell, classes[key])}
                      key={id}
                    >
                      {label}
                    </TableCell>
                  ), this)}
                </TableRow>
              </TableHead>
              <TableBody>
                {this.prepareData().map(({ date, amount, txHash }) => (
                  <TableRow key={txHash}>
                    <TableCell
                      className={classNames(classes.cell, classes.date)}
                    >
                      {moment.unix(date).format('MMM D, YYYY hh:mm a')}
                    </TableCell>
                    <TableCell
                      className={classNames(classes.cell, classes.amount)}
                    >
                      <EthBalance positive={bill.isOwned} negative={!bill.isOwned}>
                        {amount}
                      </EthBalance>
                    </TableCell>
                    <TableCell
                      className={classNames(classes.cell, classes.txHash)}
                    >
                      <div className={classes.txHashInner}>
                        {txHash}
                      </div>
                    </TableCell>
                    <TableCell
                      className={classNames(classes.cell, classes.actions)}
                    >
                      <IconButton
                        className={classes.explorerButton}
                        component="a"
                        target="_blank"
                        href={Etherscan.txUrl(txHash)}
                      >
                        <OpenInNewIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </ExpansionPanelDetails>
      </ExpansionPanel>
    )
  }
}
