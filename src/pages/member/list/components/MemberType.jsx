import { PlusOutlined } from '@ant-design/icons';
import {  Modal, Space, Tag, Button, Divider, message } from 'antd';
import React, { useState, useRef } from 'react';
import ProTable from '@ant-design/pro-table';
import { CheckCircleTwoTone , CloseCircleTwoTone } from '@ant-design/icons';
import Media from 'react-media';
import CreateForm from './CreateForm';
import UpdateForm from './UpdateForm';
import { addMemberType, removeMemberType, updateMemberType } from '../service';

/**
 * 添加节点
 * @param fields
 */

const handleAdd = async (fields) => {
    const hide = message.loading('Creating');

    try {
        await addMemberType({ ...fields });
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
        await updateMemberType({ ...fields });
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
        await removeMemberType(
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

const MemberType = (props) => {
    const {
        memberType,
        getTable
    } = props;

    const [createModalVisible, handleModalVisible] = useState(false);
    const [updateModalVisible, handleUpdateModalVisible] = useState(false);
    const [deleteModalVisible, handleDeleteModalVisible] = useState(false);
    const [stepFormValues, setStepFormValues] = useState({});
    const actionRef = useRef();
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: 'Primary Key',
            hideInForm: true,
        },
        {
            title: 'Membership',
            dataIndex: 'name',
            formItemProps: {
                rules: [
                    {
                        required: true,
                        message: 'Membership must not be empty!',
                    },
                ],
            },
            render: (dom, _) => {
                return <a>{dom}</a>;
            },
        },
        {
            title: 'Growth Point (GP)',
            dataIndex: 'growthPoint',
        },
        {
            title: 'Default (Y/N)',
            dataIndex: 'defaultStatus',
            render: (_, record) => (
                <Space>
                    {
                        record.defaultStatus == 1 ? 
                        <Tag color="success">Y</Tag>
                        :
                        <Tag color="error">N</Tag>
                    }
                </Space>
            ),
        },
        {
            title: 'Free Shipping Point',
            dataIndex: 'freeFreightPoint',
        },
        {
            title: 'Comment GP',
            dataIndex: 'commentGrowthPoint',
        },
        {
            title: 'Free Shipping',
            dataIndex: 'priviledgeFreeFreight',
            render: (_, record) => (
                <Space>
                    {
                        record.priviledgeFreeFreight == 1 ? 
                        <CheckCircleTwoTone  twoToneColor="#52c41a"/>
                        :
                        <CloseCircleTwoTone twoToneColor="#FF0000"/>
                    }
                </Space>
            ),
        },
        {
            title: 'Member Price Priviledge',
            dataIndex: 'priviledgeMemberPrice',
            render: (_, record) => (
                <Space>
                    {
                        record.priviledgeMemberPrice == 1 ? 
                        <CheckCircleTwoTone  twoToneColor="#52c41a"/>
                        :
                        <CloseCircleTwoTone twoToneColor="#FF0000"/>
                    }
                </Space>
            ),
        },
        {
            title: 'Birthday Priviledge',
            dataIndex: 'priviledgeBirthday',
            render: (_, record) => (
                <Space>
                    {
                        record.priviledgeBirthday == 1 ? 
                        <CheckCircleTwoTone  twoToneColor="#52c41a"/>
                        :
                        <CloseCircleTwoTone twoToneColor="#FF0000"/>
                    }
                </Space>
            ),
        },
        {
            title: 'Note',
            dataIndex: 'note',
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
                            const success = await handleRemove(record.id);

                            if (success) {
                                handleDeleteModalVisible(false);
                                // refresh table
                                getTable();
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
                            headerTitle="Membership Management"
                            actionRef={actionRef}
                            rowKey="id"
                            toolBarRender={() => [
                                <Button type="primary" onClick={() => handleModalVisible(true)}>
                                    <PlusOutlined /> New Membership
                                </Button>,
                            ]}
                            // request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
                            columns={getResponsiveColumns(smallScreen)}
                            dataSource={memberType.data}
                            search={false}
                        />
                    )
                }}
            </Media>
            <CreateForm
                onSubmit={async (value) => {
                    let toSubmit = {
                        ...value,
                        defaultStatus: value.defaultStatus === false ? 0 : 1,
                        priviledgeFreeFreight: value.priviledgeFreeFreight === false ? 0 : 1,
                        priviledgeMemberPrice: value.priviledgeMemberPrice === false ? 0 : 1,
                        priviledgeBirthday: value.priviledgeBirthday === false ? 0 : 1,
                    }
                    const success = await handleAdd(toSubmit);

                    if (success) {
                        handleModalVisible(false);

                        // refresh table
                        getTable();

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

                        // if value has changed, the value would be true or false due to Switch
                        // otherwise value is 0/1 from database
                        let toSubmit = {
                            ...value,
                            defaultStatus: value.defaultStatus === 0 || value.defaultStatus === false ? 0 : 1,
                            priviledgeFreeFreight: value.priviledgeFreeFreight === 0 || value.priviledgeFreeFreight === false ? 0 : 1,
                            priviledgeMemberPrice: value.priviledgeMemberPrice === 0 || value.priviledgeMemberPrice === false ? 0 : 1,
                            priviledgeBirthday: value.priviledgeBirthday === 0 || value.priviledgeBirthday === false ? 0 : 1,
                        }

                        const success = await handleUpdate(toSubmit);

                        if (success) {
                            handleUpdateModalVisible(false);
                            setStepFormValues({});

                            // refresh table
                            getTable();

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
        </div>
    );
};
export default MemberType;