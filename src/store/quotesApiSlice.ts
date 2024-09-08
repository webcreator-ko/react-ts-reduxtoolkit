// React固有のエントリーポイントを使用して `createApi` をインポートする必要があります
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Quote {
  id: number;
  quote: string;
  author: string;
}

interface QuotesApiResponse {
  quotes: Quote[];
  total: number;
  skip: number;
  limit: number;
}

// RTK Query は、Redux Toolkit の一部で、API リクエストやデータのキャッシュ、ステータス管理を簡単に行うためのツールです。
// createApi と fetchBaseQuery を使用して、RTK Query を使った API サービス（quotesApiSlice）を作成しています。
// このコードでは、外部 API からデータを取得するためのクエリや、キャッシュ管理などを行っています。

// RTK Query API の要素
// createApi:
// RTK Query で API サービスを作成するための関数です。この関数を使って、エンドポイントやキャッシュ管理の設定を行います。
// fetchBaseQuery:

// RTK Query によって提供されるシンプルなクエリ関数で、baseQuery として使うことで、baseUrl から始まる API リクエストを簡単に構築できます。
// エンドポイントの定義 (endpoints):

// getQuotes というクエリが定義されており、これは quotesApiSlice 内の API エンドポイントです。
// このクエリを使って https://dummyjson.com/quotes?limit=10 のようなリクエストが実行されます。
// useGetQuotesQuery:

// RTK Query によって自動生成される React フックです。このフックを使うことで、コンポーネント内で getQuotes クエリの結果を取得できます。
export const quotesApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://dummyjson.com/quotes' }),
  reducerPath: 'quotesApi',
  // タグタイプはキャッシュと無効化に使われます。
  tagTypes: ['Quotes'],
  endpoints: (build) => ({
    // 戻り値の型（この場合は `QuotesApiResponse`）と
    // 予想されるクエリの引数を指定します。引数がない場合は
    // 引数の型として `void` を使います。
    getQuotes: build.query<QuotesApiResponse, number>({
      query: (limit = 10) => `?limit=${limit}`,
      // `providesTags` は、クエリから返されたデータに
      // どの 'タグ' をキャッシュとして関連付けるかを決定します。
      providesTags: (result, error, id) => [{ type: 'Quotes', id }],
    }),
  }),
});

// フックは RTK-Query によって自動生成されます
// `quotesApiSlice.endpoints.getQuotes.useQuery` と同じです
export const { useGetQuotesQuery } = quotesApiSlice;
