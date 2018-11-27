import React from 'react'
import { Link } from 'react-router-dom'
import classNames from 'classnames'

import withStyles from '@material-ui/core/styles/withStyles'
// import Button from '@material-ui/core/Button'
//
// import LoaderButton from 'components/LoaderButton'

import {
  EditButton,
  DeleteButton,
  PayButton,
  MarkPaidButton,
  MarkUnpaidButton,
  CreateButton,
  CancelButton,
} from './views'

import styles from './styles'


export default
withStyles(styles)(
  (props) => {
    const {
      billId,
      markedPaid,
      isNew,
      isEditing,
      isSending,
      isOwned,
      isPaid,
      isClosed,
      actions,
      createOrUpdate,
      classes,
    } = props

    return (
      <div className={classNames(classes.root, classes.padding)}>
        <div className={classes.left}>
          {(isOwned && !isEditing) && (
          <React.Fragment>
            <DeleteButton
              component={Link}
              to={`/bill/delete#${billId}`}
            />
            <EditButton
              component={Link}
              to={`/bill/edit#${billId}`}
            />
          </React.Fragment>
          )}
        </div>
        <div className={classes.right}>
          {(!isOwned && !isClosed) && (
          <PayButton
            component={Link}
            to={`/bill/pay#${billId}`}
            disabled={isSending}
          />
          )}
          {(isOwned && !isEditing) && (
            markedPaid ? (
              <MarkUnpaidButton
                onClick={() => {
                  actions.billsMarkAsPaid(billId, false)
                }}
              />
            ) : (!isPaid && (
            <MarkPaidButton
              onClick={() => {
                actions.billsMarkAsPaid(billId, true)
              }}
            />
            ))
          )}
          {(isEditing || isNew) && (
          <React.Fragment>
            <CancelButton
              onClick={() => {
                actions.goBack()
              }}
            />
            <CreateButton
              isNew={isNew}
              onClick={createOrUpdate}
            />
          </React.Fragment>
          )}
        </div>

      </div>
    )
  },
)
