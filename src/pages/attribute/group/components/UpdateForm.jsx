import React, { useState, useEffect } from 'react';
import { Cascader, Space, Form, Button, Input, Image, Modal, Steps } from 'antd';

const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
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
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    queryAttrGroup,
    values,
    productCategory
  } = props;

  const [formVals, setFormVals] = useState();
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();

  useEffect(() => {
    let categoryPath;
    queryAttrGroup(values.attrGroupId).then((response) => {
      if(response) {
        categoryPath = response.attrGroup.categoryPath;
        form.setFieldsValue({
          ...values,
          categoryId: categoryPath
        });
        setFormVals({
          ...values,
          categoryId: categoryPath
        });
      }
    })
  }, []);

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });

    if (currentStep < 2) {
      forward();
    } else {
      handleUpdate({ ...formVals, ...fieldsValue});
    }
  };

  // const setLogoField = (endPointUrl) => {
  //   setFormVals({ ...formVals, logo: endPointUrl });
  //   form.setFieldsValue({ logo: endPointUrl });
  // };

  const filter = (inputValue, path) => {
    // default fieldname of 'label' changed to 'name' here
    // option.label.toLowerCase() => option.name.toLowerCase() 
    return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <FormItem name="sort" label="Sort">
            <Input placeholder="Sort" />
          </FormItem>
          <FormItem name="categoryId" label="Category ID">
            <Cascader
              placeholder="Please select"
              options={productCategory.data}
              fieldNames={{ label: 'name', value: 'catId', children: 'children' }}
              showSearch={{ filter }}
            />
          </FormItem>
        </>
      );
    }

    return (
      <>
        <FormItem
          name="attrGroupName"
          label="Attribute Group Name"
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
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button
            style={{
              float: 'left',
            }}
            onClick={backward}
          >
            Previous
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false, values)}>Cancel</Button>
          <Button type="primary" onClick={() => handleNext()}>
            Next
          </Button>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
          <Button
            style={{
              float: 'left',
            }}
            onClick={backward}
          >
            Previous
          </Button>
          <Button onClick={() => handleUpdateModalVisible(false, values)}>Cancel</Button>
          <Button type="primary" onClick={() => handleNext()}>
            Submit
          </Button>
        </>
      );
    }

    return (
      <>
        <Button onClick={() => handleUpdateModalVisible(false, values)}>Cancel</Button>
        <Button type="primary" onClick={() => handleNext()}>
          Next
        </Button>
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
      title="Attribute Group Update"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={() => handleUpdateModalVisible()}
    >
      <Steps
        style={{
          marginBottom: 28,
        }}
        size="small"
        current={currentStep}
      >
        <Step title="Basic Info" />
        <Step title="Upload Picture" />
        <Step title="Attribute Group Status" />
      </Steps>
      <Form
        {...formLayout}
        form={form}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
