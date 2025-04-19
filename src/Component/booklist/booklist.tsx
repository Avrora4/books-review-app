// src/components/BookList.tsx

import { useState, useEffect } from "react";
import { booklistRequest, booklistResponse } from "../../model/booklist/booklistModels";
import { useCookies } from "react-cookie";
import { booklistAPI } from "../../services/booklist/booklistService";
import { BooklistItem } from "./booklistItem";

// Define booklist componenst
export const BookList = () => {
    // Difine states 
    const [booklist, setBooklist] = useState<booklistResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [cookies] = useCookies();

    // Get the data
    useEffect(() => {
        const getBooklist = async () => {
            setIsLoading(true);
            setError(null);

        // Call API
        try {
            const booklistRequestData: booklistRequest = {
                token: `Bearer ${cookies.token}`,
                offset: String(offset),
            }
            const response = await booklistAPI(booklistRequestData);
            if (Array.isArray(response)) {
                setBooklist(response);
            } else if (typeof response === 'object' && 'ErrorCode' in response) {
                setError(`Error detail: ${response}`);
            } else {
                setError("Unknown Error");
            }
        } catch (err) {
            setError(`Error: ${err}`);
        }
    }
    getBooklist();
    },[offset, cookies.token]);

    const nextOffset = async() => {
        try {
        setOffset(offset+10);
        } catch (err) {
            setError(`Error: ${err}`);
        };
    };

    const previousOffset = async() => {
        try {
            setOffset(offset-10);
        } catch (err) {
            setError(`Error: ${err}`);
        }
    }


  // --- レンダリング ---
  return (
    // コンポーネントのルート要素 (クラス名はお好みで)
    <div className="book-list-wrapper mt-6">

      {/* ローディング表示 */}
      {isLoading && (
        <div className="flex justify-center items-center py-8">
          {/* 簡単なテキスト表示、またはスピナーコンポーネントなど */}
          <p className="text-base text-gray-500">レビューを読み込んでいます...</p>
        </div>
      )}

      {/* エラー表示 */}
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
          <p className="font-bold">エラー</p>
          <p>{error}</p>
        </div>
      )}
      <div className="booklistItem">
        {/* データ表示 (ローディング中でなく、エラーもない場合) */}
        {!isLoading && !error && booklist && (
            <ul className="space-y-5"> {/* リストアイテム間のスペース */}
            {booklist.length > 0 ? (
                <BooklistItem response={booklist} offset={offset} />
                ) : (
                // レビューが存在しない場合
                <li className="text-center text-gray-500 py-6">
                    No book review.
                </li>
            )}
            </ul>
        )}
        <div className="PreviousButton">
            <button onClick={previousOffset}>Previous</button>
        </div>
        <div className='NextButton'>
            <button onClick={nextOffset}>Next</button>
        </div>
        </div>
    </div>
  );
};
