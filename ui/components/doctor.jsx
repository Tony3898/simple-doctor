import React, {useState} from 'react'
import Subheader from "./subheader";
import useAxios from "../hooks/useAxios";
import _Empty from "./empty";
import Loader from "./loader";
import DoctorList from "./doctorList";

export default function Doctor() {
  const [search, setSearch] = useState('')
  const {data: doctors, error, loading} = useAxios('doctors.getAll')
  if (error)
    return <_Empty description={error}/>
  return <div className={'row'}>
    <div className={'col-sm-12'}>
      <Subheader title={'All Doctors'} onSearchChange={(e) => {
        setSearch(e.target.value)
      }} actions={[
        {title: 'New Doctor', href: '/app/simple-doctor/new-doctor'},
        {title: 'View All Patients', href: '/app/simple-doctor/view-patients'},
      ]}/>
    </div>
    <div className={'col-sm-12'}>
      {
        loading ? <Loader/> : <DoctorList search={search} doctors={doctors}/>
      }
    </div>
  </div>
}