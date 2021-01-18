import {
    querySpec,
} from './service';

const Model = {
    namespace: 'specAttribute',
    state: {
        data: [],
    },
    effects: {
        *query({ payload }, { call, put }) {
            const response = yield call(querySpec, payload);
            yield put({
                type: 'getSpecAttr',
                payload: response.page.list,
            });
        },
        *clear({ }, { put }) {
            yield put({
                type: 'clearSpecAttr'
            });
        },
    },
    reducers: {
        getSpecAttr(state, action) {
            return { ...state, data: action.payload };
        },
        clearSpecAttr(state) {
            return { ...state, data: [] };
        },
    },
};
export default Model;
