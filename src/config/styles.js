export const headerHeight = 72
export const appPadding = 12

export const sidebarPanelHeight = 270

export const headerStyles = {
  height: `${headerHeight}px`,
}

export const appStyles = {
  padding: `${appPadding}px`,
}

export const xsSidebarStyles = {
  width: `calc(100vw - (2 * ${appPadding}px))`,
}

export const smSidebarStyles = {
  height: `calc(${sidebarPanelHeight}px + (2 * ${appPadding}px))`,
}

export const mdPanelStyles = {
  minHeight: `calc(100vh - ${headerHeight}px - ${5 * appPadding}px)`,
}

export const mdSidebarPanelStyles = {
  minHeight: `calc((100vh - (${headerHeight}px - ${5 * appPadding}px)) / 2)`,
}
