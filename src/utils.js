import {
  Person,
  loadUserData,
} from 'blockstack'
import generate from 'nanoid/generate'

export const createUserObject = ({ username, profile } = loadUserData()) => {
  const person = new Person(profile);

  return {
    username,
    name: person.name() || username.split('.')[0] || '<no name>',
    avatarUrl: person.avatarUrl(),
  }
}

export const billId = () => {
  return generate('1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 8)
}
