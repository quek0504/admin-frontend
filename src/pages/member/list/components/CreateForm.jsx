import React, { useEffect } from 'react';
import { Switch, Form, Input, Modal, InputNumber } from 'antd';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const CreateForm = (props) => {
  const { onSubmit, onCancel, modalVisible } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    // set form default value
    form.setFieldsValue({
      growthPoint: 100,
      defaultStatus : false,
      freeFreightPoint: 100,
      commentGrowthPoint: 100,
      priviledgeFreeFreight: false,
      priviledgeMemberPrice: false,
      priviledgeBirthday: false,
    });
  }, [modalVisible]);

  // Submit form
  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  // Triggered after submitting the form and verifying data successfully
  const handleFinish = (formValues) => {
    onSubmit(formValues); // props function
    form.resetFields();
  };

  const renderContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <FormItem
          name="name"
          label="Membership"
          rules={[
            {
              required: true,
              message: 'Membership must not be empty！',
            },
          ]}
        >
          <Input placeholder="Membership" />
        </FormItem>
        <FormItem
          name="growthPoint"
          label="Growth Point (GP)"
        >
          <InputNumber style={{ width: 200 }} defaultValue="100" min="0" step="100" />
        </FormItem>
        <FormItem
          name="defaultStatus"
          label="Default Membership"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </FormItem>
        <FormItem
          name="freeFreightPoint"
          label="Free Shipping Point"
        >
          <InputNumber style={{ width: 200 }} defaultValue="100" min="0" step="100" />
        </FormItem>
        <FormItem
          name="commentGrowthPoint"
          label="Comment GP"
        >
          <InputNumber style={{ width: 200 }} defaultValue="100" min="0" step="100" />
        </FormItem>
        <FormItem
          name="priviledgeFreeFreight"
          label="Free Shipping"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </FormItem>
        <FormItem
          name="priviledgeMemberPrice"
          label="Member Price Priviledge"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </FormItem>
        <FormItem
          name="priviledgeBirthday"
          label="Birthday Priviledge"
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </FormItem>
        <FormItem
          name="note"
          label="Note"
          rules={[
            {
              required: true,
              message: 'Note must not be empty！',
            },
          ]}
        >
          <Input placeholder="Note" />
        </FormItem>
      </Form>
    );
  };

  return (
    <Modal
      destroyOnClose
      title="New Membership"
      visible={modalVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
      width={1000}
    >
      {renderContent()}
    </Modal>
  );
};

export default CreateForm;
