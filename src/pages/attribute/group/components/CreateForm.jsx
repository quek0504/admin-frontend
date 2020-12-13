import React from 'react';
import { Form, Input, Modal } from 'antd';

const FormItem = Form.Item;
const { TextArea } = Input;
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

  // const setLogoField = (endPointUrl) => {
  //   form.setFieldsValue({ logo: endPointUrl });
  // };

  const renderContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <FormItem
          name="attrGroupName"
          label="Attribute Group"
          rules={[
            {
              required: true,
              message: 'Attribute group name must not be empty！',
            },
          ]}
        >
          <Input placeholder="Attribute Group Name" />
        </FormItem>
        <FormItem
          name="descript"
          label="Description"
          rules={[
            {
              required: true,
              message: 'Description must have at least 5 words!',
              min: 5,
            },
          ]}
        >
          <TextArea rows={4} placeholder="Description (at least 5 words)" />
        </FormItem>
        {/* <FormItem name="logo" label="Logo"
          rules={[
            {
              required: true,
              message: 'Logo must not be empty!'
            },
          ]}
        >
          <UploadForm setLogoField={setLogoField}></UploadForm>
        </FormItem> */}
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
        <FormItem
          name="catelogId"
          label="Category ID"
          rules={[
            {
              required: true,
              message: 'Category ID must not be empty!'
            }
          ]}
        >
          <Input placeholder="Category ID" />
        </FormItem>
      </Form>
    );
  };

  return (
    <Modal
      destroyOnClose
      title="New Attribute Group"
      visible={modalVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      {renderContent()}
    </Modal>
  );
};

export default CreateForm;
