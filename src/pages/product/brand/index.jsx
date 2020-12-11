import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, message, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import { connect } from 'umi';
import { addBrand, removeBrand, updateBrand } from './service';
/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
  const hide = message.loading('Creating');

  try {
    await addBrand({ ...fields });
    hide();
    message.success('Create Successful!');
    return true;
  } catch (error) {
    hide();
    message.error('Something went wrong, pleease try again!');
    return false;
  }
};
/**
 * 更新节点
 * @param fields
 */

const handleUpdate = async (fields) => {
  const hide = message.loading('Updating');

  try {
    await updateBrand({
      name: fields.name,
      descript: fields.descript,
      key: fields.key,
    });
    hide();
    message.success('Update Successful!');
    return true;
  } catch (error) {
    hide();
    message.error('Something went wrong, pleease try again!');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedRows) => {
  const hide = message.loading('Deleting');
  if (!selectedRows) return true;

  try {
    await removeBrand({
      key: selectedRows.map((row) => row.key),
    });
    hide();
    message.success('Delete Successful! Going to refresh...');
    return true;
  } catch (error) {
    hide();
    message.error('Something went wrong, pleease try again!');
    return false;
  }
};

const ProductBrand = (props) => {

  const {
    dispatch,
    productBrand, // data from model
  } = props;

  const [createModalVisible, handleModalVisible] = useState(false);
  const [updateModalVisible, handleUpdateModalVisible] = useState(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
  const [selectedRowsState, setSelectedRows] = useState([]);
  const columns = [
    {
      title: 'ID',
      dataIndex: 'brandId',
      tip: 'Primary Key',
      hideInForm: true,
    },
    {
      title: 'Brand Name',
      dataIndex: 'name',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'Brand name must not be empty!',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      hideInSearch: true,
      render: (_, entity) => {
        if (entity.logo) {
          return <img src={entity.logo} />
        }
        return <p>No Image</p>
      }
    },
    {
      title: 'Description',
      dataIndex: 'descript',
      valueType: 'textarea',
    },
    {
      title: 'Show Status',
      dataIndex: 'showStatus',
      valueEnum: {
        0: {
          text: 'Hide',
          status: '0',
        },
        1: {
          text: 'Show',
          status: '1',
        },
      },
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            Edit
          </a>
          <Divider type="vertical" />
          <a href="">Delete</a>
        </>
      ),
    },
  ];

  useEffect(() => {
    dispatch({
      type: 'productBrand/fetch',
    });
  }, [1]);

  return (
    <PageContainer>
      <ProTable
        headerTitle="Brand Management"
        actionRef={actionRef}
        rowKey="brandId"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleModalVisible(true)}>
            <PlusOutlined /> New Brand
          </Button>,
        ]}
        // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
        columns={columns}
        dataSource={productBrand.data}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Selected{' '}
              <a
                style={{
                  fontWeight: 600,
                }}
              >
                {selectedRowsState.length}
              </a>{' '}
              items&nbsp;&nbsp;
              <span>{/*  */}</span>
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Batch Delete
          </Button>
          <Button type="primary">Batch Update</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false)
        }}
        modalVisible={createModalVisible}
      />
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);

            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});

              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};
export default connect(({ productBrand }) => ({
  productBrand,
}))(ProductBrand);
