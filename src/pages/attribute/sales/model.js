import {
    querySalesAttr,
} from './service';

const Model = {
    namespace: 'salesAttribute',
    state: {
        data: [],
    },
    effects: {
        *query({ payload }, { call, put }) {
            const response = yield call(querySalesAttr, payload);
            yield put({
                type: 'getSalesAttr',
                payload: response.page.list,
            });
        },
        *clear({ }, { put }) {
            yield put({
                type: 'clearSalesAttr'
            });
        },
    },
    reducers: {
        getSalesAttr(state, action) {
            return { ...state, data: action.payload };
        },
        clearSalesAttr(state) {
            return { ...state, data: [] };
        },
    },
};
export default Model;
