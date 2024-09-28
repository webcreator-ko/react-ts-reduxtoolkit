import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { counterApiSlice } from './counterApiSlice';
import { counterSlice } from './counterSlice';
import { quotesApiSlice } from './quotesApiSlice';

const rootReducer = combineReducers({
  counter: counterSlice.reducer, // 通常のスライス
  [quotesApiSlice.reducerPath]: quotesApiSlice.reducer, // createApiのリデューサー
  [counterApiSlice.reducerPath]: counterApiSlice.reducer, // counterApiのレデューサー
});

export type RootState = ReturnType<typeof rootReducer>;

export const makeStore = (preloadedState?: Partial<RootState>) => {
  const store = configureStore({
    reducer: rootReducer,

    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware()
        .concat(quotesApiSlice.middleware)
        .concat(counterApiSlice.middleware);
    },
    // preloadedState は、アプリの初期データを必要に応じて指定できるオプションです。
    preloadedState,
  });
  // 再接続やフォーカス時にデータを自動再取得する機能を有効化しています。
  setupListeners(store.dispatch);
  return store;
};

// 実際にアプリ全体の状態を管理する「ストア」を生成して、それをエクスポートしています。
// これで他のファイルからこのストアを使えるようになります。
export const store = makeStore();

// AppStore は、先ほど作った store の型を定義しています。これにより、コード内で store がどのようなものかを型として保証できます。
export type AppStore = typeof store;
// AppDispatch は、アクションを実行するための dispatch 関数の型を定義しています。
export type AppDispatch = AppStore['dispatch'];
// AppThunk は、非同期処理（例えばAPI呼び出しなど）を扱うための関数の型です。
// この型を定義することで、非同期処理がどのように動作するかを型として保証できます。
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
