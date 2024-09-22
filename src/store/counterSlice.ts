import {
  createAsyncThunk,
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';
import { fetchCount } from '../components/counter/counterAPI';
import { AppThunk, RootState } from '@/store';

export interface CounterSliceState {
  value: number;
  status: 'idle' | 'loading' | 'failed';
}

const initialState: CounterSliceState = {
  value: 0,
  status: 'idle',
};

// 非同期のthunkを使わない場合、スタンドアロンの `createSlice` を使用できます
export const counterSlice = createSlice({
  name: 'counter',
  // `createSlice` は `initialState` 引数から状態の型を推論します
  initialState,
  // `reducers` フィールドではリデューサーを定義し、対応するアクションを生成します
  reducers: (create) => ({
    increment: create.reducer((state) => {
      // Redux Toolkitは、リデューサー内で「ミュータブル（変更可能）」なロジックを書くことを許可しています。
      // ただし、実際には状態を変更しているわけではなく、Immerライブラリを使用して
      // 状態の変化を検知し、新しい不変の状態を生成します。
      state.value += 1;
    }),
    decrement: create.reducer((state) => {
      state.value -= 1;
    }),
    // `PayloadAction` 型を使用して、`action.payload` の内容を宣言します
    incrementByAmount: create.reducer(
      (state, action: PayloadAction<number>) => {
        state.value += action.payload;
      }
    ),
  }),
  // extraReducers は、Redux Toolkit の createSlice 関数内で、標準的な reducers に加えて、
  // 他のアクション（特に非同期アクション）を処理するための追加のリデューサーを定義するために使用されるフィールドです。
  // 主な役割
  // extraReducers の主な役割は、他のアクションや非同期処理の結果に応じて状態を更新することです。
  // これにより、createAsyncThunk で定義された非同期アクションや、他のスライスで定義されたアクションに対して、createSlice 内で反応できるようになります。
  extraReducers: (builder) => {
    builder
      .addCase(incrementAsync.pending, (state) => {
        state.status = 'loading';
      })
      // fulfilled は成功を表す
      .addCase(incrementAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.value += action.payload;
      })
      .addCase(incrementAsync.rejected, (state) => {
        state.status = 'failed';
      });
  },
  // セレクタをここで定義することができます。セレクタは、スライスの状態を最初の引数として受け取ります。
  // selectors: {
  //   selectCount: (counter) => counter.value,
  //   selectStatus: (counter) => counter.status,
  // },
});

export const incrementAsync = createAsyncThunk(
  'counter/fetchCount',
  async (amount: number) => {
    const response = await fetchCount(amount);
    return response.data;
  }
);

// incrementAsync を使用する例
// const Counter = () => {
//   const dispatch = useDispatch();
//   const count = useSelector(selectCount); // 現在のカウント値を取得
//   const status = useSelector(selectStatus); // 非同期処理の状態を取得

//   const handleAsyncIncrement = () => {
//     dispatch(incrementAsync(5)); // 非同期アクションをトリガー
//   };

//   return (
//     <div>
//       <h1>カウント: {count}</h1>
//       <p>ステータス: {status}</p>
//       <button onClick={handleAsyncIncrement} disabled={status === 'loading'}>
//         {status === 'loading' ? '読み込み中...' : '非同期でインクリメント'}
//       </button>
//       {status === 'failed' && <p>エラーが発生しました</p>}
//     </div>
//   );
// };

// 補足
// dispatch(incrementAsync(5)) に await をつけることは可能です。
// これは incrementAsync が createAsyncThunk によって作成されており、Promise を返す非同期アクションだからです
// const handleAsyncIncrement = async () => {
//   const result = await dispatch(incrementAsync(5)); // 完了まで待機
//   if (incrementAsync.fulfilled.match(result)) {
//     console.log("成功:", result.payload); // 成功時の処理
//   } else if (incrementAsync.rejected.match(result)) {
//     console.error("失敗:", result.error.message); // 失敗時の処理
//   }
// };

// 同期および非同期のロジックを含むthunkを手動で作成することもできます。
// 以下は、現在の状態に基づいてアクションを条件付きでディスパッチする例です。
// incrementIfOdd は thunk 関数 なので、通常のアクションと同じように dispatch できます。
// reducers や extraReducers は アクションに応じて状態を変更 する場所ですが、thunk はアクションの ディスパッチを制御 するものなので、
// 直接スライス内に記述していなくても問題ありません。
export const incrementIfOdd =
  (amount: number): AppThunk =>
  async (dispatch, getState) => {
    const currentValue = selectCount(getState());

    if (currentValue % 2 === 1 || currentValue % 2 === -1) {
      // const response = await someAsyncFunction(); // 非同期処理（例: API呼び出し）
      dispatch(incrementByAmount(amount));
    }
  };

// 各リデューサー関数に対してアクションクリエーターが生成されます
export const { decrement, increment, incrementByAmount } = counterSlice.actions;

// 基本セレクター
const selectCounter = (state: RootState) => state.counter;

// メモ化されたセレクター
export const selectCount = createSelector(
  [selectCounter],
  (counter) => counter.value
);

export const selectStatus = createSelector(
  [selectCounter],
  (counter) => counter.status
);
