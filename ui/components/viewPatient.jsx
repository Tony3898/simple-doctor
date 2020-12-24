import React from 'react'
import {useParams} from "react-router-dom";
import useAxios from "../hooks/useAxios";
import _Empty from "./empty";
import Loader from "./loader";
import useCapitalize from "../hooks/useCapitalize";
import useRandomColor from "../hooks/useRandomColor";
import {Space} from "antd";

export default function ViewPatient() {
  const {patientId} = useParams()
  const {data: patient, error, loading} = useAxios('patients.getAll', {query: {_id: patientId}})
  if (error)
    return <_Empty description={error}/>
  if (loading)
    return <Loader/>
  if (!patient || !patient.length)
    return <_Empty description={'patient not found'}/>
  let {
    diagnosis,
    city, pincode,
    address, state, country,
    prescribedMedication
  } = patient[0]
  let {
    firstname,
    lastname,
    email,
    phone,
    status,
    username
  } = patient[0]['patientData']
  return (<div className="row">
    <div className=" col-sm-12">
      <div className="user-img-container">
        <i className="fas fa-10x fa-user-circle"/>
        <br/>
        <h1 id="name">{`${firstname ? lastname ? firstname + ' ' + lastname : firstname : 'N/A'}`}</h1>
      </div>
    </div>
    <div className="col-sm-12">
      <table className="table" style={{padding: '16px'}}>
        <tbody>
        <tr>
          <th style={{fontWeight: 'bold'}}>User Name</th>
          <td>{`${username ? username : 'N/A'}`}</td>
          <th style={{fontWeight: 'bold'}}>Status</th>
          {
            status ? <td><span className="badge badge-success">Active</span></td> :
                <td><span className="badge badge-danger">In-Active</span></td>
          }
        </tr>
        <tr>
          <th style={{fontWeight: 'bold'}}>Primary Email</th>
          <td>{`${email ? email : 'N/A'}`}</td>
          <th style={{fontWeight: 'bold'}}>Primary Phone</th>
          <td>{`${phone ? phone : 'N/A'}`}</td>
        </tr>
        <tr>
          <th style={{fontWeight: 'bold'}}>Diagnosis</th>
          <td><Space>
            {diagnosis && diagnosis.length ? diagnosis.map((p) => {
              let background = useRandomColor()
              return <span className={'simple-doctor-badge'} style={{
                background: `${background}`,
                color: `${background.toLowerCase().includes('fff') ? '#000' : '#fff'}`,
              }}>{useCapitalize(p)}</span>
            }) : 'N/A'}
          </Space></td>
          <th style={{fontWeight: 'bold'}}>Prescribed Medication</th>
          <td><Space>
            {prescribedMedication && prescribedMedication.length ? prescribedMedication.map((p) => {
              let background = useRandomColor()
              return <span className={'simple-doctor-badge'} style={{
                background: `${background}`,
                color: `${background.toLowerCase().includes('fff') ? '#000' : '#fff'}`,
              }}>{useCapitalize(p)}</span>
            }) : 'N/A'}
          </Space></td>
        </tr>
        <tr>
          <th style={{fontWeight: 'bold'}}>Address</th>
          <td>{`${address ? address : 'N/A'}`}</td>
          <th style={{fontWeight: 'bold'}}>Pincode</th>
          <td>{`${pincode ? pincode : 'N/A'}`}</td>
        </tr>
        <tr>
          <th style={{fontWeight: 'bold'}}>City</th>
          <td>{`${city ? city : 'N/A'}`}</td>
          <th style={{fontWeight: 'bold'}}>State</th>
          <td>{`${state ? state : 'N/A'}`}</td>
        </tr>
        <tr>
          <th style={{fontWeight: 'bold'}}>Country</th>
          <td>{`${country ? country : 'N/A'}`}</td>
        </tr>

        </tbody>
      </table>
    </div>
  </div>)
}