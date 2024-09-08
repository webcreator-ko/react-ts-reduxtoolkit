import type { Action, ThunkAction } from '@reduxjs/toolkit';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { counterSlice } from './counterSlice';
import { quotesApiSlice } from './quotesApiSlice';

// combineSlices は、状態（state）を管理するための関数で、複数の「スライス」を一つの大きな管理単位（リデューサー）に結合しています。
// これによって、アプリ全体の状態を一箇所で管理できるようになります。
const rootReducer = combineSlices(counterSlice, quotesApiSlice);
// RootState は、アプリ全体の状態の型を定義しています。
// この型を使うことで、どのようなデータが管理されているかを型として扱うことができ、ミスを減らせます。
export type RootState = ReturnType<typeof rootReducer>;

// （ストアを作る関数）
// makeStore は、アプリ全体で状態を管理する「ストア」を作るための関数です。ストアは、アプリのデータの中心的な場所で、他の部分からアクセスして操作します。
export const makeStore = (preloadedState?: Partial<RootState>) => {
  // Reduxの状態管理システムをセットアップするための関数です
  const store = configureStore({
    // 先ほど結合した全体の状態管理（rootReducer）をストアにセットします。
    reducer: rootReducer,

    // Reduxのデータ管理を補助する機能を追加する部分で、
    // ここではquotesApiSlice.middlewareを追加して、API呼び出しやキャッシュの管理をサポートします。

    // quotesApiSlice.middleware は、Redux Toolkit の configureStore の設定に渡されているため、自動的に実行されるものです。
    // 具体的には、configureStore の middleware プロパティに渡すことで、ミドルウェアの連鎖に組み込まれ、Redux のアクションがディスパッチ（実行）されるたびに、
    // 該当するミドルウェアが自動的に処理を行います。

    // 詳しい説明：
    // quotesApiSlice.middleware は、おそらく RTK Query（Redux Toolkit Query）の一部であり、
    // APIの呼び出しやキャッシュの管理、データの取得・再取得などの便利な機能を提供するためのミドルウェアです。
    // これが configureStore の middleware 配列に追加されることで、Redux のディスパッチが実行されたときに自動的に処理が実行されます。

    // 流れのイメージ
    // アクションのディスパッチ
    // Redux で何かしらのアクション（状態の変更など）がディスパッチ（実行）される。

    // ミドルウェアの自動実行
    // quotesApiSlice.middleware が、ディスパッチされたアクションを監視し、API リクエストが必要かどうかを判断します。
    // 必要であれば、API の呼び出しを行い、レスポンスが返ってきたら状態を更新します。

    // 結論：
    // quotesApiSlice.middleware は、ストアの設定時に自動的に登録され、Redux アクションがディスパッチされたときに自動で実行されます。特別な手動操作は必要ありません。
    middleware: (getDefaultMiddleware) => {
      return getDefaultMiddleware().concat(quotesApiSlice.middleware);
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
