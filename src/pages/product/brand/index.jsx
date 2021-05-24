import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Image, Modal, message, Drawer } from 'antd';
import React, { useState, useRef, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import Media from 'react-media';
import { connect } from 'umi';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import CategoryRelationModal from './components/CategoryRelationModal';
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
    message.error('Something went wrong, please try again!');
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
    await updateBrand({ ...fields });
    hide();
    message.success('Update Successful!');
    return true;
  } catch (error) {
    hide();
    message.error('Something went wrong, please try again!');
    return false;
  }
};
/**
 *  删除节点
 * @param selectedRows
 */

const handleRemove = async (selectedId) => {
  const hide = message.loading('Deleting');

  try {
    await removeBrand([selectedId]);
    hide();
    message.success('Delete Successful!');
    return true;
  } catch (error) {
    hide();
    message.error('Something went wrong, please try again!');
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
  const [deleteModalVisible, handleDeleteModalVisible] = useState(false);
  const [categoryRelationModalVisible, handleRelationModalVisible] = useState(false);
  const [selectedBrandId, setSelectedBrandId] = useState();
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef();
  const [row, setRow] = useState();
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
      hideOnSmall: true,
      render: (_, entity) => {
        if (entity.logo) {
          return <Image src={entity.logo} height={200} width={200} />;
        }
        return <p>No Image</p>;
      },
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
      title: 'First Letter',
      dataIndex: 'firstLetter',
    },
    {
      title: 'Sort',
      dataIndex: 'sort',
    },
    {
      title: 'Action',
      dataIndex: 'option',
      valueType: 'option',
      hideOnSmall: true,
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleRelationModalVisible(true);
              setSelectedBrandId(record.brandId);
            }}
          >
            Category Relation
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            Edit
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              handleDeleteModalVisible(true);
            }}
          >
            Delete
          </a>
          {/* Delete Modal */}
          <Modal
            title="Confirmation"
            visible={deleteModalVisible}
            onOk={async () => {
              const success = await handleRemove(record.brandId);

              if (success) {
                handleDeleteModalVisible(false);
                // refresh table
                dispatch({
                  type: 'productBrand/fetch',
                });
              }
            }}
            onCancel={() => {
              handleDeleteModalVisible(false);
            }}
          >
            Are you sure want to delete this record?
          </Modal>
        </>
      ),
    },
  ];

  const getResponsiveColumns = (smallScreen) =>
    columns.filter(({ hideOnSmall = false }) => !(smallScreen && hideOnSmall));

  useEffect(() => {
    dispatch({
      type: 'productBrand/fetch',
    });
  }, [1]);

  return (
    <PageContainer>
      <Media query="(max-width: 992px)">
        {(smallScreen) => {
          return (
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
              columns={getResponsiveColumns(smallScreen)}
              dataSource={productBrand.data}
            />
          );
        }}
      </Media>
      <CreateForm
        onSubmit={async (value) => {
          const success = await handleAdd(value);

          if (success) {
            handleModalVisible(false);

            dispatch({
              type: 'productBrand/fetch',
            });

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleModalVisible(false);
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

              dispatch({
                type: 'productBrand/fetch',
              });

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

      {selectedBrandId ? (
        <CategoryRelationModal
          onCloseModal={() => {
            handleRelationModalVisible(false);
            setSelectedBrandId();
          }}
          modalVisible={categoryRelationModalVisible}
          selectedBrandId={selectedBrandId}
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
