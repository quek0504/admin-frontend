import React from 'react';
import { Cascader, Form, Input, Modal, Select, Switch } from 'antd';

const { Option } = Select;
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
  const {
    onSubmit,
    onCancel,
    modalVisible,
    productCategory,
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
    form.resetFields();
  };

  const handleTag = (value) => {
    console.log(`selected ${value}`);
  }

  const filter = (inputValue, path) => {
    // default fieldname of 'label' changed to 'name' here
    // option.label.toLowerCase() => option.name.toLowerCase() 
    return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  const renderContent = () => {
    return (
      <>
        <FormItem
          name="attrName"
          label="Attribute Name"
          rules={[
            {
              required: true,
              message: 'Attribute name must not be empty！',
            },
          ]}
        >
          <Input placeholder="Attribute Type" />
        </FormItem>
        <FormItem
          name="attrType"
          label="Attribute Type"
          rules={[
            {
              required: true,
              message: 'Attribute type must be selected',
            },
          ]}
        >
          <Select
            placeholder="Select attribute type"
          >
            <Option value={0}>Sales Attribute</Option>
          </Select>
        </FormItem>
        <FormItem
          name="valueType"
          label="Value Type"
          rules={[
            {
              required: true,
            }
          ]}
          valuePropName="checked"
        >
          <Switch checkedChildren="Multiple Values" unCheckedChildren="Single Value" />
        </FormItem>
        <FormItem
          name="valueSelect"
          label="Attribute Values"
        >
          <Select mode="tags" style={{ width: '100%' }} placeholder="Values" onChange={handleTag} />
        </FormItem>
        <FormItem name="icon" label="Icon"
          rules={[
            {
              required: true,
              message: 'Icon must not be empty!'
            },
          ]}
        >
          <Input placeholder="Icon" />
        </FormItem>
        <FormItem
          name="categoryId"
          label="Category ID"
          rules={[
            {
              required: true,
              message: 'Category ID must not be empty!'
            }
          ]}
        >
          <Cascader
            placeholder="Please select"
            options={productCategory.data}
            fieldNames={{ label: 'name', value: 'catId', children: 'children' }}
            showSearch={{ filter }}
          />
        </FormItem>
        <FormItem
          name="searchType"
          label="Attribute Searchable"
          rules={[
            {
              required: true,
            }
          ]}
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </FormItem>
        <FormItem
          name="showDesc"
          label="Show in store"
          rules={[
            {
              required: true,
            }
          ]}
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </FormItem>
        <FormItem
          name="enable"
          label="Attribute Enabled"
          rules={[
            {
              required: true,
            }
          ]}
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
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
      title="New Sales Attribute"
      visible={modalVisible}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form
        {...formLayout}
        form={form}
        onFinish={handleFinish}
        initialValues={{ valueType: false, searchType: false, showDesc: false, enable: false }} >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default CreateForm;
