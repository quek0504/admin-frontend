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

  const onDragEnter = info => {
    console.log(info);
  };

  const onDrop = info => {
    console.log(info);

    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // Find matching product category using dragKey/dropKey
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].catId === parseInt(key, 10)) { // data[i].catId is num , key is string
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    let maxLevel = 0;
    const countMaxNodeLevel = (node) => {
      if (node.children != null && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.children[i].catLevel > maxLevel) {
            maxLevel = node.children[i].catLevel;
          }
          countMaxNodeLevel(node.children[i]);
        }
      }
    }

    const allowDrop = (dragNode) => {

      countMaxNodeLevel(dragNode);

      let newInsertPos;
      /* 
        insert at inner first position after dropPos
        dragNode new level = dropPos level + 1
            *dropPos*
              - *dragNode*
              - *node*
              - *node*
        insert at inner first position of key 'x-x-x'
        key 'x-x-x' level is 2
        drag node new level is 3
      */
      if (!info.dropToGap) { newInsertPos = dropPos.length; }
      /* 
        insert in between nodes OR at last position OR 0-0
        dragNode new level = dropPos level
          CASE 1:
            *dropPos*
            *dragNode*
            *node*    
          CASE 2:
            *node*
            *dropPos*
            *dragNode*
          CASE3:
            *dragNode*
            *node*
            *node*
        actual level must -1 
        eg. key 'x-x' level is 1, key 'x-x-x' level is 2
      */
      newInsertPos = dropPos.length - 1; // else
      // distance of furthest child node to dragging node 
      const dragNodeDeep = (maxLevel - dragNode.catLevel) < 0 ? 0 : (maxLevel - dragNode.catLevel);
      return (dragNodeDeep + newInsertPos) <= 3;
    }


    // initialize data
    const data = [...productCategory.data];

    // Find dragObject
    let dragObj;
    loop(data, dragKey, (item, index, arr) => {
      // item is drag node from callback function
      // check whether we are allowed to drop the drag node at new position
      if (allowDrop(item)) {
        dragObj = item; // condition to proceed
        arr.splice(index, 1); // remove drag node from tree
      } else {
        dragObj = null; // cannot proceed, wont remove drag node from tree
      }
    });

    // if not allowed to drop, no drop effect and return
    if (dragObj == null) {
      return;
    }

    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, item => {
        // item is drop node from callback function
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      console.log(2);
      loop(data, dropKey, item => {
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
      } else {
        console.log(ar);
        ar.splice(i + 1, 0, dragObj);
      }
    }

    dispatch({
      type: 'productCategory/dragUpdate',
      payload: data,
    })

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
              draggable
              onDragEnter={onDragEnter}
              onDrop={onDrop}
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
