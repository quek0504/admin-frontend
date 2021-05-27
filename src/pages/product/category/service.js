import request from 'umi-request';
import { message } from 'antd';

const errorHandler = (error) => {
    const { response } = error;
    const codeMap = {
        500: 'Internal server error',
        503: 'Service not available',
        504: 'Gateway timeout',
      // ....
    };
    if (response && response.status) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
        message.error(codeMap[response.status] + ', fail to fetch product category');
    } else {
      // The request was made but no response was received or error occurs when setting up the request.
        message.error('Cannot connect to server, please check your network');
    }
    throw response;
}

export async function queryProductCategory() {
  return request('/api/product/category/list/tree', { errorHandler });
}

export async function queryProductCategoryInfo(params) {
  return request(`/api/product/category/info/${params}`, { errorHandler });
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