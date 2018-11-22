import styled from 'styled-components'
import Grid from '@material-ui/core/Grid'

import { headerHeight, appPadding } from 'config/styles'

export const SiteWrapper = styled.div`
  max-width: 960px;
  padding: 12px;
  margin: 0px auto;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: center;
  min-height: 100vh;
  width: calc(100vw - 24px);

  .fade-enter {
      opacity: 0.01;
  }
  .fade-enter.fade-enter-active {
      opacity: 1;
      transition: opacity 300ms ease-in;
  }
  .fade-exit {
      opacity: 1;
  }

  .fade-exit.fade-exit-active {
      opacity: 0.01;
      transition: opacity 300ms ease-in;
  }
`

export const MainPanel = styled(Grid)`
  min-height: calc(100vh - ${2 * headerHeight}px - ${2 * appPadding}px);
`
