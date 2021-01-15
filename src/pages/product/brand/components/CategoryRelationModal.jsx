import React, { useState, useEffect } from 'react';
import { connect } from 'umi';
import { message, Table, Button, Cascader, Space, Modal } from 'antd';

const CategoryRelationModal = (props) => {
  const {
    dispatch,
    onCloseModal,
    modalVisible,
    selectedBrandId,
    productCategory, // from model
    productBrand, // from model
  } = props;

  useEffect(() => {
    dispatch({
      type: 'productCategory/fetch',
    });
    dispatch({
      type: 'productBrand/fetchRelation',
      payload: selectedBrandId
    });
  }, []);

  const [showRelation, setShowRelation] = useState(true);
  const [cateogryPath, setCategoryPath] = useState([]);

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      tip: 'Primary Key',
      hideInForm: true,
    },
    {
      title: 'Brand Name',
      dataIndex: 'brandName',
    },
    {
      title: 'Category Name',
      dataIndex: 'categoryName',
    },
    {
      title: 'Action',
      dataIndex: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              deleteRelation(record.id);
            }}>Delete</a>
        </>
      ),
    },
  ];

  const deleteRelation = (relationId) => {
    dispatch({
      type: 'productBrand/deleteRelation',
      payload: [relationId]
    }).then((response) => {
      if(response.code === 0) {
        message.success('Category removed from brand!');
        dispatch({
          type: 'productBrand/fetchRelation',
          payload: selectedBrandId
        })
      } else {
        message.error('Something went wrong, please try again later!');
      }
    })
  }

  // cascader filter
  const filter = (inputValue, path) => {
    // default fieldname of 'label' changed to 'name' here
    // option.label.toLowerCase() => option.name.toLowerCase() 
    return path.some(option => option.name.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  const onCascaderSelect = (value) => {
    // value is an array of category ids at different level  eg [level1, level2, level3]
    // console.log(value);
    setCategoryPath(value);
  }

  const onSubmit = (showRelation) => {
    // table view
    if (showRelation) {
      onCloseModal(); // call close modal
    }
    // cascader view
    else {
      dispatch({
        type: 'productBrand/saveRelation',
        payload: {
          brandId: selectedBrandId,
          categoryId: cateogryPath[cateogryPath.length - 1],
        }
      }).then((response) => {
        if (response.code === 0) {
          dispatch({
            type: 'productBrand/fetchRelation',
            payload: selectedBrandId
          }).then(() => {
            message.success('Category added to brand!');
            setShowRelation(!showRelation); // toggle to table view
          });
        } else {
          message.error('Category already added to brand, please select other category!');
        }
      })
    }
  }


  const renderContent = (showRelation) => {
    return (
      <Space direction="vertical">
        <Button type="primary" onClick={() => setShowRelation(!showRelation)}>
          {
            showRelation ?
              'Add Category'
              :
              'Show Relation Table'
          }
        </Button>

        {
          showRelation ?
            <Table columns={columns} dataSource={productBrand.relation} />
            :
            <Cascader
              placeholder="Please select"
              options={productCategory.data}
              fieldNames={{ label: 'name', value: 'catId', children: 'children' }}
              showSearch={{ filter }}
              onChange={onCascaderSelect}
            />
        }


      </Space>
    );
  };

  return (
    <Modal
      destroyOnClose
      title="Category Brand Relation"
      visible={modalVisible}
      onCancel={onCloseModal}
      onOk={() => onSubmit(showRelation)}
    >
      {renderContent(showRelation)}
    </Modal>
  );
};

export default connect(({ productCategory, productBrand }) => ({
  productCategory,
  productBrand,
}))(CategoryRelationModal);

