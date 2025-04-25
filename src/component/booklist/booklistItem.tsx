import "./booklistItem.scss";
import { Link } from "react-router-dom";
import "../../model/booklist/booklistModels"
import { booklistResponse } from "../../model/booklist/booklistModels";

interface BooklistItemProps {
    response: booklistResponse;
    offset: number
}

export const BooklistItem: React.FC<BooklistItemProps> = ({response, offset}) => {
    console.log(response);
    return (
        <ul className="booklistItem">
            {response.map((bookItem,index) => (
                <li key={index}>
                    <h2>No.{offset + index + 1} TITLE: {bookItem.title}</h2>
                    <br/>
                    <Link to={bookItem.url}>URL: {bookItem.url}</Link>
                    <br/>
                    <p>Reviewer: {bookItem.reviewer}</p>
                    <br/>
                    <p>Review Detail:</p>
                    <br/>
                    <p>{bookItem.detail}</p>
                    <br/>
                </li>
            ))}
        </ul>
    );
};