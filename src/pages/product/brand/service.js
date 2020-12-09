import request from 'umi-request';

export async function queryRule(params) {
  return request('/api/rule', {
    params,
  });
}
export async function removeBrand(params) {
  return request('/api/product/brand/delete', {
    method: 'POST',
    data: params,
  });
}
export async function addBrand(params) {
  return request('/api/product/brand/save', {
    method: 'POST',
    data: params,
  });
}
export async function updateBrand(params) {
  return request('/api/product/brand/update', {
    method: 'POST',
    data: params,
  });
}
