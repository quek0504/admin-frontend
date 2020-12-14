import React, { useEffect } from 'react';
import { Modal, Form, Input } from 'antd';

const formLayout = {
  labelCol: {
    span: 7,
  },
  wrapperCol: {
    span: 13,
  },
};

const OperationModal = (props) => {
  const [form] = Form.useForm();
  const { visible, edit, currentItem, onCancel, onSubmit } = props;
  useEffect(() => {
    if (form && !visible) {
      form.resetFields();
    }
  }, [props.visible]);
  useEffect(() => {
    if (edit) {
      form.setFieldsValue({
        ...currentItem,
      });
    }
  }, [props.currentItem]);

  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  const handleFinish = (formValues) => {
    if (onSubmit) {
      // Add additional information
      let submitValues;
      if (!edit) {
        submitValues = {
          parentCid: currentItem.catId,
          catLevel: currentItem.catLevel + 1,
          showStatus: 1,
          sort: 0,
          productCount: 0,
          ...formValues, // name, icon, productUnit
        };
      } else {
        submitValues = {
          catId: currentItem.catId,
          ...formValues, // name, icon, productUnit
        };
      }
      onSubmit(submitValues);
    }
  };

  const getModalContent = () => {
    return (
      <Form {...formLayout} form={form} onFinish={handleFinish}>
        <Form.Item
          name="name"
          label="Category"
          rules={[
            {
              required: true,
              message: "Category can't be empty.",
            },
          ]}
        >
          <Input placeholder="Category" />
        </Form.Item>
        <Form.Item name="icon" label="Icon Url">
          <Input placeholder="Icon Url" />
        </Form.Item>
        <Form.Item name="productUnit" label="Product Unit">
          <Input placeholder="Product Unit" />
        </Form.Item>
      </Form>
    );
  };

  return (
    <Modal
      title={edit === false ? 'Add Category Form' : 'Edit Category Form'}
      width={640}
      bodyStyle={{
        padding: '28px 0 0',
      }}
      destroyOnClose
      onCancel={onCancel}
      okText="save"
      onOk={handleSubmit}
      visible={visible}
    >
      {getModalContent()}
    </Modal>
  );
};

export default OperationModal;
