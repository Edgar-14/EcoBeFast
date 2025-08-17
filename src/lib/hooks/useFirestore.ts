'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  DocumentData,
  Query,
  QuerySnapshot,
  DocumentSnapshot,
  Timestamp
} from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

export interface UseFirestoreOptions {
  realtime?: boolean;
  transform?: (data: any) => any;
}

export const useDocument = <T = DocumentData>(
  path: string,
  options: UseFirestoreOptions = {}
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!path) return;

    const docRef = doc(db, path);

    if (options.realtime) {
      const unsubscribe = onSnapshot(
        docRef,
        (snapshot: DocumentSnapshot) => {
          if (snapshot.exists()) {
            let docData = { id: snapshot.id, ...snapshot.data() };

            // Transform Firestore Timestamps to Date objects
            docData = transformTimestamps(docData);

            if (options.transform) {
              docData = options.transform(docData);
            }

            setData(docData as T);
          } else {
            setData(null);
          }
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } else {
      getDoc(docRef)
        .then((snapshot) => {
          if (snapshot.exists()) {
            let docData = { id: snapshot.id, ...snapshot.data() };
            docData = transformTimestamps(docData);

            if (options.transform) {
              docData = options.transform(docData);
            }

            setData(docData as T);
          } else {
            setData(null);
          }
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [path, options.realtime]);

  return { data, loading, error };
};

export const useCollection = <T = DocumentData>(
  collectionPath: string,
  queryConstraints: any[] = [],
  options: UseFirestoreOptions = {}
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!collectionPath) return;

    const collectionRef = collection(db, collectionPath);
    const q = query(collectionRef, ...queryConstraints);

    if (options.realtime) {
      const unsubscribe = onSnapshot(
        q,
        (snapshot: QuerySnapshot) => {
          const docs = snapshot.docs.map(doc => {
            let docData = { id: doc.id, ...doc.data() };
            docData = transformTimestamps(docData);

            if (options.transform) {
              docData = options.transform(docData);
            }

            return docData;
          });

          setData(docs as T[]);
          setLoading(false);
          setError(null);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      );

      return unsubscribe;
    } else {
      getDocs(q)
        .then((snapshot) => {
          const docs = snapshot.docs.map(doc => {
            let docData = { id: doc.id, ...doc.data() };
            docData = transformTimestamps(docData);

            if (options.transform) {
              docData = options.transform(docData);
            }

            return docData;
          });

          setData(docs as T[]);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }
  }, [collectionPath, JSON.stringify(queryConstraints), options.realtime]);

  return { data, loading, error };
};

export const usePagination = <T = DocumentData>(
  collectionPath: string,
  pageSize: number = 25,
  queryConstraints: any[] = []
) => {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const collectionRef = collection(db, collectionPath);
      let q = query(collectionRef, ...queryConstraints, limit(pageSize));

      if (lastDoc) {
        q = query(collectionRef, ...queryConstraints, startAfter(lastDoc), limit(pageSize));
      }

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setHasMore(false);
      } else {
        const newDocs = snapshot.docs.map(doc => {
          let docData = { id: doc.id, ...doc.data() };
          return transformTimestamps(docData);
        });

        setData(prev => lastDoc ? [...prev, ...newDocs] : newDocs);
        setLastDoc(snapshot.docs[snapshot.docs.length - 1]);
        setHasMore(snapshot.docs.length === pageSize);
      }
    } catch (error) {
      console.error('Error loading more documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setData([]);
    setLastDoc(null);
    setHasMore(true);
  };

  return { data, loading, hasMore, loadMore, reset };
};

// Firestore operations
export const createDocument = async (
  collectionPath: string,
  id: string,
  data: any
): Promise<void> => {
  const docRef = doc(db, collectionPath, id);
  await setDoc(docRef, {
    ...data,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now()
  });
};

export const updateDocument = async (
  collectionPath: string,
  id: string,
  data: any
): Promise<void> => {
  const docRef = doc(db, collectionPath, id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: Timestamp.now()
  });
};

export const deleteDocument = async (
  collectionPath: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionPath, id);
  await deleteDoc(docRef);
};

export const getDocument = async (
  collectionPath: string,
  id: string
): Promise<any | null> => {
  const docRef = doc(db, collectionPath, id);
  const snapshot = await getDoc(docRef);

  if (snapshot.exists()) {
    let data = { id: snapshot.id, ...snapshot.data() };
    return transformTimestamps(data);
  }

  return null;
};

// Helper function to transform Firestore Timestamps to Date objects
const transformTimestamps = (obj: any): any => {
  if (obj === null || obj === undefined) return obj;

  if (obj instanceof Timestamp) {
    return obj.toDate();
  }

  if (Array.isArray(obj)) {
    return obj.map(transformTimestamps);
  }

  if (typeof obj === 'object') {
    const transformed: any = {};
    for (const key in obj) {
      transformed[key] = transformTimestamps(obj[key]);
    }
    return transformed;
  }

  return obj;
};
