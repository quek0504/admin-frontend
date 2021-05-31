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
    message.error(codeMap[response.status] + ', fail to fetch product brand');
  } else {
    // The request was made but no response was received or error occurs when setting up the request.
      message.error('Cannot connect to server, please check your network');
  }
  throw response;
}

export async function queryBrand() {
  return request('/api/product/brand/list', { errorHandler });
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

export async function getPreSignedData(params) {
  return request(`/api/thirdparty/oss/policy?fileName=${params}`)
  // custom error response
  .catch((error) => {
    console.log(error);
    return {
      code: 500,
    }
  });
}

export async function uploadLogo(params) {
  return request(params.url, {
    method: 'PUT',
    data: params.image,
  })
    .then((response) => {
      console.log(response); // empty response from aws
      // custom response
      return {
        msg: "success",
        code: 0,
      };
    })
    .catch((error) => {
      console.log(error);
      // custom error response
      return {
        code: 500,
      }
    });
}

export async function queryCategoryBrandRelation(params) {
  return request(`/api/product/categorybrandrelation/category/list?brandId=${params}`);
}

export async function saveCategoryBrandRelation(params) {
  return request('/api/product/categorybrandrelation/save', {
    method: 'POST',
    data: params,
  });
}

export async function deleteCategoryBrandRelation(params) {
  return request('/api/product/categorybrandrelation/delete', {
    method: 'POST',
    data: params,
  });
}