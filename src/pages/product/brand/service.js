import request from 'umi-request';

// export async function queryRule(params) {
//   return request('/api/rule', {
//     params,
//   });
// }

export async function queryBrand() {
  return request('/api/product/brand/list');
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
  return request(`/api/thirdparty/oss/policy?fileName=${params}`);
}

export async function uploadLogo(params) {
  return request(params.url, {
    method: 'PUT',
    data: params.image
  }).then((response) => {
    console.log(response); // empty response from aws
    // custom response as we get empty response, might have better implementation
    return {
      code: 0,
    };
  })
    .catch((error) => {
      console.log(error);
      return error;
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