import React, {useState} from 'react'
import Loader from "./loader";
import {useParams} from 'react-router-dom'
import {Button, Form, Input, Select} from 'antd';
import useAxios from "../hooks/useAxios";
import axios from "axios";
import _Empty from "./empty";

const {Option} = Select;
const {TextArea} = Input;

export default function NewPatient() {
  const {patientId} = useParams()
  const [submitLoading, setSubmitLoading] = useState(false)
  const [form] = Form.useForm();
  const {data: patients, error, loading} = useAxios('patients.getAll')
  let currentPatient = []

  const submit = async (value) => {
    try {

      let duplicate = patients.filter((d) => d._id !== patientId && value.email === d.patientData.email)

      if (duplicate.length)
        throw new Error('patient with this email already exists')

      if (!patientId) {
        const data = await axios.post('/api/patients.insert', {
          ...value,
        })
        if (data && data.data && data.data.error)
          throw new Error(data.data.error)
        form.resetFields()
        return data
      } else {
        delete value.meta
        return await axios.post("/api/patients.update", {
          query: {_id: patientId},
          update: {...currentPatient, ...value}
        })
      }
    } catch (e) {
      throw new Error(e.message)
    }
  }
  if (loading)
    return <Loader/>
  if (error && !patientId)
    return <_Empty
        description={error ? error : !patientId ? 'Please Provide patient Id' : 'Something went wrong, please refresh'}/>

  if (patientId)
    currentPatient = patients.find(i => i._id === patientId)

  if (patientId && !currentPatient)
    return <_Empty description={'No patient with this id'}/>


  return (<div className={'row'}>
        <div className={'col-sm-6 login login-left'}>
          <h1>New patient</h1>
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
                firstname: currentPatient && currentPatient.patientData && currentPatient.patientData.firstname ? currentPatient.patientData.firstname : '',
                lastname: currentPatient && currentPatient.patientData && currentPatient.patientData.lastname ? currentPatient.patientData.lastname : '',
                email: currentPatient && currentPatient.patientData && currentPatient.patientData.email ? currentPatient.patientData.email : '',
                phone: currentPatient && currentPatient.patientData && currentPatient.patientData.phone ? currentPatient.patientData.phone : '',
                diagnosis: currentPatient && currentPatient.diagnosis ? currentPatient.diagnosis : [],
                city: currentPatient && currentPatient.city ? currentPatient.city : '',
                country: currentPatient && currentPatient.country ? currentPatient.country : '',
                state: currentPatient && currentPatient.state ? currentPatient.state : '',
                address: currentPatient && currentPatient.address ? currentPatient.address : '',
                pincode: currentPatient && currentPatient.pincode ? currentPatient.pincode : '',
                prescribedMedication: currentPatient.prescribedMedication ? currentPatient.prescribedMedication : []
              }}
              onFinish={async (value) => {
                let error_text = $("#error")
                try {
                  error_text.text('')
                  setSubmitLoading(true)
                  await submit(value)
                  error_text.css('color', '#99ff99').text(`patient is ${patientId ? 'updated' : 'added'} successfully`)
                  window.location.href = `/app/simple-doctor/view-patients`
                } catch (e) {
                  setSubmitLoading(false)
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
                name="email"
                disabled={patientId}
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
              <Input placeholder={'Email'} type={"email"} disabled={patientId}/>
            </Form.Item>
            <Form.Item
                name="phone"
                rules={[{required: true, message: 'Please input your phone number!'}]}
            >
              <Input style={{width: '100%'}} placeholder={'Phone Number'} type={"tel"}/>
            </Form.Item>
            <Form.Item
                name="diagnosis"
                rules={[{required: true, message: 'Select atleast one diagnosis', type: 'array'}]}
            >
              <Select mode="multiple" placeholder="Diagnosis">
                <Option value="Hypertension">Hypertension</Option>
                <Option value="Hyperlipidemia">Hyperlipidemia</Option>
                <Option value="Diabetes">Diabetes</Option>
                <Option value="Back pain">Back pain</Option>
                <Option value="Anxiety">Anxiety</Option>
                <Option value="Obesity">Obesity</Option>
                <Option value="Allergic rhinitis">Allergic rhinitis</Option>
                <Option value="Reflux esophagitis">Reflux esophagitis</Option>
              </Select>
            </Form.Item>
            <Form.Item
                name="prescribedMedication"
                rules={[{required: true, message: 'Select atleast one Prescribed Medication', type: 'array'}]}
            >
              <Select mode="multiple" placeholder="Prescribed Medication">
                <Option value="Metformin">Metformin</Option>
                <Option value="Amlodipine">Amlodipine</Option>
                <Option value="Metoprolol">Metoprolol</Option>
                <Option value="Levothyroxine">Levothyroxine</Option>
                <Option value="Azithromycin">Azithromycin</Option>
                <Option value="Lipitor">Lipitor</Option>
                <Option value="Amlodipine">Amlodipine</Option>
              </Select>
            </Form.Item>
            <Form.Item
                name="address"
                rules={[
                  {
                    required: false,
                    message: 'Required!',
                  },
                ]}
            >
              <TextArea autoSize={{minRows: 3, maxRows: 5}} placeholder="Address"/>
            </Form.Item>
            <Form.Item
                name="city"
                rules={[
                  {
                    required: false,
                    message: 'Required',
                  },
                  {
                    pattern: new RegExp('^(?!\\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 @&$]*)?$'),
                    message: 'Only letters!!!',
                  },
                ]}
            >
              <Input placeholder="City"/>
            </Form.Item>
            <Form.Item
                name="state"
                rules={[
                  {
                    required: false,
                    message: 'Required',
                  },
                  {
                    pattern: new RegExp('^(?!\\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 @&$]*)?$'),
                    message: 'Only letters!!!',
                  },
                ]}
            >
              <Input placeholder="State"/>
            </Form.Item>
            <Form.Item
                name="country"
                rules={[
                  {
                    required: false,
                    message: 'Required',
                  },
                  {
                    pattern: new RegExp('^(?!\\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 @&$]*)?$'),
                    message: 'Only letters!!!',
                  },
                ]}
            >
              <Input placeholder="Country"/>
            </Form.Item>
            <Form.Item
                name="pincode"
                rules={[
                  {
                    required: true,
                    message: 'Required',
                  },
                  {min: 6, message: 'Pincode must be minimum 6 characters.'},
                  {max: 6, message: 'Pincode must be maximum 6 characters.'},
                ]}
            >
              <Input placeholder="Pincode" type={"number"}/>
            </Form.Item>
            <Form.Item className={'form-buttons'}>
              <Button type="primary" htmlType="submit" className=""
                      loading={submitLoading}>{patientId ? 'Update' : 'Add'}</Button>
              <Button type='default' style={{margin: "0 8px"}} onClick={() => {
                window.location.href = `/app/simple-doctor/view-patients`
              }} loading={submitLoading}>Cancel</Button>
            </Form.Item>
          </Form>
        </div>
      </div>
  );
}