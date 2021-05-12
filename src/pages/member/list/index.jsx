import React, { useEffect } from 'react';
import { Card } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { connect } from 'umi';
import MemberType from './components/MemberType';

export const Member = (props) => {
  const {
    memberType, // from model
    dispatch,
  } = props;

  useEffect(() => {
    dispatch({
      type: 'memberType/fetch',
    });
  }, []);

  const getTable = () => {
      dispatch({
        type: 'memberType/fetch',
      });;
  }

  return (
    <PageContainer>
      <Card
        bordered={false}
        style={{
          marginTop: 24,
        }}
      >
        <MemberType memberType={memberType} getTable={getTable}/>
      </Card>
    </PageContainer>
  );
};

export default connect(({ memberType }) => ({
  memberType,
}))(Member);
