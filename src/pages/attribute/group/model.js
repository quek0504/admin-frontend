import {
    fetchAttrGroup,
    queryAttrGroup,
    queryAttrRelation,
} from './service';

const Model = {
    namespace: 'attrGroup',
    state: {
        data: [],
        relation: [],
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(fetchAttrGroup, payload);
            yield put({
                type: 'getAttrGroup',
                payload: response.page.list,
            });
        },
        *query({ payload }, { call, put }) {
            const response = yield call(queryAttrGroup, payload);
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
        *fetchRelation({ payload }, { call, put }) {
            const response = yield call(queryAttrRelation, payload);
            yield put({
                type: 'queryRelation',
                payload: response.data,
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
        },
        queryRelation(state, action) {
            return { ...state, relation: action.payload };
        },
    },
};
export default Model;
