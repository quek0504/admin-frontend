import { queryProductCategory } from './service';

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
  },
  reducers: {
    // reducer naming match 'type'
    queryProductCategory(state, action) {
      return { ...state, data: action.payload };
    },
  },
};
export default Model;
