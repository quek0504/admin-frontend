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
            try {
                const response = yield call(queryBrand, payload);
                yield put({
                    type: 'queryProductBrand',
                    payload: response.page.list,
                });
            } catch (error) {
                console.log(error);
            }
        },
        *fetchRelation({ payload }, { call, put }) {
            try {
                const response = yield call(queryCategoryBrandRelation, payload);
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
                const response = yield call(saveCategoryBrandRelation, payload);
                return response;
            } catch (error) {
                console.log(error);
            }
        },
        *deleteRelation({ payload }, { call }) {
            try {
                const response = yield call(deleteCategoryBrandRelation, payload);
                return response;
            } catch (error) {
                console.log(error);
            }
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
