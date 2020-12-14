import React from 'react';
import { Row, Col, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import CategoryTree from './components/CategoryTree';
import GroupTable from './components/GroupTable';

export const Attribute = () => {
  return (
      <PageContainer>
          <Card
            bordered={false}
            style={{
              marginTop: 24,
            }}
          >
            <Row>
              <Col sm={24} md={24} lg={4}>
                <CategoryTree />
              </Col>
              <Col sm={24} md={24} lg={20}>
                <GroupTable />
              </Col>
            </Row>
          </Card>
      </PageContainer >
  );
};

export default Attribute;
