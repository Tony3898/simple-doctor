import React from "react";
import {Space} from 'antd'
import {Link} from "react-router-dom";

export default function Subheader({title, onSearchChange, actions = []}) {
  return (
      <div className={'row subheader'}>
        <div className={'col-lg-4 col-sm-12'}>
          <h1 className={'text-center'}>{title}</h1>
        </div>
        <div className={'col-lg-4 col-sm-12'}>
          <input type="text" className="form-control" placeholder="Search" aria-label="search"
                 aria-describedby="search" onChange={onSearchChange}/>
        </div>
        <div className={'col-sm-12 col-lg-4 subheader-actions'}>
          <Space>
            {
              actions.map((a, i) => <Link key={a.title} to={a.href}
                                          className={`btn ${i % 2 === 0 ? 'btn-accent' : 'btn-secondary'}`}>{a.title}</Link>)
            }
          </Space>
        </div>
      </div>
  )
}