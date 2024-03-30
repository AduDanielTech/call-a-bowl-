import React from 'react'

const imgLoading = ({src,classname}) => {
  return (
    <img src={`data:image/png;base64,${src}`} alt="basemage" className={classname} />
  )
}

export default imgLoading
