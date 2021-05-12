import React, { useEffect } from 'react';
import { InputNumber, Form, Input, Modal, Switch } from 'antd';

const FormItem = Form.Item;
const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const UpdateForm = (props) => {
  const {
    onSubmit,
    onCancel,
    updateModalVisible,
    values,
  } = props;

  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue({
      ...values,
    });
  }, []);

    // Submit form
    const handleSubmit = () => {
      if (!form) return;
      form.submit();
    };
  
    // Triggered after submitting the form and verifying data successfully
    const handleFinish = (formValues) => {
      let formWithId = {
        ...formValues,
        'id': values.id
      }

      onSubmit(formWithId); // props function
    };

  const renderContent = () => {
    return (
      <>
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
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{
        padding: '32px 40px 48px',
      }}
      destroyOnClose
      title="Membership Update"
      visible={updateModalVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form
        {...formLayout}
        form={form}
        onFinish={handleFinish}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
