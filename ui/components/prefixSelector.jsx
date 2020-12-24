import {Form, Select} from "antd";
import React from "react";

const {Option} = Select;

export default function prefixSelector() {
  return <Form.Item name="prefix" noStyle>
    <Select defaultValue="91" style={{width: 70}}>
      <Option value="91">+91</Option>
      <Option value="87">+87</Option>
    </Select>
  </Form.Item>
};