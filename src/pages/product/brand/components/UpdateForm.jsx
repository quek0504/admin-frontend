import React, { useState } from 'react';
import { Form, Button, Input, Modal, Select, Steps } from 'antd';
import UploadForm from './UploadForm';

const FormItem = Form.Item;
const { Step } = Steps;
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

const UpdateForm = (props) => {
  const [formVals, setFormVals] = useState({
    name: props.values.name,
    descript: props.values.descript,
    key: props.values.key,
    sort: props.values.sort,
    showStatus: props.values.showStatus
  });
  const [currentStep, setCurrentStep] = useState(0);
  const [form] = Form.useForm();
  const {
    onSubmit: handleUpdate,
    onCancel: handleUpdateModalVisible,
    updateModalVisible,
    values,
  } = props;

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    setFormVals({ ...formVals, ...fieldsValue });

    if (currentStep < 2) {
      forward();
    } else {
      handleUpdate({ ...formVals, ...fieldsValue });
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <FormItem name="logo" label="Logo">
              <UploadForm />
          </FormItem>
        </>
      );
    }

    if (currentStep === 2) {
      return (
        <>
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
          <FormItem name="sort" label="Sort">
            <Input placeholder="Sort" />
          </FormItem>
        </>
      );
    }

    return (
      <>
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
      title="规则配置"
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
        <Step title="Brand Status" />
      </Steps>
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: formVals.name,
          descript: formVals.descript,
          sort: formVals.sort,
          showStatus: formVals.showStatus
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default UpdateForm;
