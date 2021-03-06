import React, { useEffect, useState } from 'react';
import { Row, Col, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import CategoryTree from './components/CategoryTree';
import GroupTable from './components/GroupTable';

export const TreeContext = React.createContext({});

export const Attribute = (props) => {

  const {
    productCategory, // from model
    attrGroup, // from model
    loading,
    dispatch,
  } = props;

  const [treeExpandedKeys, setTreeExpandedKeys] = useState([]);
  const [treeSelectedKeys, setTreeSelectedKeys] = useState([]);

  useEffect(() => {
    dispatch({
        type: 'productCategory/fetch',
    });

    return () => {
        clearTable();
    }
}, []);

  const getTable = (selectedKey, keyword) => {
    // selectedKey is an array of categoryId
    // console.log(selectedKey, keyword);
    // empty search bar
    if (keyword === "") {
      // fetch all attribute groups, no path variable
      dispatch({
        type: 'attrGroup/query',
        payload: {
          categoryId: selectedKey.length === 0 ? 0 : selectedKey, // categoryId
        }
      });;
    }
    // non empty search bar
    else if (keyword) {
      dispatch({
        type: 'attrGroup/query',
        payload: {
          categoryId: selectedKey.length === 0 ? 0 : selectedKey, // categoryId
          key: keyword,
        },
      })
    }
  }

  const clearTable = () => {
    dispatch({
      type: 'attrGroup/clear',
    })
  }

  return (
    <PageContainer>
      <Card
        bordered={false}
        style={{
          marginTop: 24,
        }}
      >
        <TreeContext.Provider value={{ expand: [treeExpandedKeys, setTreeExpandedKeys], select: [treeSelectedKeys, setTreeSelectedKeys] }}>
          <Row>
            <Col sm={24} md={24} lg={4}>
              <CategoryTree
                productCategory={productCategory}
                loading={loading}
                getTable={getTable}
                clearTable={clearTable} />
            </Col>
            <Col sm={24} md={24} lg={20}>
              <GroupTable
                productCategory={productCategory}
                attrGroup={attrGroup}
                getTable={getTable}
              />
            </Col>
          </Row>
        </TreeContext.Provider>
      </Card>
    </PageContainer >
  );
};

export default connect(({ productCategory, attrGroup, loading }) => ({
  productCategory,
  attrGroup,
  loading: loading.models.productCategory,
}))(Attribute);

