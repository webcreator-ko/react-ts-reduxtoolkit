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

// 同期および非同期のロジックを含むthunkを手動で作成することもできます。
// 以下は、現在の状態に基づいてアクションを条件付きでディスパッチする例です。
export const incrementIfOdd =
  (amount: number): AppThunk =>
  (dispatch, getState) => {
    const currentValue = selectCount(getState());

    if (currentValue % 2 === 1 || currentValue % 2 === -1) {
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
