import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import UploadForm from './UploadForm';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const CreateForm = (props) => {
  const {
    onSubmit,
    onCancel,
    modalVisible,
  } = props;

  const [form] = Form.useForm();

  // Submit form
  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  // Triggered after submitting the form and verifying data successfully
  const handleFinish = (formValues) => {
    onSubmit(formValues); // props function
  };

  const setLogoField = (endPointUrl) => {
    form.setFieldsValue({ logo: endPointUrl });
  };

  const renderContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish} initialValues={{showStatus: "0"}}>
        <FormItem
          name="name"
          label="Brand Name"
          rules={[
            {
              required: true,
              message: 'Brand name must not be empty！',
            },
          ]}
        >
          <Input placeholder="Brand Name" />
        </FormItem>
        <FormItem
          name="descript"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Description must have at least 5 words',
              min: 5,
            },
          ]}
        >
          <TextArea rows={4} placeholder="Description (at least 5 words)" />
        </FormItem>
        <FormItem name="logo" label="Logo"
          rules={[
            {
              required: true,
              message: 'Logo must not be empty!'
            },
          ]}
        >
          <UploadForm setLogoField={setLogoField}></UploadForm>
        </FormItem>
        <FormItem name="showStatus" label="Show Status">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="0">Hide</Option>
            <Option value="1">Show</Option>
          </Select>
        </FormItem>
        <FormItem
          name="firstLetter"
          label="First Letter"
          rules={[
            {
              required: true,
              message: 'First letter must not be empty!'
            },
            {
              validator(rule, value) {
                if (value == undefined) {
                  return Promise.reject(); // covered by required rule
                }
                if (value.length > 0 && !/^[a-zA-Z]$/.test(value)) {
                  return Promise.reject('First letter must be (A-Z) or (a-z) !');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="First Letter" />
        </FormItem>
        <FormItem
          name="sort"
          label="Sort"
          rules={[
            {
              required: true,
              message: 'Sort must not be empty!'
            },
            {
              validator(rule, value) {
                if (value == undefined) {
                  return Promise.reject(); // covered by required rule
                }
                if (isNaN(value) || value < 0) {
                  return Promise.reject('Sort value must be a positive integer');
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input placeholder="Sort" />
        </FormItem>
      </Form>
    );
  };

  return (
    <Modal
      destroyOnClose
      title="New Brand"
      visible={modalVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      {renderContent()}
    </Modal>
  );
};

export default CreateForm;
