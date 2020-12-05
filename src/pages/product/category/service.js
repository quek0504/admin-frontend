import request from 'umi-request';

export async function queryProductCategory() {
  return request('/api/product/category/list/tree');
}

export async function removeProductCategory(params) {
  return request('/api/product/category/delete', {
    method: 'POST',
    data: params, // idsArray, eg. params = [1,2,3]
  });
}

export async function addProductCategory(params) {
  console.log('Sending Params...');
  return request('/api/product/category/save', {
    method: 'POST',
    data: params,
  });
}
