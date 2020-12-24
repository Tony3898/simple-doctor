import React from 'react'
import useSearch from "../hooks/useSearch";
import {Button, Space, Table} from "antd";

export default function PatientList({search, patients}) {
  const columns = [
    {
      title: 'First Name',
      dataIndex: 'firstname',
      key: 'firstname',
    },
    {
      title: 'Last Name',
      dataIndex: 'lastname',
      key: 'lastname',
    },
    {
      title: 'E-mail',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Username',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: 'Actions',
      dataIndex: 'username',
      key: 'username',
      render: (text, record) => {
        return <Space>
          <Button href={`/app/simple-doctor/new-patient/${text}`}>Edit</Button>
          <Button href={`/app/simple-doctor/view-patient/${text}`}>View</Button>
        </Space>
      }
    },
  ];
  let filteredPatients = useSearch(search, patients.map((d) => d.patientData))
  return <Table bordered scroll={{x: 1500}} columns={columns} dataSource={filteredPatients}/>
}