import React from 'react'
import {Empty} from 'antd';

function _Empty(props) {
  const {description} = props
  return (
      <div className={'row'}>
        <div className={'col-sm-12 bg-white'}>
          <div className={'empty'}>
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<span>{description}</span>}/>
          </div>
        </div>
      </div>
  )
}

export default _Empty