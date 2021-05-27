import {
  queryProductCategory,
  queryProductCategoryInfo,
  addProductCategory,
  updateProductCategory,
  updateSortProductCategory,
  removeProductCategory,
} from './service';

const Model = {
  namespace: 'productCategory',
  state: {
    data: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(queryProductCategory, payload);
        yield put({
          type: 'queryProductCategory',
          payload: response.data,
        });
      } catch (error) {
        console.log(error)
      }
    },
    *dragUpdate({ payload }, { put }) {
      yield put({
        type: 'updateProductCategory',
        payload,
      })
    },
    *getInfo({ payload }, { call }) {
      try {
        const response = yield call(queryProductCategoryInfo, payload);
        return response;
      } catch (error) {
        console.log(error);
      }
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
      try {
        const response = yield call(callback, payload);
        return response;
      } catch (error) {
        console.log(error);
      }

    },
    *dragUpdateSubmit({payload}, {call}) {
      try {
        const response = yield call(updateSortProductCategory, payload);
        return response;
      } catch (error) {
        console.log(error);
      }
    }
  },
  reducers: {
    // reducer naming match 'type'
    queryProductCategory(state, action) {
      return { ...state, data: action.payload };
    },
    updateProductCategory(state, action) {
      return { ...state, data: action.payload};
    }
  },
};
export default Model;
