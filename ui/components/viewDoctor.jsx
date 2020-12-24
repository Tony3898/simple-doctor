import React from 'react'
import {useParams} from "react-router-dom";
import useAxios from "../hooks/useAxios";
import _Empty from "./empty";
import Loader from "./loader";

export default function ViewDoctor() {
  const {doctorId} = useParams()
  const {data: doctor, error, loading} = useAxios('doctors.getAll', {query: {_id: doctorId}})
  if (error)
    return <_Empty description={error}/>
  if (loading)
    return <Loader/>
  if (!doctor || !doctor.length)
    return <_Empty description={'Doctor not found'}/>
  let {
    firstname,
    lastname,
    email,
    phone,
    status,
    username
  } = doctor[0]['doctorData']
  return (<div className="row">
    <div className=" col-sm-12">
      <div className="user-img-container">
        <i className="fas fa-10x fa-user-circle"/>
        <span id="error-text" className="error-text"/>
        <br/>
        <h1 id="name">{`${firstname ? lastname ? firstname + ' ' + lastname : firstname : 'N/A'}`}</h1>
      </div>
    </div>
    <div className="col-sm-12">
      <table className="table" style={{padding: '16px'}}>
        <tbody>
        <tr>
          <th style={{fontWeight: 'bold'}}>User Name</th>
          <td id="username">{`${username ? username : 'N/A'}`}</td>
          <th style={{fontWeight: 'bold'}}>Status</th>
          {
            status ? <td id="status"><span className="badge badge-success">Active</span></td> :
                <td id="status"><span className="badge badge-danger">In-Active</span></td>
          }
        </tr>
        <tr>
          <th style={{fontWeight: 'bold'}}>Primary Email</th>
          <td id="email">{`${email ? email : 'N/A'}`}</td>
          <th style={{fontWeight: 'bold'}}>Primary Phone</th>
          <td id="phone">{`${phone ? phone : 'N/A'}`}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>)
}