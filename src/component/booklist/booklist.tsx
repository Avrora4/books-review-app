import { useState, useEffect, useCallback } from "react";
import { BooklistRequest, BooklistResponse, DeleteBookReviewRequest } from "../../model/booklist/booklistModels";
import { useCookies } from "react-cookie";
import { booklistAPI, deleteBookReviewAPI } from "../../services/booklist/booklistService";
import { BooklistItem } from "./booklistItem";
import { Link, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import "./booklist.scss";

export const BookList = () => {
    const [booklist, setBooklist] = useState<BooklistResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const [offset, setOffset] = useState<number>(0);
    const [selectedBookIds, setSelectedBookIds] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>();
    const [cookies] = useCookies(['authToken']);
    const [searchParams, setSearchParams] = useSearchParams();
    const auth = useSelector((state: RootState) => state.auth.isSignIn);

    // Get the data
    
    const getBooklist = useCallback(async (currentOffset: number, token: string | null, isAuthenticated: boolean) => {
        setIsLoading(true);
        setError(null);
        setDeleteError(null);
        setOffset(currentOffset);

        // check Auth
        if (!token || !isAuthenticated) {
            console.warn("BookList - Skipping API call: Token not available or not signed in via Redux.");
            setError("Authentication required to view booklist.");
            setIsLoading(false);
            setOffset(currentOffset);
            return;
        }

        // Call API
        try {
            const booklistRequestData: BooklistRequest = {
                token: `Bearer ${token}`,
                offset: String(currentOffset),
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
    },[]);
    
    useEffect(() => {
        const currentOffset = searchParams.get('offset');
        const offsetValue = currentOffset ? parseInt(currentOffset, 10) : 0;
        getBooklist(offsetValue, cookies.authToken, auth);
    }, [searchParams, cookies.authToken, auth, getBooklist]);

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

    const handleSelectChange = useCallback((bookId: string, isSelected: boolean) => {
        setSelectedBookIds(prevSelectedIds => {
            if (isSelected) {
                if (!prevSelectedIds.includes(bookId)) {
                    return [...prevSelectedIds, bookId];
                }
            } else {
                return prevSelectedIds.filter(id => id !== bookId);
            }
            return prevSelectedIds;
        });
    },[]);

    const handleDeleteClick = async () => {
        if (selectedBookIds.length === 0) {
            setError("Please choose delete books");
            setDeleteError(null);
            return (
                <div className="booklist__error" role="alert">
                    <p>Error delete book reviews: Unknown Error</p>
                    <button onClick={homeReturnHandler}>Home</button>
                </div>
                )
        }

        if (!window.confirm(`Delete ${selectedBookIds.length} books reviews ??`)) {
            return;
        }

        setIsDeleting(true);
        setError(null);

        const deletionPromises = selectedBookIds.map(id=> {
            const deleteBookReviewRequestData: DeleteBookReviewRequest = {
                id: id
            };
            return deleteBookReviewAPI(cookies.authToken, deleteBookReviewRequestData);
        });
        const results = await Promise.allSettled(deletionPromises);

        const successfulDeletions: string[] = [];
        const failedDeletions: string[] = [];

        results.forEach((result,index) => {
            const id = selectedBookIds[index];
            if(result.status === 'fulfilled') {
                successfulDeletions.push(id);
            } else {
                failedDeletions.push(id);
            }
        })

        if (successfulDeletions.length > 0) {
            setSelectedBookIds([]);
            const currentOffset = searchParams.get('offset');
            const offsetValue = currentOffset ? parseInt(currentOffset, 10) : 0;
            getBooklist(offsetValue, cookies.authToken, auth);
            if (failedDeletions.length > 0) {
                setDeleteError(`Failed to delete book reviews: ${failedDeletions}\nError detail: ${error}`);
            } else {
                setDeleteError(null);
            }
        } else {
            if (failedDeletions.length > 0) {
                setDeleteError(`Failed to delete all ${selectedBookIds.length} reviews (IDs: ${failedDeletions}). Details:\n${error}`);
            } else {
                 setDeleteError("Deletion process finished with no successes and no specific failures reported.");
            }
            setSelectedBookIds([]);
        }
        console.log(successfulDeletions);
        setIsDeleting(false);
    }

    const homeReturnHandler = async() => {
        setOffset(offset);
        setDeleteError(null);
    }

    if(isLoading) {
        return (
            <div className="booklist__loading">
            <p>Now Loading...</p> 
        </div>
        );
    } 

    if (isDeleting) {
        return(
            <div className="booklist__deleting">
                <p>Deleting selected book review...</p>
            </div>
        )
    }
    
    if (error) {
        return (
            <div className="booklist__error" role="alert">
            <p>Error loading book reviews:</p>
            <p>{error}</p>
        </div>
        )
    }

    if (deleteError) {
        return (
        <div className="booklist__error" role="alert">
            <p>Error delete book reviews:</p>
            <p>{deleteError}</p>
            <button onClick={homeReturnHandler}>Home</button>
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
            <div className="bookreview__delete-action">
                <button className="booklist__delete-button" onClick={handleDeleteClick} disabled={selectedBookIds.length === 0 || isDeleting || isLoading}> DeleteReview</button>
            </div>
            <div className="booklist__items">
                {booklist && (
                    <ul className="booklist__list">
                        <BooklistItem response={booklist} offset={offset} selectedBookIds={selectedBookIds} onSelectChange={handleSelectChange} />
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