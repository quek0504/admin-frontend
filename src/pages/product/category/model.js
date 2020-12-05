import {
  queryProductCategory,
  queryProductCategoryInfo,
  addProductCategory,
  updateProductCategory,
  removeProductCategory,
} from './service';

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
    *getInfo({ payload }, { call }) {
      const response = yield call(queryProductCategoryInfo, payload);
      return response;
    },
    *submit({ payload }, { call }) {
      let callback;
      if (Array.isArray(payload)) {
        callback = removeProductCategory;
      } else if (!payload.edit) {
        callback = addProductCategory;
      } else {
        callback = updateProductCategory;
      }

      const response = yield call(callback, payload);
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
