import React, { useState, useEffect } from 'react';
import { Card, Divider, message, Modal, Space, Tree, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import OperationModal from './components/OperationModal';
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
  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(undefined);

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
    // add to selected key only when user clicks on the tree node but not on append/edit/delete button
    // prevent deselect of key when user click on append/edit/delete button
    if (info.selected && !visible) {
      console.log('onSelect', info);
      setTreeSelectedKeys(selectedKeys);
    }
  };

  // Modal related function
  const showAppendModal = (item) => {
    setVisible(true);
    setEdit(false);
    setCurrentItem(item);
  };

  const showEditModal = (item) => {
    setVisible(true);
    setEdit(true);

    // get latest product category info and put it in modal
    dispatch({
      type: 'productCategory/getInfo',
      payload: item,
    }).then((response) => {
      setCurrentItem(response.data);
    });
  };

  const handleCancel = () => {
    setVisible(false);
    setEdit(false);
    setCurrentItem(undefined);
  };

  const handleSubmit = (values) => {
    setVisible(false);
    setEdit(false);
    setCurrentItem(undefined);

    dispatch({
      type: 'productCategory/submit',
      payload: {
        data: values,
        edit,
      },
    }).then((submitResponse) => {
      const { newCatId } = submitResponse;
      const { parentCid } = values;
      const treeExpandedKey = treeExpandedKeys;

      if (submitResponse.code === 0) {
        message.success('Transaction successful!');
        dispatch({
          type: 'productCategory/fetch',
        }).then((fetchResponse) => {
          // if parent node is not already expanded, add parent node key to expanded key
          if (treeExpandedKey.indexOf(`${parentCid}`) === -1) {
            setTreeExpandedKeys([...treeExpandedKeys, `${parentCid}`]);
          }
          if (fetchResponse.code === 0) {
            setTreeSelectedKeys([`${newCatId}`]);
          }
        });
      } else {
        message.error('Request unsuccessful!');
      }
    });
  };

  const deleteItem = (idsArray) => {
    dispatch({
      type: 'productCategory/submit',
      payload: idsArray,
    }).then((response) => {
      if (response.code === 0) {
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

      <OperationModal
        visible={visible}
        edit={edit}
        currentItem={currentItem}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default connect(({ productCategory }) => ({
  productCategory,
}))(ProductCategory);
