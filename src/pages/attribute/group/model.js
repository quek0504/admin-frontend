import {
    fetchAttrGroup,
    queryAttrGroup,
    queryAttrRelation,
    saveAttrRelation,
    deleteAttrRelation,
    queryNonAttrRelation
} from './service';

const Model = {
    namespace: 'attrGroup',
    state: {
        data: [],
        relation: [],
        nonRelation: [],
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
        *saveRelation({ payload }, { call }) {
            const response = yield call(saveAttrRelation, payload);
            return response;
        },
        *deleteRelation({ payload }, { call }) {
            const response = yield call(deleteAttrRelation, payload);
            return response;
        },
        *fetchNonRelation({ payload }, { call, put }) {
            const response = yield call(queryNonAttrRelation, payload);
            yield put({
                type: 'queryNonRelation',
                payload: response.page.list,
            });
        },
    },
    reducers: {
        // reducer naming match 'type'
        getAttrGroup(state, action) {
            return { ...state, data: action.payload };
        },
        clearAttrGroup(state) {
            return { ...state, data: [] };
        },
        queryRelation(state, action) {
            return { ...state, relation: action.payload };
        },
        queryNonRelation(state, action) {
            return { ...state, nonRelation: action.payload };
        },
    },
};
export default Model;
