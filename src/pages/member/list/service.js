import request from 'umi-request';

export async function fetchMemberType() {
    return request('/api/member/memberlevel/list');
}

export async function addMemberType(params) {
    return request('/api/member/memberlevel/save', {
        method: 'POST',
        data: params,
    });
}

export async function updateMemberType(params) {
    return request('/api/member/memberlevel/update', {
        method: 'POST',
        data: params,
    });
}

export async function removeMemberType(params) {
    return request('/api/member/memberlevel/delete', {
        method: 'POST',
        data: params,
    });
}

