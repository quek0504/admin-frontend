import {
    queryBrand,
    getPreSignedData,
    uploadLogo,
    queryCategoryBrandRelation,
    saveCategoryBrandRelation,
    deleteCategoryBrandRelation
} from './service';

const Model = {
    namespace: 'productBrand',
    state: {
        data: [],
        relation: []
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryBrand, payload);
            yield put({
                type: 'queryProductBrand',
                payload: response.page.list,
            });
        },
        *fetchRelation({ payload }, { call, put }) {
            const response = yield call(queryCategoryBrandRelation, payload);
            yield put({
                type: 'queryRelation',
                payload: response.data,
            });
        },
        *saveRelation({ payload }, { call }) {
            const response = yield call(saveCategoryBrandRelation, payload);
            return response;
        },
        *deleteRelation({ payload }, { call }) {
            const response = yield call(deleteCategoryBrandRelation, payload);
            return response;
        },
        *getPreSigned({ payload }, { call }) {
            const response = yield call(getPreSignedData, payload);
            return response;
        },
        *upload({ payload }, { call }) {
            const response = yield call(uploadLogo, payload);
            return response;
        }
    },
    reducers: {
        // reducer naming match 'type'
        queryProductBrand(state, action) {
            return { ...state, data: action.payload };
        },
        queryRelation(state, action) {
            return { ...state, relation: action.payload };
        },
    },
};
export default Model;
