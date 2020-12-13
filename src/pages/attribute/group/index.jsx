import React from 'react';
import { Row, Col, Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import CategoryTree from './components/CategoryTree';
import GroupTable from './components/GroupTable';
import styles from './style.less';

export const Attribute = () => {
  return (
    <div>
      <PageContainer>
          <Card
            className={styles.treeCard}
            bordered={false}
            style={{
              marginTop: 24,
            }}
          >
            <Row>
              <Col span={4}>
                <CategoryTree />
              </Col>
              <Col span={20}>
                <GroupTable />
              </Col>
            </Row>
          </Card>
      </PageContainer >
    </div >
  );
};

export default Attribute;
