import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const counterApiSlice = createApi({
  reducerPath: 'counterApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    getCount: builder.query<number, void>({
      query: () => 'count',
    }),
    incrementCount: builder.mutation<number, number>({
      query: (amount) => ({
        url: 'increment',
        method: 'POST',
        body: { amount },
      }),
    }),
  }),
});

// useGetCountQuery や useIncrementCountMutation は、createApi から 自動的に生成される カスタムフックです。
// createApi を使うと、定義した各エンドポイント（getCount や incrementCount）に基づいて、以下のようなフックが自動的に生成されます。

// どこで生成されるか：
// getCount → useGetCountQuery
// incrementCount → useIncrementCountMutation
// これらは、createApi のエンドポイントが query や mutation として定義されると、自動的にフックとしてエクスポートされます。
// つまり、エンドポイントの名前に応じて useXxxQuery や useXxxMutation というフックが自動的に生成されます。

// 生成されたフックの使用例：
// useGetCountQuery: getCount で定義された GET リクエストのエンドポイントからデータを取得するために使われる。
// useIncrementCountMutation: incrementCount で定義された POST リクエストを実行するために使われる。

export const { useGetCountQuery, useIncrementCountMutation } = counterApiSlice;

// get の使用例
// import React from 'react';
// import { useGetCountQuery } from './counterApi';

// const CounterDisplay = () => {
//   const { data: count, error, isLoading, refetch } = useGetCountQuery();

//   if (isLoading) return <div>Loading...</div>;
//   if (error) return <div>Error fetching data</div>;

//   return (
//     <div>
//       <h1>カウント: {count}</h1>
//       <button onClick={refetch}>再取得</button> {/* 再取得ボタン */}
//     </div>
//   );
// };

// export default CounterDisplay;

// post の使用例
// import React from 'react';
// import { useIncrementCountMutation } from './counterApi';

// const IncrementButton = () => {
//   // useIncrementCountMutation でカウントを増加させる
//   const [incrementCount, { isLoading }] = useIncrementCountMutation();

//   const handleIncrement = async () => {
//     try {
//       // サーバーにリクエストを送ってカウントを増加
//       await incrementCount(5); // 5 増加させる
//     } catch (error) {
//       console.error('Error incrementing count:', error);
//     }
//   };

//   return (
//     <button onClick={handleIncrement} disabled={isLoading}>
//       {isLoading ? 'Incrementing...' : 'Increment Count'}
//     </button>
//   );
// };

// export default IncrementButton;
