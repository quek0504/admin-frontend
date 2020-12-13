import {
    fetchAttrGroup,
    queryAttrGroup,
} from './service';

const Model = {
    namespace: 'attrGroup',
    state: {
        data: []
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(fetchAttrGroup, payload);
            console.log("printing response");
            console.log(response);
            yield put({
                type: 'getAttrGroup',
                payload: response.page.list,
            });
        },
        *query({ payload }, { call, put }) {
            console.log("printing payload");
            console.log(payload);
            const response = yield call(queryAttrGroup, payload);
            console.log("printing response");
            console.log(response);
            yield put({
                type: 'getAttrGroup',
                payload: response.page.list,
            });
        },
        *clear({}, { put }) {
            yield put({
                type: 'clearAttrGroup'
            });
        },
    },
    reducers: {
        // reducer naming match 'type'
        getAttrGroup(state, action) {
            return { ...state, data: action.payload };
        },
        clearAttrGroup(state) {
            return { ...state, data: []};
        }
    },
};
export default Model;
