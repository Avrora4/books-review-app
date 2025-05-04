import { useState, useEffect } from "react";
import { BooklistRequest, BooklistResponse } from "../../model/booklist/booklistModels";
import { useCookies } from "react-cookie";
import { booklistAPI } from "../../services/booklist/booklistService";
import { BooklistItem } from "./booklistItem";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "./booklist.scss";

export const BookList = () => {
    const [booklist, setBooklist] = useState<BooklistResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [offset, setOffset] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [cookies] = useCookies(['authToken']);
    const [searchParams, setSearchParams] = useSearchParams();
    const auth = useSelector((state: RootState) => state.auth.isSignIn);

    // Get the data
    useEffect(() => {
        const getBooklist = async () => {
            setIsLoading(true);
            setError(null);
            const currentOffset = searchParams.get('offset');
            const offsetValue = currentOffset ? parseInt(currentOffset, 10) : 0;
            setOffset(offsetValue);

            // check Auth
            if (!cookies.authToken || !auth) {
                console.warn("BookList - Skipping API call: Token not available or not signed in via Redux.");
                setError("Authentication required to view booklist.");
                setIsLoading(false);
                setOffset(offsetValue);
                return;
            }

            // Call API
            try {
                const booklistRequestData: BooklistRequest = {
                    token: `Bearer ${cookies.authToken}`,
                    offset: String(offset),
                };
                const response = await booklistAPI(booklistRequestData);
                if (Array.isArray(response)) {
                    setBooklist(response);
                } else if (response && typeof response === 'object' && 'ErrorCode' in response) {
                    setError(`API Error: ${JSON.stringify(response)}`);
                } else {
                    setError("An unknown error occurred while fetching booklist.");
                }
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : String(err);
                setError(`Workspace Error: ${errorMessage}`);
            } finally {
                setIsLoading(false);
            }
        };
        getBooklist();
    }, [offset, searchParams, cookies.authToken, auth]);

    const nextOffset = () => {
        const nextOffset = offset + 10;
        setSearchParams({ offset: String(nextOffset) });
    };

    const previousOffset = () => {
        const previousOffset = offset - 10;
        setSearchParams({ offset: String(previousOffset) });
    };

    const isPreviousDisabled = offset <= 0;
    const isNextDisabled = !isLoading && booklist != null && booklist.length < 10;

    if(isLoading) {
        return (
            <div className="booklist__loading">
            <p>Now Loading...</p> 
        </div>
        );
    } 
    
    if (error) {
        return (
            <div className="booklist__error" role="alert">
            <p>Error loading book reviews:</p>
            <p>{error}</p>
        </div>
        )
    }

    if (booklist?.length === 0 ) {
        <li className="booklist__empty-message">
            No book reviews found.
        </li>
    }

    // error系は外に出したほうが良い

    return (
        // Block: booklist
        <div className="booklist">
            <div className="booklist__post-action">
                <Link to="/new">
                    {/* Element: post-button (Can be styled directly or use a generic button BEM class) */}
                    <button className="booklist__post-button">ReviewPost</button>
                </Link>
            </div>
            <div className="booklist__items">
                {booklist && (
                    <ul className="booklist__list">
                        <BooklistItem response={booklist} offset={offset} />
                    </ul>
                )}
            </div>

            {(booklist && booklist.length > 0 || offset > 0) && (
                 <div className="booklist__pagination">
                    {/* Element: prev-button */}
                    <button className="booklist__prev-button" onClick={previousOffset} disabled={isPreviousDisabled}>
                        Previous
                    </button>
                    <button className="booklist__next-button" onClick={nextOffset} disabled={isNextDisabled} >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};