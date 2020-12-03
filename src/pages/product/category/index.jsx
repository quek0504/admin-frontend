import React, { useState, useEffect } from 'react';
import { Card, Divider, message, Modal, Space, Tree, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import styles from './style.less';

const { TreeNode } = Tree;

const { Text } = Typography;

export const ProductCategory = (props) => {
  const {
    dispatch,
    productCategory, // data from model
  } = props;

  // Tree related state
  const [treeExpandedKeys, setTreeExpandedKeys] = useState([]);
  const [treeCheckedKeys, setTreeCheckedKeys] = useState([]);
  const [treeSelectedKeys, setTreeSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  // Modal related state
  // const [done, setDone] = useState(false);
  // const [visible, setVisible] = useState(false);
  // const [current, setCurrent] = useState(undefined);

  useEffect(() => {
    dispatch({
      type: 'productCategory/fetch',
    });
  }, [1]);

  // Tree related function
  const onExpand = (expandedKeys) => {
    console.log('onExpand', expandedKeys);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setTreeExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = (checkedKeys) => {
    console.log('onCheck', checkedKeys);
    setTreeCheckedKeys(checkedKeys);
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    setTreeSelectedKeys(selectedKeys);
  };

  // Modal related function
  const showAppendModal = (item) => {
    console.log(item);
    // setVisible(true);
    // setCurrent(item);
  };

  const showEditModal = (item) => {
    console.log(item);
    // setVisible(true);
    // setCurrent(item);
  };

  const deleteItem = (idsArray) => {
    dispatch({
      type: 'productCategory/submit',
      payload: idsArray,
    }).then((responseCode) => {
      if (responseCode === 0) {
        message.success('Category removed!');
        // fetch data again after removing category
        dispatch({
          type: 'productCategory/fetch',
        });
      } else {
        message.error('Something went wrong!');
      }
    });
  };

  const showDeleteModal = (item) => {
    Modal.confirm({
      title: 'Delete Category',
      content: `Do you want to delete [${item.name}] category?`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => deleteItem([item.catId]),
    });
  };

  // render content
  const treeNodeContent = (item) => {
    return (
      <Space size="large" split={<Divider type="vertical" />}>
        <Text strong>{item.name}</Text>
        {item.catLevel <= 2 ? (
          <a
            key="append"
            onClick={(e) => {
              e.preventDefault();
              showAppendModal(item);
            }}
          >
            Append
          </a>
        ) : null}
        <a
          key="edit"
          onClick={(e) => {
            e.preventDefault();
            showEditModal(item);
          }}
        >
          Edit
        </a>
        {item.children.length === 0 ? (
          <a
            key="delete"
            onClick={(e) => {
              e.preventDefault();
              showDeleteModal(item);
            }}
          >
            Delete
          </a>
        ) : null}
      </Space>
    );
  };

  const renderTreeNodes = (data) =>
    data.map((item) => {
      if (item.children) {
        return (
          <TreeNode title={treeNodeContent(item)} key={item.catId}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode title={item.name} key={item.catId} />;
    });

  return (
    <div>
      <PageContainer>
        <div className={styles.standardTree}>
          <Card
            className={styles.treeCard}
            bordered={false}
            style={{
              marginTop: 24,
            }}
            bodyStyle={{
              padding: '0 32px 40px 32px',
            }}
          >
            {/* Tree inside card */}
            <Tree
              checkable
              onExpand={onExpand}
              expandedKeys={treeExpandedKeys}
              autoExpandParent={autoExpandParent}
              onCheck={onCheck}
              checkedKeys={treeCheckedKeys}
              onSelect={onSelect}
              selectedKeys={treeSelectedKeys}
            >
              {renderTreeNodes(productCategory.data)}
            </Tree>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default connect(({ productCategory }) => ({
  productCategory,
}))(ProductCategory);
