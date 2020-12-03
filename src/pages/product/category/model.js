import { queryProductCategory, removeProductCategory } from './service';

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
    },
    *submit({ payload }, { call }) {
      const response = yield call(removeProductCategory, payload);
      return response.code;
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
