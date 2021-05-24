import { PlusOutlined, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons';
import { Button, Divider, Modal, message, Typography } from 'antd';
import React, { useState, useRef, useContext } from 'react';
import ProTable from '@ant-design/pro-table';
import Media from 'react-media';
import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';
import { queryAttrInfo, queryAttrGroups, addSpecAttr, updateSpecAttr, removeSpecAttr } from '../service';
import { TreeContext } from '../index';

const { Text } = Typography;

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
    const hide = message.loading('Creating');

    try {
        await addSpecAttr({ ...fields });
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
        await updateSpecAttr({ ...fields });
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
        await removeSpecAttr(
            [selectedId]
        );
        hide();
        message.success('Delete Successful!');
        return true;
    } catch (error) {
        hide();
        message.error('Something went wrong, please try again!');
        return false;
    }
};

const queryAttr = async (attrId) => {
    try {
        return await queryAttrInfo(attrId);
    } catch (error) {
        message.error('Something went wrong, please try again!');
        return false;
    }
};

const queryAttrGroup = async (categoryId) => {
    try {
        return await queryAttrGroups(categoryId);
    } catch (error) {
        message.error('Something went wrong, please try again!');
        return false;
    }
}

const GroupTable = (props) => {
    const {
        productCategory,
        specAttribute,
        getTable,
    } = props;

    const { expand, select } = useContext(TreeContext);

    const [treeExpandedKeys, setTreeExpandedKeys] = expand;
    const [treeSelectedKeys, setTreeSelectedKeys] = select;

    const [createModalVisible, handleModalVisible] = useState(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [deleteModalVisible, handleDeleteModalVisible] = useState(false);
    const [formValues, setFormValues] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: 'ID',
            dataIndex: 'attrId',
            tip: 'Primary Key',
            hideInForm: true,
        },
        {
            title: 'Attribute Name',
            dataIndex: 'attrName',
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
            title: 'Value Type',
            dataIndex: 'valueType',
            render: (_, entity) => {
                if (entity.valueType === 1) {
                    return <Text strong>Multiple Values</Text>
                }
                return <Text strong>Single Value</Text>
            }
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
            hideOnSmall: true,
        },
        {
            title: 'Selectable Values',
            dataIndex: 'valueSelect',
            hideOnSmall: true,
        },
        {
            title: 'Category Name',
            dataIndex: 'categoryName',
        },
        {
            title: 'Attribute Group Name',
            dataIndex: 'groupName',
        },
        {
            title: 'Searchable',
            dataIndex: 'searchType',
            render: (_, entity) => {
                if (entity.searchType === 1) {
                    return < CheckCircleFilled />
                }
                return <CloseCircleFilled />
            }
        },
        {
            title: 'Show in store',
            dataIndex: 'showDesc',
            render: (_, entity) => {
                if (entity.showDesc === 1) {
                    return < CheckCircleFilled />
                }
                return <CloseCircleFilled />
            }
        },
        {
            title: 'Enable',
            dataIndex: 'enable',
            render: (_, entity) => {
                if (entity.enable === 1) {
                    return < CheckCircleFilled />
                }
                return <CloseCircleFilled />
            }
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
                            handleUpdateModalVisible(true);
                            queryAttr(record.attrId).then((result) => {
                                if (result.msg === "success") {
                                    setFormValues(result.attr);
                                }
                            })
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
                            const success = await handleRemove(record.attrId);

                            if (success) {
                                handleDeleteModalVisible(false);
                                // refresh table
                                getTable([record.attrId], "");
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
                            headerTitle="Specification Management"
                            actionRef={actionRef}
                            rowKey="attrId"
                            toolBarRender={() => [
                                <Button type="primary" onClick={() => handleModalVisible(true)}>
                                    <PlusOutlined /> New Specification
                                </Button>,
                            ]}
                            // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
                            columns={getResponsiveColumns(smallScreen)}
                            dataSource={specAttribute.data}
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
                        categoryId: value.categoryId[value.categoryId.length - 1],
                        valueSelect: value.valueSelect === undefined || value.valueSelect === null ? null : value.valueSelect.toString(),
                        valueType: value.valueType === false ? 0 : 1,
                        searchType: value.searchType === false ? 0 : 1,
                        showDesc: value.showDesc === false ? 0 : 1,
                        enable: value.enable === false ? 0 : 1,
                    }
                    const success = await handleAdd(toSubmit);

                    if (success) {
                        handleModalVisible(false);

                        getTable([toSubmit.categoryId], "");

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
                queryAttrGroup={queryAttrGroup}
            />
            {formValues && Object.keys(formValues).length ? (
                <UpdateForm
                    onSubmit={async (value) => {
                        let toSubmit = {
                            ...value,
                            categoryId: value.categoryId[value.categoryId.length - 1],
                            valueSelect: value.valueSelect === undefined || value.valueSelect === null ? null : value.valueSelect.toString(),
                            valueType: value.valueType === false ? 0 : 1,
                            searchType: value.searchType === false ? 0 : 1,
                            showDesc: value.showDesc === false ? 0 : 1,
                            enable: value.enable === false ? 0 : 1,
                        }
                        const success = await handleUpdate(toSubmit);

                        if (success) {
                            handleUpdateModalVisible(false);
                            setFormValues({});

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
                        setFormValues({});
                    }}
                    updateModalVisible={updateModalVisible}
                    productCategory={productCategory}
                    queryAttrGroup={queryAttrGroup}
                    values={formValues}
                />
            ) : null}
        </div>
    );
};
export default GroupTable;
