import { ChangeEvent } from "react";
import "./booklistItem.scss";
import { Link } from "react-router-dom";
import { BooklistResponse, BooklistSuccessResponse } from "../../model/booklist/booklistModels";

interface BooklistItemProps {
    response: BooklistResponse;
    offset: number;
    selectedBookIds: string[];
    onSelectChange: (bookId: string, isSelected: boolean) => void;
}

export const BooklistItem = ({ response, offset, selectedBookIds, onSelectChange } : BooklistItemProps) => {
    if (!response || response.length === 0) {
        return (
            <li className="booklist__empty-message">
                No book reviews found...
            </li>
        );
    }

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>) => {
        const bookId = e.target.value;
        const isChecked = e.target.checked;
        if (bookId) {
            onSelectChange(bookId, isChecked);
        } else {
            console.warn("BooklistItem: Missing book ID for checkbox.");
        }
    }

    return (
        <ul className="book-item-list">
            {response.map((bookItem: BooklistSuccessResponse, index: number) => (
                <li key={bookItem.id || index} className="book-item-list__item">
                    {bookItem.isMine ? (
                        <div className="book-item-list__link-exist">
                            <input type='checkbox' className="book-item-list-checkbox" checked={selectedBookIds.includes(bookItem.id)} onChange={handleCheckboxChange} value={bookItem.id} />
                            <Link to={`/detail/${bookItem.id}`} className="book-item-list__link-wrapper">
                                <h2 className="book-item-list__title">
                                    No.{offset + index + 1} TITLE: {bookItem.title}
                                </h2>
                                <p className="book-item-list__reviewer">
                                    Reviewer: {bookItem.reviewer}
                                </p>
                                <p className="book-item-list__detail-label">Review Detail:</p>
                                <p className="book-item-list__detail-text">{bookItem.detail}</p>
                            </Link>
                        </div>
                    ) : (
                    <div className="book-item-list__no-link">
                        <h2 className="book-item-list__title">
                            No.{offset + index + 1} TITLE: {bookItem.title}
                        </h2>
                        <p className="book-item-list__reviewer">
                            Reviewer: {bookItem.reviewer}
                        </p>
                        <p className="book-item-list__detail-label">Review Detail:</p>
                        <p className="book-item-list__detail-text">{bookItem.detail}</p>
                    </div>
                    )}
                    { bookItem.url && typeof bookItem.url === 'string' && (
                        <p className="booklist__url-container">
                            <a href={bookItem.url} target="_blank" rel="noopener noreferrer">
                                URL: {bookItem.url}
                            </a>
                        </p>
                    )}
                </li>
            ))}
        </ul>
    );
};