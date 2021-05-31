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
        message.error(codeMap[response.status] + ', fail to fetch attribute group info');
    } else {
        // The request was made but no response was received or error occurs when setting up the request.
        message.error('Cannot connect to server, please check your network');
    }
    throw response;
}

export async function fetchAttrGroup() {
    return request('/api/product/attrgroup/list/0', {errorHandler});
}

export async function queryAttrGroup(params) {
    return request(`/api/product/attrgroup/list/${params.categoryId}`, {
        errorHandler,
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

export async function saveAttrRelation(params) {
    return request('/api/product/attrgroup/attr/relation', {
        method: 'POST',
        data: params,
    });
}

export async function deleteAttrRelation(params) {
    return request('/api/product/attrgroup/attr/relation/delete', {
        method: 'POST',
        data: params,
    });
}

export async function queryNonAttrRelation(params) {
    return request(`/api/product/attrgroup/${params.attrGroupId}/noattr/relation`, {
        params
    });
}