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