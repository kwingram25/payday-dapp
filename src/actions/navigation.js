import { push, replace } from 'connected-react-router'

export const dashboard = () => replace({
  pathname: '/dashboard',
})

export const viewBill = id => push({
  pathname: '/bill',
  hash: id,
})

export const editBill = id => push({
  pathname: '/bill/edit',
  hash: id,
})

export const deleteBill = id => push({
  pathname: '/bill/delete',
  hash: id,
  state: {
    modal: true,
  },
})

export const payBill = id => push({
  pathname: '/bill/pay',
  hash: id,
  state: {
    modal: true,
  },
})

export const deleteContact = username => push({
  pathname: '/contact/delete',
  state: {
    modal: true,
    username,
  },
})
