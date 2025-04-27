import { useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { RootState } from "../../store";
import { getLoginInfoAPI, iconUploadAPI, updateUserInfoAPI } from "../../services/user/userService";
import { getLoginInfoRequest, updateUserInfoRequest } from "../../model/user/profileEditModels";
import { iconUploadRequest } from "../../model/user/signupModels";
import "./profileEdit.scss";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Compressor from "compressorjs";
import { SignIn } from "../../authSlice";

export const ProfileEdit = () => {
    const auth = useSelector((state: RootState) => state.auth.isSignIn);
    const userInfo = useSelector((state: RootState) => state.auth.user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cookies] = useCookies(['authToken']);
    const [name, setName] = useState<string>('');
    const [, setIconUrl] = useState<string | null>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required('Please input your name'),
        icon: Yup.mixed().nullable(),
    })

    useEffect(() => {
        if (!auth) {
            navigate("/login");
            return;
        }

        if (userInfo) {
            setName(userInfo.name);
            setIconUrl(null);
            setIsLoading(false);
            return;
        }

        const authToken = cookies.authToken;
        if (!authToken) {
            setErrorMessage("Not found the authentication token");
            setIsLoading(false);
            return;
        }

        const getUserData = async () => {
            setIsLoading(true);
            setErrorMessage(null);
            setUpdateSuccess(false);

            try {
                const loginInfoRequestData: getLoginInfoRequest = {
                    token: `Bearer ${authToken}`
                };
                const userInfoResponse = await getLoginInfoAPI(loginInfoRequestData);

                if (userInfoResponse && typeof userInfoResponse === "object" && "name" in userInfoResponse && userInfoResponse.name) {
                    setName(userInfoResponse.name);
                    if ("iconUrl" in userInfoResponse && userInfoResponse.iconUrl) {
                        setIconUrl(userInfoResponse.iconUrl);
                    }
                } else {
                    setErrorMessage("Fail to get user information");
                }
            } catch (err) {
                setErrorMessage("Error occered to get user data");
                console.error("Error fetching user data for profile edit:", err);
            } finally {
                setIsLoading(false);
            }
        };

        getUserData();

    }, [auth, cookies.authToken, navigate, userInfo]);

    const handleIconChange = (setFieldValue: (field: string, value: File | null, shouldValidate?: boolean) => void, event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.currentTarget.files?.[0];
        if (file) {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    setFieldValue('icon',result as File);
                },
                error(err) {
                    console.error(err);
                    setFieldValue('icon', null);
                    setErrorMessage('Faild to resize the icon');
                },
            });
        }
    };

    const editContentsUpdate = async ( updateNameValue: updateUserInfoRequest, updateIconValue: iconUploadRequest) => {
        if (!auth) {
            setErrorMessage("Not Authentication");
            return;
        }

        const authToken = cookies.authToken;
         if (!authToken) {
            setErrorMessage("Not found authentication token");
            return;
        }

        setIsUpdating(true);
        setUpdateSuccess(false);
        setErrorMessage(null);

        try {
            const updateRequestData: updateUserInfoRequest = {
                token: `Bearer ${authToken}`,
                name: updateNameValue.name,
            };

            const updatedUserInfo = await updateUserInfoAPI(updateRequestData);

            let isUploadIconSuccess = true;
            if (updateIconValue.icon) {
                const uploadIconRequestData: iconUploadRequest = {
                    token: updateIconValue.token,
                    icon: updateIconValue.icon
                };
                uploadIconRequestData.icon = updateIconValue.icon;
                const uploadIconInfo = await iconUploadAPI(uploadIconRequestData);
                isUploadIconSuccess = uploadIconInfo && typeof uploadIconInfo === "object" && "iconUrl" in uploadIconInfo;
                if (!isUploadIconSuccess) {
                    console.error("Icon upload failed:", uploadIconInfo);
                    setErrorMessage("Failed to upload icon data");
                }
            }

            if (updatedUserInfo && typeof updatedUserInfo === "object" && "name" in updatedUserInfo && isUploadIconSuccess) {
                const userInfoLatest = await getLoginInfoAPI({ token: `Bearer ${authToken}`});

                if (userInfoLatest && typeof userInfoLatest === "object" && "name" in userInfoLatest) {
                    dispatch(SignIn({ name: userInfoLatest.name || 'Unknown', iconUrl: userInfoLatest.iconUrl || null }));
                     setUpdateSuccess(true);
                     setErrorMessage(null);
               } else {
                    setUpdateSuccess(true);
                    setErrorMessage("Profile update successful, but failed to refetch latest user info after update.");
               }
               navigate('/home');
           } else {
                setErrorMessage("Fail to update profile");
                setUpdateSuccess(false);
           }

            navigate('/home');

        } catch (err) {
            setErrorMessage(`Fail to update:  ${err}`);
            console.error("Error updating user profile:", err);
        } finally {
            setIsUpdating(false);
        }
    };
    if (isLoading) {
        return (
            <div className="profile-edit-container">
                <p>Now loading user profile data</p>
            </div>
        );
    }

     if (errorMessage && !updateSuccess) {
         return (
             <div className="profile-edit-container error-message">
                 <p>Error detail: {errorMessage}</p>
             </div>
         );
     }


     return (
        <div className="profile-edit-container">
            <h2>Profile edit</h2>
            <Formik
                initialValues={{ name: name, icon: null}} // ロードした初期データをセット
                validationSchema={validationSchema}
                onSubmit={(values, {setSubmitting}) => {
                    const userNameValue: updateUserInfoRequest = {
                        token: cookies.authToken,
                        name: values.name,
                    }
                    const userIconValue: iconUploadRequest = {
                        token: cookies.authToken,
                        icon: values.icon,
                    }
                    editContentsUpdate(userNameValue, userIconValue);
                    setSubmitting(false);
                }}
            >
                {({ setFieldValue }) => (
                    <Form>
                        <div className="form-group">
                            <label htmlFor="name">Name: </label>
                            <Field type="text" name="name" />
                            <ErrorMessage name="name" component="p" className="error-message" />
                        </div>

                        <div className="form-group">
                            <label>Icon</label>
                            <input type="file" onChange={(event) => handleIconChange(setFieldValue, event)} />
                            <ErrorMessage name="name" component="p" className="error-message" />
                        </div>
                        {isUpdating && <p className="status-message">Now Updating...</p>}
                        {errorMessage && <p className="error-message">Error: {errorMessage}</p>}

                        <button type="submit" disabled={isLoading}>
                            {isUpdating ? 'Updating...' : 'Update'}
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
};