import React, { useState, useEffect } from 'react';
import { Cascader, Select, Form, Input, Modal, Switch } from 'antd';

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

const UpdateForm = (props) => {

  const {
    onSubmit,
    onCancel,
    updateModalVisible,
    productCategory,
    queryAttrGroup,
    values,
  } = props;

  const [form] = Form.useForm();
  const [attrGroups, setAttrGroups] = useState([]);
  const [isDefaultAttrGroup, setIsDefaultAttrGroup] = useState(true);

  useEffect(() => {
    form.setFieldsValue({
      ...values,
      categoryId: values.categoryPath,
      valueType: values.valueType ? true : false,
      searchType: values.searchType ? true : false,
      showDesc: values.showDesc ? true : false,
      enable: values.enable ? true : false,
    });
    if (values.valueSelect) {
      form.setFieldsValue({
        valueSelect: values.valueSelect.split(',')
      })
    }
    if (values.attrGroupId) {
      setAttrGroups([{
        attrGroupId: values.attrGroupId,
        attrGroupName: values.groupName
      }]);
    }
  }, [values]);

  // Submit form
  const handleSubmit = () => {
    if (!form) return;
    form.submit();
  };

  // Triggered after submitting the form and verifying data successfully
  const handleFinish = (formValues) => {
    let formWithId = {
      ...formValues,
      'attrId': values.attrId
    }
    onSubmit(formWithId); // props function
  };

  const handleTag = (value) => {
    console.log(`selected ${value}`);
  }

  const onCascaderChange = (value) => {
    form.setFieldsValue({
      attrGroupId: null
    });
    // make sure cascader has selected value
    if(value[value.length - 1]) {
      queryAttrGroup(value[value.length - 1]).then((response) => {
        if (response) {
          setAttrGroups(response.page.list);
        }
      });
    }
  }

  const onSelectFocus = () => {
    // fetching complete attr groups list for the first time on focus
    // only one attr group was associated with category when the form values were set
    if (isDefaultAttrGroup) {
      let categoryPath = form.getFieldValue('categoryId');
      queryAttrGroup(categoryPath[categoryPath.length - 1]).then((response) => {
        if (response) {
          setAttrGroups(response.page.list);
          setIsDefaultAttrGroup(false);
        }
      });
    }
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
            <Option value={1}>Specification</Option>
          </Select>
        </FormItem>
        <FormItem
          name="valueType"
          label="Value Type"
          rules={[
            {
              required: true,
            },
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
        <FormItem name="icon" label="Icon">
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
            onChange={onCascaderChange}
          />
        </FormItem>
        <FormItem
          name="attrGroupId"
          label="Attribute Group"
          rules={[
            {
              required: true,
              message: 'Attribute group must be selected',
            },
          ]}
        >
          <Select
            placeholder="Select attribute group"
            onFocus={onSelectFocus}
          >
            {
              attrGroups.map((attrGroup, i) => {
                return (<Option key={i} value={attrGroup.attrGroupId}>{attrGroup.attrGroupName}</Option>)
              })
            }
          </Select>
        </FormItem>
        <FormItem
          name="searchType"
          label="Specification Searchable"
          rules={[
            {
              required: true,
            },
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
            },
          ]}
          valuePropName="checked"
        >
          <Switch checkedChildren="Yes" unCheckedChildren="No" />
        </FormItem>
        <FormItem
          name="enable"
          label="Specification Enabled"
          rules={[
            {
              required: true,
            },
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
      title="Specification Update"
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
