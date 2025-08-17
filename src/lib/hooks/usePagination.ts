'use client';
import { useState, useCallback } from 'react';
import {
  collection,
  query,
  orderBy,
  startAfter,
  limit,
  getDocs,
  Query,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface PaginationResult<T> {
  data: T[];
  loading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

export const usePagination = <T extends DocumentData>(
  collectionPath: string,
  pageSize: number = 10,
  ...queryConstraints: any[]
): PaginationResult<T> => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      let q: Query<DocumentData>;
      const collectionRef = collection(db, collectionPath);

      const constraints = [...queryConstraints];
      if (lastDoc) {
        constraints.push(startAfter(lastDoc));
      }
      constraints.push(limit(pageSize));

      q = query(collectionRef, ...constraints);

      const documentSnapshots = await getDocs(q);

      const newData = documentSnapshots.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as unknown)) as T[];

      setLastDoc(documentSnapshots.docs[documentSnapshots.docs.length - 1] || null);
      setData(prevData => lastDoc ? [...prevData, ...newData] : newData);
      setHasMore(newData.length === pageSize);

    } catch (error) {
      console.error("Error fetching paginated data:", error);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, lastDoc, collectionPath, pageSize, queryConstraints]);

  return { data, loading, hasMore, loadMore };
};
