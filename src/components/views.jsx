import styled from 'styled-components'

const colors = {
  positive: 'green',
  negative: 'red',
}

export const EthBalance = styled.div`
  ${props => props.css}
  &:after {
    font-weight: 200;
    opacity: 0.8;
    display: inline;
    content: ' ETH';
  }
`

export const SmallHeader = styled.div`
  text-transform: uppercase;
  font-size: 13px;
  color: #aaa;
`
