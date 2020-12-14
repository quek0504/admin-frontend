import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Divider, message, Modal, Space, Spin, Switch, Tree, Typography } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import OperationModal from './components/OperationModal';

const { TreeNode } = Tree;

const { Text } = Typography;

export const ProductCategory = (props) => {
  const {
    dispatch,
    loading,
    productCategory, // data from model
  } = props;

  // Tree related state
  const [treeExpandedKeys, setTreeExpandedKeys] = useState([]);
  const [treeCheckedKeys, setTreeCheckedKeys] = useState([]);
  const [treeSelectedKeys, setTreeSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);
  const [draggable, setDraggable] = useState(true);

  const [treeCheckedNodesData, setTreeCheckedNodesData] = useState([]);
  const updateArray = useRef([]);

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

  const onCheck = (checkedKeys, event) => {
    console.log(checkedKeys);
    // console.log(event) // check default API from official document
    // find checkNodes name
    const { checkedNodes } = event;
    const checkedNodesData = [];
    for (let i = 0; i < checkedNodes.length; i++) {
      checkedNodesData.push({
        'catId': checkedNodes[i].key,
        'name': checkedNodes[i].title.props.children[0].props.children,
      })
    }
    setTreeCheckedKeys(checkedKeys);
    setTreeCheckedNodesData(checkedNodesData);
  };

  const onSelect = (selectedKeys, info) => {
    // add to selected key only when user clicks on the tree node but not on append/edit/delete button
    // prevent deselect of key when user click on append/edit/delete button
    if (info.selected && !visible) {
      console.log('onSelect', info);
      setTreeSelectedKeys(selectedKeys);
    }
  };

  const onDrop = (info) => {
    console.log(info);

    const dropKey = info.node.props.eventKey;
    const dragKey = info.dragNode.props.eventKey;
    const dropPos = info.node.props.pos.split('-');
    const dropPosition = info.dropPosition - Number(dropPos[dropPos.length - 1]);

    // other block scope variables : maxLevel ,pCid ,data ,dragObj ,dropObj 

    // Find matching product category using dragKey/dropKey
    const loop = (data, key, callback) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].catId === parseInt(key, 10)) {
          // data[i].catId is num , key is string
          return callback(data[i], i, data);
        }
        if (data[i].children) {
          loop(data[i].children, key, callback);
        }
      }
    };

    let maxLevel = 0;
    const countMaxNodeLevel = (node) => {
      if (node.children !== null && node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          if (node.children[i].catLevel > maxLevel) {
            maxLevel = node.children[i].catLevel;
          }
          countMaxNodeLevel(node.children[i]);
        }
      }
    };

    const allowDrop = (dragNode) => {
      countMaxNodeLevel(dragNode);
      let newLevel; // drag node new level
      /* 
        insert at inner first position after dropPos
        dragNode new level = dropPos level + 1
          CASE 1:
            *dropPos*
              - *dragNode*
              - *node*
              - *node*
        insert at inner first position of key 'x-x-x'
        key 'x-x-x' level is 2
        drag node new level is 3
      */
      if (!info.dropToGap) {
        newLevel = dropPos.length;
      } else {
        /* 
          insert in between nodes OR at last position OR 0-0
          dragNode new level = dropPos level
            CASE 2:
              *dropPos*
              *dragNode*
              *node*    
            CASE 3:
              *node*
              *dropPos*
              *dragNode*
            CASE 4:
              *dragNode*
              *node*
              *node*
          actual level must -1 
          eg. key 'x-x' level is 1, key 'x-x-x' level is 2
        */
        newLevel = dropPos.length - 1;
      }
      // distance of furthest child node to dragging node
      let dragNodeDeep = maxLevel - dragNode.catLevel < 0 ? 0 : maxLevel - dragNode.catLevel;
      if (dragNodeDeep + newLevel <= 3) {
        dragNode.newLevel = newLevel;
        return true;
      }
      return false;
    };

    const updateChildNodeLevel = (node, childLevel) => {
      if (node.children.length > 0) {
        for (let i = 0; i < node.children.length; i++) {
          node.children[i].catLevel = childLevel;
          node.children[i].newLevel = childLevel;
          updateArray.current.push({
            catId: node.children[i].catId,
            catLevel: childLevel,
          });
          updateChildNodeLevel(node.children[i], childLevel + 1);
        }
      }
    };

    let pCid;
    const handleUpdateData = (dragNode, dropNode, siblings, type) => {
      // update parentCid
      if (type === 'inner') {
        // case 1
        pCid = dropNode.catId;
      } else if (type === 'first') {
        // case 4
        pCid = 0;
      } else if (type === 'after') {
        // case 2, 3
        pCid = dropNode.parentCid;
      }

      // update sort order or drag node and its siblings
      // update node and children node level if level changed
      for (let i = 0; i < siblings.length; i++) {
        if (siblings[i].catId === dragNode.catId) {
          let { catLevel } = dragNode;
          // dragNode.newLevel is assigned when we called allowDrop(node)
          // if condition equivalent to dragNode.catLevel != dragNode.newLevel
          if (siblings[i].catLevel !== dragNode.newLevel) {
            catLevel = dragNode.newLevel;
            dragNode.catLevel = dragNode.newLevel;
            updateChildNodeLevel(siblings[i], catLevel + 1);
          }
          updateArray.current.push({
            catId: siblings[i].catId,
            sort: i,
            parentCid: pCid,
            catLevel,
          });
        } else {
          updateArray.current.push({ catId: siblings[i].catId, sort: i });
        }
      }
    };

    // Initialize data
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

    // Find dropObject
    let dropObj;
    if (!info.dropToGap) {
      // Drop on the content
      loop(data, dropKey, (item) => {
        dropObj = item;
        // item is drop node from callback function
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        handleUpdateData(dragObj, dropObj, item.children, 'inner');
      });
    } else if (
      (info.node.props.children || []).length > 0 && // Has children
      info.node.props.expanded && // Is expanded
      dropPosition === 1 // On the bottom gap
    ) {
      loop(data, dropKey, (item) => {
        dropObj = item;
        item.children = item.children || [];
        // where to insert 示例添加到头部，可以是随意位置
        item.children.unshift(dragObj);
        // in previous version, we use item.children.push(dragObj) to insert the
        // item to the tail of the children
        handleUpdateData(dragObj, dropObj, item.children, 'after');
      });
    } else {
      let ar;
      let i;
      loop(data, dropKey, (item, index, arr) => {
        ar = arr;
        i = index;
        dropObj = item;
      });
      if (dropPosition === -1) {
        ar.splice(i, 0, dragObj);
        handleUpdateData(dragObj, dropObj, ar, 'first');
      } else {
        ar.splice(i + 1, 0, dragObj);
        handleUpdateData(dragObj, dropObj, ar, 'after');
      }
    }

    // simply update UI here, no data sent
    // updateArray data is sent to database when button is clicked
    dispatch({
      type: 'productCategory/dragUpdate',
      payload: data
    }).then(() => {
      const treeExpandedKey = treeExpandedKeys;
      if (treeExpandedKey.indexOf(`${pCid}`) === -1) {
        setTreeExpandedKeys([...treeExpandedKeys, `${pCid}`]);
      }
    });
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
      payload: item.catId,
    }).then((response) => {
      setCurrentItem(response.data);
    });
  };

  const showDeleteModal = (item) => {
    // item is an array
    const catIds = [];
    const catNames = [];

    for (let i = 0; i < item.length; i++) {
      catIds.push(item[i].catId);
      catNames.push(item[i].name);
    }

    Modal.confirm({
      title: 'Delete Category',
      content: `Do you want to delete [${catNames}] category? Total items: ${item.length}`,
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => deleteItem(catIds),
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

  const handleDragUpdate = () => {
    if (updateArray.current.length > 0) {
      dispatch({
        type: 'productCategory/dragUpdateSubmit',
        payload: updateArray.current, // useRef
      }).then((response) => {
        if (response.code === 0) {
          message.success('Transaction successful!');
          updateArray.current = []; // clear data
          dispatch({
            type: 'productCategory/fetch',
          })
        } else {
          message.error('Request unsuccessful!');
        }
      });
    } else {
      message.error('No data changed!');
    }
  }

  const deleteItem = (idsArray) => {
    dispatch({
      type: 'productCategory/submit',
      payload: idsArray,
    }).then((response) => {
      if (response.code === 0) {
        message.success('Category removed!');
        // remove each checked keys in state to sync
        idsArray.map(
          ids => {
            setTreeCheckedKeys(treeCheckedKeys.filter(
              checkedKeys => checkedKeys != ids
            ));
            setTreeCheckedNodesData(treeCheckedNodesData.filter(
              checkedNodes => checkedNodes.catId != ids
            ));
          }
        )
        // fetch data again after removing category
        dispatch({
          type: 'productCategory/fetch',
        });
      } else {
        message.error('Something went wrong!');
      }
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
              showDeleteModal([item]);
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
        <Card
          bordered={false}
          style={{
            marginTop: 24,
          }}
          bodyStyle={{
            padding: '0 32px 40px 32px',
          }}
        >
          {loading ?
            <div style={{ padding: '20px 20px 0px 0px' }}>
              <Spin tip="category loading..." />
            </div>
            :
            <Space>
              <Switch
                checkedChildren="Close Draggable Effect"
                unCheckedChildren="Open Draggable Effect"
                defaultChecked={draggable}
                onClick={() => {
                  setDraggable(!draggable);
                }}
              />
              <Divider orientation="left" />
              {draggable ?
                <Button
                  type="primary"
                  onClick={handleDragUpdate}
                >
                  Submit Update
              </Button>
                :
                null
              }
              <Button
                type="danger"
                onClick={() => {
                  if (treeCheckedKeys.length > 0) {
                    showDeleteModal(treeCheckedNodesData)
                  } else {
                    message.error('No data selected!');
                  }
                }
                }
              >
                Submit Batch Delete
            </Button>
            </Space>
          }
        </Card>
        <Card
          bordered={false}
          style={{
            marginTop: 24,
          }}
        >
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={treeExpandedKeys}
            autoExpandParent={autoExpandParent}
            onCheck={onCheck}
            checkedKeys={treeCheckedKeys}
            onSelect={onSelect}
            selectedKeys={treeSelectedKeys}
            draggable={draggable}
            onDrop={onDrop}
          >
            {renderTreeNodes(productCategory.data)}
          </Tree>
        </Card>
      </PageContainer >

      <OperationModal
        visible={visible}
        edit={edit}
        currentItem={currentItem}
        onCancel={handleCancel}
        onSubmit={handleSubmit}
      />
    </div >
  );
};

export default connect(({ productCategory, loading }) => ({
  productCategory,
  loading: loading.models.productCategory
}))(ProductCategory);
