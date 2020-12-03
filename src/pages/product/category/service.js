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
