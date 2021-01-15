import { PlusOutlined } from '@ant-design/icons';
import { Button, Divider, Image, message } from 'antd';
import React, { useState, useRef, useContext } from 'react';
import { FooterToolbar } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import Media from 'react-media';
import { connect } from 'umi';
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

const handleRemove = async (selectedRows) => {
    const hide = message.loading('Deleting');
    if (!selectedRows) return true;

    try {
        await removeAttrGroup({
            key: selectedRows.map((row) => row.key),
        });
        hide();
        message.success('Delete Successful! Going to refresh...');
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
        dispatch,
        attrGroup, // data from model
        productCategory, // data from model
        loading
    } = props;

    const { expand, select } = useContext(TreeContext);

    const [treeExpandedKeys, setTreeExpandedKeys] = expand;
    const [treeSelectedKeys, setTreeSelectedKeys] = select;

    const [createModalVisible, handleModalVisible] = useState(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [attributeRelationModalVisible, handleRelationModalVisible] = useState(false);
    const [selectedAttributeGroupId, setSelectedAttributeGroupId] = useState();
    const [stepFormValues, setStepFormValues] = useState({});
    const actionRef = useRef();
    const [row, setRow] = useState();
    const [selectedRowsState, setSelectedRows] = useState([]);
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
            render: (dom, entity) => {
                return <a onClick={() => setRow(entity)}>{dom}</a>;
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
                            setSelectedAttributeGroupId(record.attrGroupId);
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
                    <a href="">Delete</a>
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
                            rowSelection={{
                                onChange: (_, selectedRows) => setSelectedRows(selectedRows),
                            }}
                            search={false}
                            options={{
                                search: true,
                            }}
                            request={(params) => {
                                let keyword = params.keyword === undefined ? undefined : params.keyword.trim();
                                // no category selected and empty search bar
                                if (treeSelectedKeys.length === 0 && keyword === "") {
                                    // fetch all attribute groups, no path variable
                                    dispatch({
                                        type: 'attrGroup/fetch',
                                    });;
                                } 
                                // non empty search bar
                                else if (keyword) {
                                    dispatch({
                                        type: 'attrGroup/query',
                                        payload: {
                                            categoryId: treeSelectedKeys.length === 0 ? 0 : treeSelectedKeys, // categoryId
                                            key: keyword,
                                        },
                                    })
                                }
                            }}
                        />
                    )
                }}
            </Media>
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
                    let toSubmit = {
                        ...value,
                        categoryId: value.categoryId[value.categoryId.length - 1]
                    }
                    const success = await handleAdd(toSubmit);

                    if (success) {
                        handleModalVisible(false);

                        dispatch({
                            type: 'attrGroup/query',
                            payload: toSubmit
                        })

                        // keys need to be a string array
                        setTreeExpandedKeys(value.categoryId.map(String)); // convert int array to string array

                        let toSelect = [];
                        toSelect.push((value.categoryId[value.categoryId.length - 1]).toString());
                        setTreeSelectedKeys(toSelect);

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

                            dispatch({
                                type: 'attrGroup/query',
                                payload: toSubmit
                            })

                            // keys need to be a string array
                            setTreeExpandedKeys(value.categoryId.map(String)); // convert int array to string array

                            let toSelect = [];
                            toSelect.push((value.categoryId[value.categoryId.length - 1]).toString());
                            setTreeSelectedKeys(toSelect);

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
            {selectedAttributeGroupId ? (
                <AttributeRelationModal
                    onCloseModal={() => {
                        handleRelationModalVisible(false);
                        setSelectedAttributeGroupId();
                    }}
                    modalVisible={attributeRelationModalVisible}
                    selectedAttributeGroupId={selectedAttributeGroupId}
                />
            ) : null}
        </div>
    );
};
export default connect(({ productCategory, attrGroup, loading }) => ({
    productCategory,
    attrGroup,
    loading: loading.models.attrGroup
}))(GroupTable);
