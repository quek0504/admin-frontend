import request from 'umi-request';

export async function fetchAttrGroup() {
    return request('/api/product/attrgroup/list/0');
}

export async function queryAttrGroup(params) {
    return request(`/api/product/attrgroup/list/${params.categoryId}`, {
        params
    });
}

export async function queryAttrGroupInfo(attrGroupId) {
    return request(`/api/product/attrgroup/info/${attrGroupId}`);
}

export async function removeAttrGroup(params) {
    return request('/api/product/attrgroup/delete', {
        method: 'POST',
        data: params,
    });
}

export async function addAttrGroup(params) {
    return request('/api/product/attrgroup/save', {
        method: 'POST',
        data: params,
    });
}

export async function updateAttrGroup(params) {
    return request('/api/product/attrgroup/update', {
        method: 'POST',
        data: params,
    });
}

export async function queryAttrRelation(attrGroupId) {
    return request(`/api/product/attrgroup/${attrGroupId}/attr/relation`);
}

export async function deleteAttrRelation(params) {
    return request('api/product/attrgroup/attr/relation/delete', {
        method: 'POST',
        data: params,
    });
}