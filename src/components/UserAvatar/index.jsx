import React from 'react'
import ColorHash from 'color-hash'
import styled from 'styled-components'
import Avatar from '@material-ui/core/Avatar'

const defaultStyle = {
  // marginRight: '12px',
}

const colorHash = new ColorHash({
  saturation: 0.7,
  lightness: 0.4,
  hash: (str) => {
    let hash = 0
    for (let i = 0; i < str.length; i += 1) {
      hash += str.charCodeAt(i)
    }
    return hash
  },
})

export default ({
  style = defaultStyle, username = '?', avatarUrl, size, ...rest
}) => {
  const Component = styled(Avatar)({
    ...style,
    color: 'white !important',
    ...(
      username !== '?' ? {
        backgroundColor: `${colorHash.hex(username)} !important`,
      } : { }
    ),
    ...(
      size
        ? {
          width: `${size}px !important`,
          height: `${size}px !important`,
          fontSize: `${size / 2}px !important`,
        }
        : {}
    ),
  })

  const props = {
    ...rest,
    // classes: {
    //   root: {
    //     ...(
    //       size
    //         ? { width: `${size}px`, height: `${size}px` }
    //         : {}
    //     ),
    //   },
    // },

  }

  return avatarUrl ? (
    <Component
      {...props}
      src={avatarUrl}
    />
  ) : (
    <Component {...props}>
      {username.substring(0, 1).toUpperCase()}
    </Component>
  )
}
