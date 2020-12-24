import React from 'react'
import useAxios from "../hooks/useAxios";
import Loader from "./loader";
import Doctor from "./doctor";
import _Empty from "./empty";

export default function home() {
  const {data, error, loading} = useAxios('auth.getLoggedInUserData')
  if (loading)
    return <Loader/>
  if (error)
    return <_Empty description={error}/>

  return data && data.type === 'doctor' ? <Doctor/> : <>{window.location.href = '/auth/profile'}</>
}