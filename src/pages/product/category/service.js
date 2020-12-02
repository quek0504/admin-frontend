import request from 'umi-request';

export async function queryProductCategory() {
  return request('/api/product/category/list/tree');
}
