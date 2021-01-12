import React, { useState, useEffect, useContext } from 'react';
import { Space, Tooltip, Button, Spin, Tree } from 'antd';
import { connect } from 'umi';
import { TreeContext } from '../index';

const { TreeNode } = Tree;

const CategoryTree = (props) => {
    const {
        dispatch,
        productCategory, // data from model
        loading,
    } = props;

    const { expand, select } = useContext(TreeContext);

    // Tree related state
    const [treeExpandedKeys, setTreeExpandedKeys] = expand;
    const [treeSelectedKeys, setTreeSelectedKeys] = select;
    const [autoExpandParent, setAutoExpandParent] = useState(true);

    useEffect(() => {
        dispatch({
            type: 'productCategory/fetch',
        });

        return () => {
            dispatch({
                type: 'attrGroup/clear',
            })
        }
    }, []);

    // Tree related function
    const onExpand = (expandedKeys) => {
        // console.log('onExpand', expandedKeys);
        // if not set autoExpandParent to false, if children expanded, parent can not collapse.
        // or, you can remove all expanded children keys.
        setTreeExpandedKeys(expandedKeys);
        setAutoExpandParent(false);
    };

    const onSelect = (selectedKeys, info) => {
        // console.log(info);
        // key starts from 0-0, 0-0 is at level 1 , 0-0-0 is at level 2, 0-0-0-0 is at level 3 and so on...
        const nodeLevel = (info.node.pos.split('-')).length - 1;
        setTreeSelectedKeys(selectedKeys);

        if (info.selected && nodeLevel === 3) {
            dispatch({
                type: 'attrGroup/query',
                payload: {
                    categoryId: selectedKeys
                }
            })
        } else {
            dispatch({
                type: 'attrGroup/clear',
            })
        }
    };

    const renderTreeNodes = (data) =>
        data.map((item) => {
            if (item.children) {
                return (
                    <TreeNode title={item.name} key={item.catId}>
                        {renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            return <TreeNode title={item.name} key={item.catId} />;
        });

    return (
        <div>
            <Space direction="vertical">
                {loading ?
                    <div stlye={{ padding: '50px' }}>
                        <Spin tip="category loading..." />
                    </div>
                    :
                    <>
                        <Tooltip placement="topLeft" title="Click on third level category to load attribute group">
                            <Button>Hint</Button>
                        </Tooltip>
                        <Tree
                            onExpand={onExpand}
                            expandedKeys={treeExpandedKeys}
                            autoExpandParent={autoExpandParent}
                            onSelect={onSelect}
                            selectedKeys={treeSelectedKeys}
                        >
                            {renderTreeNodes(productCategory.data)}
                        </Tree>
                    </>
                }
            </Space>
        </div>
    );
};

export default connect(({ productCategory, attrGroup, loading }) => ({
    productCategory,
    loading: loading.models.productCategory,
    attrGroup
}))(CategoryTree);
