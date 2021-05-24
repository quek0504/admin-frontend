import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Image, Modal, message } from 'antd';
import React, { useState, useRef, useContext } from 'react';
import ProTable from '@ant-design/pro-table';
import Media from 'react-media';
import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';
import AttributeRelationModal from './AttributeRelationModal';
import { queryAttrGroupInfo, addAttrGroup, removeAttrGroup, updateAttrGroup } from '../service';
import { TreeContext } from '../index';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
    const hide = message.loading('Creating');

    try {
        await addAttrGroup({ ...fields });
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
        await updateAttrGroup({ ...fields });
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
        await removeAttrGroup([selectedId]);
        hide();
        message.success('Delete Successful!');
        return true;
    } catch (error) {
        hide();
        message.error('Something went wrong, please try again!');
        return false;
    }
};

const queryAttrGroup = async (attrGroupId) => {
    try {
        return await queryAttrGroupInfo(attrGroupId);;
    } catch (error) {
        message.error('Something went wrong, please try again!');
        return false;
    }
};

const GroupTable = (props) => {
    const {
        productCategory,
        attrGroup,
        getTable,
    } = props;

    const { expand, select } = useContext(TreeContext);

    const [treeExpandedKeys, setTreeExpandedKeys] = expand;
    const [treeSelectedKeys, setTreeSelectedKeys] = select;

    const [createModalVisible, handleModalVisible] = useState(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [deleteModalVisible, handleDeleteModalVisible] = useState(false);
    const [attributeRelationModalVisible, handleRelationModalVisible] = useState(false);
    const [selectedTableKey, setSelectedTableKey] = useState();
    const [stepFormValues, setStepFormValues] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: 'ID',
            dataIndex: 'attrGroupId',
            tip: 'Primary Key',
            hideInForm: true,
        },
        {
            title: 'Attribute Group',
            dataIndex: 'attrGroupName',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Attribute group name must not be empty!',
                    },
                ],
            },
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
            hideOnSmall: true,
            render: (_, entity) => {
                if (entity.logo) {
                    return <Image src={entity.logo} height={200} width={200} />
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
            title: 'Sort',
            dataIndex: 'sort',
        },
        {
            title: 'Category ID',
            dataIndex: 'categoryId',
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
                            setSelectedTableKey(record.attrGroupId);
                        }}
                    >
                        Attribute Relation
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
                    <a  onClick={() => {
                            handleDeleteModalVisible(true);
                        }}
                    >
                        Delete
                    </a>
                     {/* Delete Modal */}
                    <Modal
                        title="Confirmation"
                        visible={deleteModalVisible}
                        onOk={ async () => {
                            const success = await handleRemove(record.attrGroupId);

                            if (success) {
                                handleDeleteModalVisible(false);
                                // refresh table
                                getTable([record.attrGroupId], "");
                            }
                        }}
                        onCancel={ () => {handleDeleteModalVisible(false)}}
                    >
                        Are you sure want to delete this record?
                    </Modal>
                </>
            ),
        },
    ];

    const getResponsiveColumns = (smallScreen) =>
        columns.filter(({ hideOnSmall = false }) => !(smallScreen && hideOnSmall));

    return (
        <div>
            <Media query="(max-width: 992px)">
                {smallScreen => {
                    return (
                        <ProTable
                            headerTitle="Attribute Group Management"
                            actionRef={actionRef}
                            rowKey="attrGroupId"
                            toolBarRender={() => [
                                <Button type="primary" onClick={() => handleModalVisible(true)}>
                                    <PlusOutlined /> New Group
                                </Button>,
                            ]}
                            // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
                            columns={getResponsiveColumns(smallScreen)}
                            dataSource={attrGroup.data}
                            search={false}
                            options={{
                                search: true,
                            }}
                            request={(params) => {
                                let keyword = params.keyword === undefined ? undefined : params.keyword.trim();
                                getTable(treeSelectedKeys, keyword);
                            }}
                        />
                    )
                }}
            </Media>
            <CreateForm
                onSubmit={async (value) => {
                    let toSubmit = {
                        ...value,
                        categoryId: value.categoryId[value.categoryId.length - 1]
                    }
                    const success = await handleAdd(toSubmit);

                    if (success) {
                        handleModalVisible(false);

                        getTable([toSubmit.categoryId], null);

                        // keys need to be a string array
                        setTreeExpandedKeys(value.categoryId.map(String)); // convert int array to string array

                        let toSelect = [];
                        toSelect.push((value.categoryId[value.categoryId.length - 1]).toString());
                        setTreeSelectedKeys(toSelect);

                        // refresh
                        getTable(toSelect, "");

                        if (actionRef.current) {
                            actionRef.current.reload();
                        }
                    }
                }}
                onCancel={() => {
                    handleModalVisible(false)
                }}
                modalVisible={createModalVisible}
                productCategory={productCategory}
            />
            {stepFormValues && Object.keys(stepFormValues).length ? (
                <UpdateForm
                    onSubmit={async (value) => {
                        let toSubmit = {
                            ...value,
                            categoryId: value.categoryId[value.categoryId.length - 1]
                        }
                        const success = await handleUpdate(toSubmit);

                        if (success) {
                            handleUpdateModalVisible(false);
                            setStepFormValues({});

                            // keys need to be a string array
                            setTreeExpandedKeys(value.categoryId.map(String)); // convert int array to string array

                            let toSelect = [];
                            toSelect.push((value.categoryId[value.categoryId.length - 1]).toString());
                            setTreeSelectedKeys(toSelect);

                            // refresh
                            getTable(toSelect, "");

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
                    queryAttrGroup={queryAttrGroup}
                    values={stepFormValues}
                    productCategory={productCategory}
                />
            ) : null}
            {selectedTableKey ? (
                <AttributeRelationModal
                    onCloseModal={() => {
                        handleRelationModalVisible(false);
                        setSelectedTableKey();
                    }}
                    modalVisible={attributeRelationModalVisible}
                    selectedTableKey={selectedTableKey}
                />
            ) : null}
        </div>
    );
};
export default GroupTable;
