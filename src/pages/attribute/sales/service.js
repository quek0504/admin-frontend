import request from 'umi-request';

// fetch table
export async function querySalesAttr(params) {
    return request(`/api/product/attr/sale/list/${params.categoryId}`, {
        params
    });
}

// for update-form use
export async function queryAttrInfo(attrId) {
    return request(`/api/product/attr/info/${attrId}`);
}

export async function addSalesAttr(params) {
    return request('/api/product/attr/save', {
        method: 'POST',
        data: params,
    });
}

export async function updateSalesAttr(params) {
    return request('/api/product/attr/update', {
        method: 'POST',
        data: params,
    });
}

export async function removeSalesAttr(params) {
    return request('/api/product/attr/delete', {
        method: 'POST',
        data: params,
    });
}