import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'umi';
import { message, Button, Space, Modal } from 'antd';
import ProTable from '@ant-design/pro-table';

const AttributeRelationModal = (props) => {
    const {
        dispatch,
        onCloseModal,
        modalVisible,
        selectedTableKey, // attrGroupId
        attrGroup, // from modal
    } = props;

    const fetchRelationTable = () => {
        dispatch({
            type: 'attrGroup/fetchRelation',
            payload: selectedTableKey
        });
    }

    const fetchNonRelationTable = (attrGroupId, keyword) => {
        // empty search bar
        if (keyword === "") {
            dispatch({
                type: 'attrGroup/fetchNonRelation',
                payload: {
                    attrGroupId
                }
            });;
        }
        // non empty search bar
        else if (keyword) {
            dispatch({
                type: 'attrGroup/fetchNonRelation',
                payload: {
                    attrGroupId,
                    key: keyword,
                },
            })
        }
    }

    useEffect(() => {
        fetchRelationTable();
        fetchNonRelationTable(selectedTableKey, "");
    }, [selectedTableKey]);

    // non assigned specification table state
    const [selectedToAdd, setSelectedToAdd] = useState([]);
    const actionRef = useRef();

    // modal content state
    const [showRelation, setShowRelation] = useState(true);

    const relationColumns = [
        {
            title: 'Attribute ID',
            dataIndex: 'attrId',
            tip: 'Primary Key',
        },
        {
            title: 'Specification Name',
            dataIndex: 'attrName',
        },
        {
            title: 'Selectable Values',
            dataIndex: 'valueSelect',
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

    const nonRelationColumns = [
        {
            title: 'Attribute ID',
            dataIndex: 'attrId',
            tip: 'Primary Key',
        },
        {
            title: 'Specification Name',
            dataIndex: 'attrName',
        },
        {
            title: 'Icon',
            dataIndex: 'icon',
        },
        {
            title: 'Selectable Values',
            dataIndex: 'valueSelect',
        },
    ];

    const deleteRelation = (relation) => {
        dispatch({
            type: 'attrGroup/deleteRelation',
            payload: [{
                attrId: relation.attrId,
                attrGroupId: selectedTableKey
            }]
        }).then((response) => {
            if (response.msg === "success") {
                message.success('Attribute removed from group!');
                fetchRelationTable();
                fetchNonRelationTable(selectedTableKey, "");
            } else {
                message.error('Something went wrong, please try again later!');
            }
        })
    }

    const onSubmit = (showRelation) => {
        // assgined relation view
        if (showRelation) {
            onCloseModal(); // call close modal
        }
        // adding relation view
        else {
            if (selectedToAdd.length === 0) {
                message.error('No specifications selected!');
            } else {
                let toSubmit = [];
                selectedToAdd.map((item) => {
                    toSubmit.push({
                        attrId: item.attrId,
                        attrGroupId: selectedTableKey
                    })
                });
                dispatch({
                    type: 'attrGroup/saveRelation',
                    payload: toSubmit
                }).then((response) => {
                    if (response.msg === "success") {
                        message.success('Specifications added!');

                        // fetch new data
                        fetchRelationTable();
                        fetchNonRelationTable(selectedTableKey, "");

                        // reset modal state
                        setSelectedToAdd([]);
                        actionRef.current.clearSelected();
                        setShowRelation(!showRelation); // toggle to assgined specification table view
                    } else {
                        message.error('Something went wrong, please try again later!');
                    }
                })
            }
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
                        <ProTable
                            headerTitle="Specification"
                            rowKey="attrId"
                            dataSource={attrGroup.relation}
                            search={false}
                            columns={relationColumns}
                        />
                        :
                        <ProTable
                            headerTitle="Add Specification"
                            rowKey="attrId"
                            dataSource={attrGroup.nonRelation}
                            rowSelection={{
                                onChange: (_, selectedRows) => { setSelectedToAdd(selectedRows) },
                            }}
                            actionRef={actionRef}
                            search={false}
                            options={{
                                search: true,
                            }}
                            request={(params) => {
                                let keyword = params.keyword === undefined ? undefined : params.keyword.trim();
                                fetchNonRelationTable(selectedTableKey, keyword);
                            }}
                            columns={nonRelationColumns}
                        />
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
            width={640}
        >
            {renderContent(showRelation)}
        </Modal>
    );
};

export default connect(({ attrGroup }) => ({
    attrGroup
}))(AttributeRelationModal);

