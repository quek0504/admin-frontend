import request from 'umi-request';

export async function queryProductCategory() {
  return request('/api/product/category/list/tree');
}

export async function queryProductCategoryInfo(params) {
  return request(`/api/product/category/info/${params.catId}`, {
    method: 'GET',
  });
}

export async function removeProductCategory(params) {
  return request('/api/product/category/delete', {
    method: 'POST',
    data: params, // idsArray, eg. params = [1,2,3]
  });
}

export async function addProductCategory(params) {
  return request('/api/product/category/save', {
    method: 'POST',
    data: params.data,
  });
}

export async function updateProductCategory(params) {
  return request('/api/product/category/update', {
    method: 'POST',
    data: params.data,
  });
}

export async function updateSortProductCategory(params) {
  return request('/api/product/category/update/sort', {
    method: 'POST',
    data: params,
  });
}