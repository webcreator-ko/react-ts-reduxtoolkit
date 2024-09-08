// このファイルは、型付きReduxフックを再エクスポートするための中央ハブとして機能します。
// 型付きフックの一貫した使用を保証するために、他の場所でこれらのインポートは制限されています。
// ここでは、型付きフックのインポートと再エクスポートを行う指定された場所のため、
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './index';

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
