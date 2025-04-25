import { useState, useEffect } from "react";
import { booklistRequest, booklistResponse } from "../../model/booklist/booklistModels";
import { useCookies } from "react-cookie";
import { booklistAPI } from "../../services/booklist/booklistService";
import { BooklistItem } from "./booklistItem";
import { Link } from "react-router-dom";
import "./booklist.scss"

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
                token: `Bearer ${cookies.authToken}`,
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
        } finally {
            setIsLoading(false);
        }
    }
    getBooklist();
    },[offset, cookies.authToken]);

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

  return (
    <div className="booklistBox">
        <div className="postReviewButton">
            <Link to="/new">
                <button>ReviewPost</button>
            </Link>
        </div>
      {isLoading && (
        <div className="loadingMessage">
          <p>Now Loading</p>
        </div>
      )}

      {error && (
        <div className="errorMessage" role="alert">
          <p>Error</p>
          <p>{error}</p>
        </div>
      )}

      <div className="booklistItem">
        {!isLoading && !error && booklist && (
            <ul>
            {booklist.length > 0 ? (
                <BooklistItem response={booklist} offset={offset} />
                ) : (
                <li>
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
