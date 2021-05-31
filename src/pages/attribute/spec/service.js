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
        message.error(codeMap[response.status] + ', fail to fetch specification info');
    } else {
        // The request was made but no response was received or error occurs when setting up the request.
        message.error('Cannot connect to server, please check your network');
    }
    throw response;
}

// fetch table
export async function querySpec(params) {
    return request(`/api/product/attr/base/list/${params.categoryId}`, {
        params,
        errorHandler
    });
}

// on category cascader change, for form use
export async function queryAttrGroups(categoryId) {
    return request(`/api/product/attrgroup/list/${categoryId}`);
}

// for update-form use
export async function queryAttrInfo(attrId) {
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