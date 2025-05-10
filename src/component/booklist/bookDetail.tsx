import { useState, useEffect, ChangeEvent } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import './bookDetail.scss';
import { EditBookDetailRequest, GetBookDetailRequest, GetBookDetailResponse, DeleteBookReviewRequest } from '../../model/booklist/booklistModels';
import { getBookDetailAPI, updateBookDetailAPI, deleteBookReviewAPI } from "../../services/booklist/booklistService"

export const BookDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [bookDetail, setBookDetail] = useState<GetBookDetailResponse | null>(null);
    const [bookDetailEdit, setBookDetailEdit] = useState<EditBookDetailRequest | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [deleteError, setDeleteError] = useState<string | null>(null);
    const [cookies] = useCookies();
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [isDeleting, setIsDeleting] = useState<boolean>(false);
    const navigate = useNavigate();
    const location = useLocation();

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
               setBookDetailEdit({
                   title: bookDetailResponse.title,
                   url: bookDetailResponse.url,
                   detail: bookDetailResponse.detail,
                   review: bookDetailResponse.review
               });
            } else {
                setErrorMessage(`Error detail: ${bookDetailResponse}`);
            }

            setIsLoading(false);
        };

        getBookDetail();
    }, [id, authToken, location.pathname]);

    const handleEditClick = () => {
        setIsEditing(true);
        if(id) {
            navigate(`/edit/${id}`);
        } else {
            console.error("Book ID is missing, cannot navigate to edit URL.");
        }
    }
    
    const handleCancelClick = () => {
        setIsEditing(false);
        setIsUpdating(false);
        if(id) {
            navigate(`/detail/${id}`);
        } else {
            console.error("Book ID is missing, cannot navigate to edit URL.");
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setBookDetailEdit((prevState: EditBookDetailRequest | null) => {
            if (!prevState) {
                 const initialEditState: EditBookDetailRequest = {
                     title: '',
                     url: '',
                     detail: '',
                     review: '',
                 };
                 return {
                     ...initialEditState,
                     [name]: value
                 };
            }
            return {
                ...prevState,
                [name]: value
            };
        });
    }

    const handleDeleteClick = async () => {
        if (!window.confirm("Delete this books reviews ??")) {
            return;
        }

        if(!id) {
            setDeleteError('Book ID is missing, cannot delete review');
            return;
        }
        setIsDeleting(true);
        setDeleteError(null);

        try {
            const deleteBookReviewRequestData: DeleteBookReviewRequest = { id: id };
        
            const response = await deleteBookReviewAPI(cookies.authToken, deleteBookReviewRequestData);
    
            if (response && typeof response === 'object' && "message" in response) {
                console.log(`Result: ${response.message}`);
                } else {
                    setDeleteError(`Failed to delete book review. Response: ${JSON.stringify(response)}`);
                }
        } catch(error) {
            setDeleteError(`Failed to delete book review. Error: ${error}`);
        } finally {
            setIsDeleting(false);
            navigate('/home');
        }
    }

    const handleUpdateClick = () => {
        if (!bookDetailEdit || !id) {
            setErrorMessage('No data to save or Book ID is missing.');
            return;
        }

        setIsUpdating(true);
        setErrorMessage(null);

        try {
            const updateRequestData: EditBookDetailRequest = {
                title: bookDetailEdit.title,
                url: bookDetailEdit.url,
                detail: bookDetailEdit.detail,
                review: bookDetailEdit.review
            };

            const updatedBookDetailResponse = updateBookDetailAPI(authToken, id, updateRequestData);

            if (updatedBookDetailResponse && typeof updatedBookDetailResponse && "id" in updatedBookDetailResponse) {
                console.log(`Update detail: ${updatedBookDetailResponse}`);
            } else {
                setErrorMessage(`Error detail: ${updatedBookDetailResponse}`);
            }
        } catch(e) {
            setErrorMessage(`Error detail: ${e}`);
        } finally {
            setIsEditing(false);
            setIsUpdating(false);
            navigate(`/book/{id}`);
        }
    };

    if(isLoading) {
        return <div className='book-detail-loading'>Loading book details...</div>
    }

    if(isUpdating) { 
        return <div className='book-detail-updating'>Updating book detail...</div>
    }

    if(errorMessage) {
        return <div className='book-detail-error'>Error loading book details: {errorMessage}</div>
    }

    if (!bookDetail) {
       return <div className="book-detail-empty">Book details not found.</div>
    }
    
    if (isDeleting) {
        return <div className='book-detail-deleting'>Updating book deleting...</div>
    }

   
    return (
        <div>
        {deleteError && <div className='book-detail-delete-error'>{deleteError}</div>}
        
        {isEditing ? (
        <div className='book-detail-edit'>
            <div className='book-detail-title-edit'>
                <label htmlFor="title" className='book-detail-label-edit'>Title: </label>
                <input className='book-detail-title-edit-input' type='text' id='title' name='title' value={bookDetailEdit?.title || ''} onChange={handleInputChange} />
            </div>
            <div className='book-detail-url-edit'>
                <label htmlFor="url" className='book-detail-label-edit'>Url: </label>
                <input className='book-detail-url-edit-input' type='text' id='url' name='url' value={bookDetailEdit?.url || ''} onChange={handleInputChange} />
            </div>
            <div className='book-detail-detail-edit'>
                <label htmlFor="detail" className='book-detail-label-edit'>Detail: </label>
                <input className='book-detail-detail-edit-input' type='text' id='detail' name='detail' value={bookDetailEdit?.detail || ''} onChange={handleInputChange} />
            </div>
            <div className='book-detail-review-edit'>
                <label htmlFor="review" className='book-detail-label-edit'>Review: </label>
                <textarea className='book-detail-review-edit-input' id='review' name='review' value={bookDetailEdit?.review || ''} onChange={handleInputChange} />
            </div>
            <div>
                <button onClick={handleUpdateClick} className='book-detail-update-button'>Update</button>
            </div>
            <div>
                <button onClick={handleCancelClick} className='book-detail-cancel-button'>Cancel</button>
            </div>
        </div>
        ) : (
        <>
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
            <div>
                <button onClick={handleEditClick} className='book-detail-edit-button' disabled={isEditing}>Edit</button>
            </div>
            <div>
                <button onClick={handleDeleteClick} className='book-detail-edit-button' disabled={isDeleting}>Delete</button>
            </div>
        </>
    )}
        </div>

    );
}
