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

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (formValues) => {
    console.log(formValues);
    onSubmit(formValues);
  };

  const renderContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
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
        <FormItem name="logo" label="Logo">
          <UploadForm></UploadForm>
        </FormItem>
        <FormItem name="show_status" label="Show Status">
          <Select
            style={{
              width: '100%',
            }}
          >
            <Option value="0">Hide</Option>
            <Option value="1">Show</Option>
          </Select>
        </FormItem>
        <FormItem name="sort" label="Sort">
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
