import request from 'umi-request';

// fetch table
export async function querySpec(params) {
    return request(`/api/product/attr/base/list/${params.categoryId}`, {
        params
    });
}

// on category cascader change, for form use
export async function queryAttrGroups(categoryId) {
    return request(`/api/product/attrgroup/list/${categoryId}`);
}

// for update-form use
export async function querySpecAttr(attrId) {
    return request(`/api/product/attr/info/${attrId}`);
}

export async function addSpecAttr(params) {
    return request('/api/product/attr/save', {
        method: 'POST',
        data: params,
    });
}

export async function updateSpecAttr(params) {
    return request('/api/product/attr/update', {
        method: 'POST',
        data: params,
    });
}

export async function removeSpecAttr(params) {
    return request('/api/product/attr/delete', {
        method: 'POST',
        data: params,
    });
}