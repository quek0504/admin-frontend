import React, { useEffect } from 'react';
import { Card, Tree } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import styles from './style.less';

const { TreeNode } = Tree;

export const ProductCategory = (props) => {
  const {
    dispatch,
    productCategory, // data from model
  } = props;

  useEffect(() => {
    dispatch({
      type: 'productCategory/fetch',
    });
  }, [1]);

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
            <Tree>{renderTreeNodes(productCategory.data)}</Tree>
          </Card>
        </div>
      </PageContainer>
    </div>
  );
};

export default connect(({ productCategory }) => ({
  productCategory,
}))(ProductCategory);
