import {
    fetchMemberType,
} from './service';

const Model = {
    namespace: 'memberType',
    state: {
        data: [],
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(fetchMemberType, payload);
            yield put({
                type: 'getMemberType',
                payload: response.page.list,
            });
        },
    },
    reducers: {
        // reducer naming match 'type'
        getMemberType(state, action) {
            return { ...state, data: action.payload };
        },
    },
};
export default Model;
