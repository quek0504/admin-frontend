import { queryProductCategory, addProductCategory, removeProductCategory } from './service';

const Model = {
  namespace: 'productCategory',
  state: {
    data: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryProductCategory, payload);
      yield put({
        type: 'queryProductCategory',
        payload: response.data,
      });
      return response;
    },
    *submit({ payload }, { call }) {
      if (Array.isArray(payload)) {
        const response = yield call(removeProductCategory, payload);
        return response;
      }
      const response = yield call(addProductCategory, payload);
      return response;
    },
  },
  reducers: {
    // reducer naming match 'type'
    queryProductCategory(state, action) {
      return { ...state, data: action.payload };
    },
  },
};
export default Model;
