import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { message, Table, Button, Space, Modal } from 'antd';

const AttributeRelationModal = (props) => {
    const {
        dispatch,
        onCloseModal,
        modalVisible,
        selectedAttributeGroupId,
        attrGroup, // from modal
    } = props;

    useEffect(() => {
        dispatch({
            type: 'attrGroup/fetchRelation',
            payload: selectedAttributeGroupId
        });
    }, []);

    const [showRelation, setShowRelation] = useState(true);

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            tip: 'Primary Key',
        },
        {
            title: 'Attribute ID',
            dataIndex: 'attr_id',
        },
        {
            title: 'Attribute Group ID',
            dataIndex: 'attr_group_id',
        },
        {
            title: 'Action',
            dataIndex: 'option',
            render: (_, record) => (
                <>
                    <a
                        onClick={() => {
                            deleteRelation(record);
                        }}>Delete</a>
                </>
            ),
        },
    ];

    const deleteRelation = (relation) => {
        dispatch({
            type: 'attrGroup/deleteRelation',
            payload: [{
                attrId: relation.attr_id,
                attrGroupId: relation.attr_group_id
            }]
        }).then((response) => {
            if (response.code === 0) {
                message.success('Attribute removed from group!');
                dispatch({
                    type: 'attrGroup/fetchRelation',
                    payload: selectedAttributeGroupId
                })
            } else {
                message.error('Something went wrong, please try again later!');
            }
        })
    }

    const onSubmit = (showRelation) => {
        // table view
        if (showRelation) {
            onCloseModal(); // call close modal
        }
    }

    const renderContent = (showRelation) => {
        return (
            <Space direction="vertical">
                <Button type="primary" onClick={() => setShowRelation(!showRelation)}>
                    {
                        showRelation ?
                            'Add Attribute'
                            :
                            'Show Relation Table'
                    }
                </Button>

                {
                    showRelation ?
                        <Table columns={columns} dataSource={attrGroup.relation} />
                        :
                        null
                }
            </Space>
        );
    };

    return (
        <Modal
            destroyOnClose
            title="Attribute Relation"
            visible={modalVisible}
            onCancel={onCloseModal}
            onOk={() => onSubmit(showRelation)}
        >
            {renderContent(showRelation)}
        </Modal>
    );
};

export default connect(({ attrGroup }) => ({
    attrGroup
}))(AttributeRelationModal);

