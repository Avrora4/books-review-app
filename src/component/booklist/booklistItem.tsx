import "./booklistItem.scss";
import { Link } from "react-router-dom";
import { BooklistResponse, BooklistSuccessResponse } from "../../model/booklist/booklistModels";

interface BooklistItemProps {
    response: BooklistResponse;
    offset: number;
}

export const BooklistItem = ({ response, offset } : BooklistItemProps) => {
    if (!response || response.length === 0) {
        return null;
    }

    return (
        <ul className="book-item-list">
            {response.map((bookItem: BooklistSuccessResponse, index: number) => (
                <li key={bookItem.id || index} className="book-item-list__item">
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