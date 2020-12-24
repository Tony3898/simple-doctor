import React, {useState} from 'react'
import useAxios from "../hooks/useAxios";
import _Empty from "./empty";
import Subheader from "./subheader";
import Loader from "./loader";
import PatientList from "./patientsList";

export default function Patients() {
  const [search, setSearch] = useState('')
  const {data: patients, error, loading} = useAxios('patients.getAll')
  if (error)
    return <_Empty description={error}/>
  return <div className={'row'}>
    <div className={'col-sm-12'}>
      <Subheader title={'All Patients'} onSearchChange={(e) => {
        setSearch(e.target.value)
      }} actions={[
        {title: 'New Patients', href: '/app/simple-doctor/new-patient'},
        {title: 'View All Doctors', href: '/app/simple-doctor/home'},
      ]}/>
    </div>
    <div className={'col-sm-12'}>
      {
        loading ? <Loader/> : <PatientList search={search} patients={patients}/>
      }
    </div>
  </div>
}