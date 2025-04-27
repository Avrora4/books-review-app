import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './bookDetail.scss';
import { GetBookDetailRequest, GetBookDetailResponse } from '../../model/booklist/booklistModels';
import { getBookDetailAPI } from "../../services/booklist/booklistService"

export const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [bookDetail, setBookDetail] = useState<GetBookDetailResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [cookies] = useCookies();

    const authToken = cookies.authToken;

    useEffect(() => {
        if (!id) {
            setErrorMessage('Book ID is missing.');
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setBookDetail(null);
        setErrorMessage(null);

        const getBookDetail = async () => {
            console.log(`Loading the content of the book detail: ${id}`)
            const getBookDetailRequestData: GetBookDetailRequest = { id: id };
            const bookDetailResponse = await getBookDetailAPI(authToken, getBookDetailRequestData);
            if (bookDetailResponse && typeof bookDetailResponse && "id" in bookDetailResponse) {
                setBookDetail(bookDetailResponse);
            } else {
                setErrorMessage(`Error detail: ${bookDetailResponse}`);
            }

            setIsLoading(false);
        };

        getBookDetail();
    }, [id, authToken]);

    if(isLoading) {
        return <div className='book-detail-loading'>Loading book details...</div>
    }

    if(errorMessage) {
        return <div className='book-detail-error'>Error loading book details: {errorMessage}</div>
    }

    if (!bookDetail) {
        // ローディング中、エラー発生中ではないが、book データがない場合 (通常は発生しないはずだが念のため)
       return <div className="book-detail-empty">Book details not found.</div>;
   }

   return (
        <div className='book-detail-container'>
            <h1 className='book-detail-title'>{bookDetail.title}</h1>
            <p className='book-detail-label'>URL:</p>
            <p><a href={bookDetail.url} target='_blank' rel='noopener noreferrer' className='book-detail-url'>{bookDetail.url}</a></p>
            <p className='book-detail-label'>Reviewer:</p>
            <p className='book-detail-reviewer'>{bookDetail.reviewer}</p>
            <p className='book-detail-label'>Review Detail:</p>
            <p className='book-detail-detail'>{bookDetail.detail}</p>
            <p className='book-detail-label'>Review:</p>
            <p className='book-detail-review'>{bookDetail.review}</p>
            <p className='book-detail-label'>Author:</p>
            <p className='book-detail-author'>{bookDetail.isMine ? 'Author' : 'Not author'}</p>
        </div>
    );
}
