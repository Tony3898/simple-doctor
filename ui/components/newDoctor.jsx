import React, {useState} from 'react'
import Loader from "./loader";
import {useParams} from 'react-router-dom'
import {Button, Form, Input, Select} from 'antd';
import useAxios from "../hooks/useAxios";
import axios from "axios";
import prefixSelector from "./prefixSelector";
import _Empty from "./empty";

const {Option} = Select;
const {TextArea} = Input;

function NewDoctor() {
  const {doctorId} = useParams()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm();
  const {data: doctors, error, loading} = useAxios('doctors.getAll')
  let currentDoctor = []

  const submit = async (value) => {
    try {

      let duplicate = doctors.filter((d) => d._id !== doctorId && value.email === d.doctorData.email)

      if (duplicate.length)
        throw new Error('Doctor with this email already exists')

      if (!doctorId) {
        const data = await axios.post('/api/doctors.insert', {
          ...value,
        })
        form.resetFields()
        if (data && data.data && data.data.error)
          throw new Error(data.data.error)
        return data
      } else {
        delete value.meta
        return await axios.post("/api/doctors.update", {
          query: {_id: doctorId},
          update: {...currentDoctor, ...value}
        })
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }
  if (loading)
    return <Loader/>
  if (error && !doctorId)
    return <_Empty
        description={error ? error : !doctorId ? 'Please Provide Doctor Id' : 'Something went wrong, please refresh'}/>

  if (doctorId)
    currentDoctor = doctors.find(i => i._id === doctorId)

  if (doctorId && !currentDoctor)
    return <_Empty description={'No doctor with this id'}/>

  return (<div className={'row'}>
        <div className={'col-sm-6 login login-left'}>
          <h1>New Doctor</h1>
        </div>
        <div className={'col-sm-6 login login-right add-projects-right'}>
          <div>
            <span className='error-text' id={'error'}/>
          </div>
          <Form
              form={form}
              name="normal_login"
              className="login-form"
              initialValues={{
                firstname: currentDoctor && currentDoctor.doctorData && currentDoctor.doctorData.firstname ? currentDoctor.doctorData.firstname : '',
                lastname: currentDoctor && currentDoctor.doctorData && currentDoctor.doctorData.lastname ? currentDoctor.doctorData.lastname : '',
                email: currentDoctor && currentDoctor.doctorData && currentDoctor.doctorData.lastname ? currentDoctor.doctorData.email : '',
                phone: currentDoctor && currentDoctor.doctorData && currentDoctor.doctorData.phone ? currentDoctor.doctorData.phone : '',
              }}
              onFinish={async (value) => {
                let error_text = $("#error")
                try {
                  error_text.text('')
                  setSubmitLoading(true)
                  await submit(value)
                  error_text.css('color', '#99ff99').text(`Doctor is ${doctorId ? 'updated' : 'added'} successfully`)
                  window.location.href = `/app/simple-doctor/home`
                } catch (e) {
                  error_text.text('Error: ' + e.message)
                }
              }}
          >
            <Form.Item
                name="firstname"
                rules={[
                  {
                    required: true,
                    message: 'Required',
                  },
                  {
                    pattern: new RegExp('^(?!\\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 @&$]*)?$'),
                    message: 'Only letters!!!',
                  },
                ]}
            >
              <Input placeholder="FirstName"/>
            </Form.Item>
            <Form.Item
                name="lastname"
                rules={[
                  {
                    required: true,
                    message: 'Required',
                  },
                  {
                    pattern: new RegExp('^(?!\\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 @&$]*)?$'),
                    message: 'Only letters!!!',
                  },
                ]}
            >
              <Input placeholder="Lastname"/>
            </Form.Item>
            <Form.Item
                disabled={doctorId}
                name="email"
                rules={[
                  {
                    type: 'email',
                    message: 'The input is not valid E-mail!',
                  },
                  {
                    required: true,
                    message: 'Please input your E-mail!',
                  },
                ]}
            >
              <Input placeholder={'Email'} disabled={doctorId}/>
            </Form.Item>
            <Form.Item
                name="phone"
                rules={[{required: true, message: 'Please input your phone number!'}]}
            >
              <Input style={{width: '100%'}} placeholder={'Phone Number'} type={"tel"}/>
            </Form.Item>
            <Form.Item className={'form-buttons'}>
              <Button type="primary" htmlType="submit" className=""
                      loading={submitLoading}>{doctorId ? 'Update' : 'Add'}</Button>
              <Button type='default' style={{margin: "0 8px"}} onClick={() => {
                window.location.href = `/app/simple-doctor/home`
              }} loading={submitLoading}>Cancel</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
  );
}

export default NewDoctor
