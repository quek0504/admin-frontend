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
            try {
                const response = yield call(fetchAttrGroup, payload);
                yield put({
                    type: 'getAttrGroup',
                    payload: response.page.list,
                });
            } catch (error) {
                console.log(error);
            }
        },
        *query({ payload }, { call, put }) {
            try {
                const response = yield call(queryAttrGroup, payload);
                yield put({
                    type: 'getAttrGroup',
                    payload: response.page.list,
                });
            } catch (error) {
                console.log(error);
            }
        },
        *clear({}, { put }) {
            yield put({
                type: 'clearAttrGroup'
            });
        },
        *fetchRelation({ payload }, { call, put }) {
            try {
                const response = yield call(queryAttrRelation, payload);
                yield put({
                    type: 'queryRelation',
                    payload: response.data,
                });
                return true;
            } catch (error) {
                console.log(error);
            }

        },
        *saveRelation({ payload }, { call }) {
            try {
                const response = yield call(saveAttrRelation, payload);
                return response;
            } catch (error) {
                console.log(error);
            }
        },
        *deleteRelation({ payload }, { call }) {
            try {
                const response = yield call(deleteAttrRelation, payload);
                return response;
            } catch (error) {
                console.log(error);
            }
        },
        *fetchNonRelation({ payload }, { call, put }) {
            try {
                const response = yield call(queryNonAttrRelation, payload);
                yield put({
                    type: 'queryNonRelation',
                    payload: response.page.list,
                });
                return true;
            } catch (error) {
                console.log(error);
            }
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
