import React from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'

import styled from 'styled-components'

const DefaultRow = styled(TableRow)({
  cursor: 'pointer !important;',
})

const ArchivedRow = styled(DefaultRow)({
  opacity: 0.5,
})

export const BillRow = ({ children, isPaid, ...props }) => {
  const Component = isPaid ? ArchivedRow : DefaultRow
  return (
    <Component {...props}>
      {children}
    </Component>
  )
}

const CompactCell = styled(TableCell)`
  padding-right: 8px !important;
  padding-left: 8px !important;
`

export const DetailsCell = styled(CompactCell)`
  min-width: 360px;
  width: 65%;
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

export const Description = styled.div`
  margin-left: 12px;
  flex-grow: 1;
`

export const AmountPaid = styled.div`
  color: yellow;
  float: right;
  white-space: nowrap;
`
