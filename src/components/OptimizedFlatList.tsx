import React, { useCallback } from 'react';
import { FlatList, FlatListProps } from 'react-native';

// Optimized FlatList component
interface OptimizedFlatListProps<T> extends Omit<FlatListProps<T>, 'renderItem'> {
  renderItem: (item: T, index: number) => React.ReactElement;
  keyExtractor?: (item: T, index: number) => string;
  itemHeight?: number;
}

export function OptimizedFlatList<T>({
  data,
  renderItem,
  keyExtractor,
  itemHeight = 80,
  ...props
}: OptimizedFlatListProps<T>) {
  const stableRenderItem = useCallback(
    ({ item, index }: { item: T; index: number }) => renderItem(item, index),
    [renderItem]
  );

  const stableKeyExtractor = useCallback(
    (item: T, index: number) => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      // Fallback to index if no keyExtractor provided
      return index.toString();
    },
    [keyExtractor]
  );

  const getItemLayout = useCallback(
    (data: T[] | null | undefined, index: number) => ({
      length: itemHeight,
      offset: itemHeight * index,
      index,
    }),
    [itemHeight]
  );

  return (
    <FlatList
      data={data}
      renderItem={stableRenderItem}
      keyExtractor={stableKeyExtractor}
      getItemLayout={getItemLayout}
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={100}
      initialNumToRender={10}
      windowSize={10}
      {...props}
    />
  );
}
