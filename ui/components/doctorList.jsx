import React from 'react'
import useSearch from "../hooks/useSearch";
import {Button, Space, Table} from "antd";

export default function DoctorList({search, doctors}) {
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
          <Button href={`/app/simple-doctor/new-doctor/${text}`}>Edit</Button>
          <Button href={`/app/simple-doctor/view-doctor/${text}`}>View</Button>
        </Space>
      }
    },
  ];
  let filteredDoctors = useSearch(search, doctors.map((d) => d.doctorData))
  return <Table bordered scroll={{x: 1500}} columns={columns} dataSource={filteredDoctors}/>
}