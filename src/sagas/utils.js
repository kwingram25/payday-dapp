import {
  Person,
} from 'blockstack'

export const createUserObject = ({ username, profile }) => {
  const person = new Person(profile);

  return {
    username,
    name: person.name(),
    avatarUrl: person.avatarUrl(),
  }
}