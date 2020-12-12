import {
    queryBrand,
    getPreSignedData,
    uploadLogo
} from './service';

const Model = {
    namespace: 'productBrand',
    state: {
        data: [],
    },
    effects: {
        *fetch({ payload }, { call, put }) {
            const response = yield call(queryBrand, payload);
            yield put({
                type: 'queryProductBrand',
                payload: response.page.list,
            });
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
    },
};
export default Model;
