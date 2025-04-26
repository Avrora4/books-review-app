import "./booklistItem.scss";
import { Link } from "react-router-dom";
import { booklistResponse } from "../../model/booklist/booklistModels";

interface BooklistItemProps {
    response: booklistResponse;
    offset: number;
}

export const BooklistItem = ({ response, offset } : BooklistItemProps) => {
    if (!response || response.length === 0) {
        return null;
    }

    return (
        <ul className="book-item-list">
            {response.map((bookItem, index) => (
                <li key={bookItem.id || index} className="book-item-list__item">
                    <Link to={`/detail/${bookItem.id}`} className="book-item-list__link-wrapper">
                        <h2 className="book-item-list__title">
                            No.{offset + index + 1} TITLE: {bookItem.title}
                        </h2>
                        <Link to={bookItem.url} className="book-item-list__url">
                            URL: {bookItem.url}
                        </Link>
                        <p className="book-item-list__reviewer">
                            Reviewer: {bookItem.reviewer}
                        </p>
                        <p className="book-item-list__detail-label">Review Detail:</p>
                        <p className="book-item-list__detail-text">{bookItem.detail}</p>
                    </Link>
                </li>
            ))}
        </ul>
    );
};