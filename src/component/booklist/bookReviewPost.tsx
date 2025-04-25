import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import { useCookies } from "react-cookie";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { bookPostRequest } from "../../model/booklist/booklistModels"; // 新しいモデルをインポート
import { bookReviewPostAPI } from "../../services/booklist/booklistService";
import "./BookReviewPost.scss";


export const BookReviewPost = () => {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const [cookies] = useCookies(['authToken']);
    const auth = useSelector((state: RootState) => state.auth.isSignIn);
    useEffect(() => {
        if (!auth || !cookies.authToken) {
            console.warn("Not authenticated or token missing. Redirecting to login.");
            navigate("/login");
        }
    }, [auth, navigate, cookies.authToken]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required('Please input book title'),
        url: Yup.string().required('Please input book url').url('Please input avilable url'),
        detail: Yup.string().required('Please input book detail'),
        review: Yup.string().required('Please input book review'),
    });

    const onSubmit = async (values: bookPostRequest, { setSubmitting}: FormikHelpers<bookPostRequest>) => {
        setErrorMessage(null);
        setSubmitting(true);

        const authToken = cookies.authToken;
        if (!authToken) {
             setErrorMessage("Not found authentication token");
             setSubmitting(false);
             return;
        }
        const bookPostData: bookPostRequest = {
            title: values.title,
            url: values.url,
            detail: values.detail,
            review: values.review,
        };

        try {
            const response = await bookReviewPostAPI(authToken,bookPostData);
            console.log(response);
            navigate('/home');
        } catch (err) {
            console.error("Error: ", err);
            setErrorMessage(`Fail to post book review: ${err}`);
        } finally {
            setSubmitting(false);
        }
    };


    return (
        <div className="BookReviewForm">
            <h1>BookReviewPost</h1>
            {errorMessage && <p className="api-error-message">{errorMessage}</p>}
            <Formik
                initialValues={{ title: '', url: '', detail: '', review: '' }}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
            >
                {({ isSubmitting }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="title">Book's title</label>
                            <Field type="text" id="title" name="title" disabled={isSubmitting} />
                            <ErrorMessage name="title" component="p" className="error-message" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="url">Book's URL</label>
                            <Field type="url" id="url" name="url" disabled={isSubmitting} />
                            <ErrorMessage name="url" component="p" className="error-message" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="detail">Detail</label>
                            <Field as="textarea" id="detail" name="detail" disabled={isSubmitting} rows={5} />
                            <ErrorMessage name="detail" component="p" className="error-message" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="review">Review</label>
                            <Field as="textarea" id="review" name="review" disabled={isSubmitting} rows={5} />
                            <ErrorMessage name="review" component="p" className="error-message" />
                        </div>
                        <button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? 'Now Posting ...' : 'Post'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};