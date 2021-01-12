import React, { useState } from 'react';
import { Row, Col, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import CategoryTree from './components/CategoryTree';
import GroupTable from './components/GroupTable';

export const TreeContext = React.createContext({});

export const Attribute = () => {

  const [treeExpandedKeys, setTreeExpandedKeys] = useState([]);
  const [treeSelectedKeys, setTreeSelectedKeys] = useState([]);

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
              <CategoryTree />
            </Col>
            <Col sm={24} md={24} lg={20}>
              <GroupTable />
            </Col>
          </Row>
        </TreeContext.Provider>
      </Card>
    </PageContainer >
  );
};

export default Attribute;
