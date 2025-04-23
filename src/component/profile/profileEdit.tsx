import { useEffect, useState, FormEvent } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { RootState } from "../../store";
import { getLoginInfoAPI, updateUserInfoAPI } from "../../services/user/userService";
import { getLoginInfoRequest, updateUserInfoRequest } from "../../model/user/profileEditModels";
import "./profileEdit.scss";

export const ProfileEdit = () => {
    const auth = useSelector((state: RootState) => state.auth.isSignIn);
    const navigate = useNavigate();
    const [cookies] = useCookies(['authToken']);
    const [name, setName] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isUpdating, setIsUpdating] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

    useEffect(() => {
        if (!auth) {
            navigate("/login");
            return;
        }

        const authToken = cookies.authToken;
        if (!authToken) {
            setError("認証トークンが見つかりません。");
            setIsLoading(false);
            return;
        }

        const fetchUserData = async () => {
            setIsLoading(true);
            setError(null);
            setUpdateSuccess(false);

            try {
                const loginInfoRequestData: getLoginInfoRequest = {
                    token: `Bearer ${authToken}`
                };
                const userInfoResponse = await getLoginInfoAPI(loginInfoRequestData);

                if (userInfoResponse && typeof userInfoResponse === "object" && "name" in userInfoResponse && userInfoResponse.name) {
                    setName(userInfoResponse.name);
                } else {
                    setError("Fail to get user information");
                }
            } catch (err) {
                setError("Error occered to get user data");
                console.error("Error fetching user data for profile edit:", err);
            } finally {
                setIsLoading(false); // 取得完了
            }
        };

        fetchUserData();

    }, [auth, cookies.authToken, navigate]);

    // フォーム送信時のハンドラ
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        // 認証状態を再確認
        if (!auth) {
            setError("Not Authentication");
            return;
        }

        const authToken = cookies.authToken;
         if (!authToken) {
            setError("Not found authentication token");
            return;
        }

        setIsUpdating(true);
        setUpdateSuccess(false);
        setError(null);

        try {
            const updateRequestData: updateUserInfoRequest = {
                token: `Bearer ${authToken}`,
                name: name,
            };

            const updatedUserInfo = await updateUserInfoAPI(updateRequestData);

            if (updatedUserInfo) {
                 setUpdateSuccess(true);
                 navigate('/home');
            } else {
                 setError("Fail to update: No data in response");
            }

        } catch (err) {
            setError(`Fail to update:  ${err}`);
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

     if (error && !updateSuccess) {
         return (
             <div className="profile-edit-container error-message">
                 <p>エラー: {error}</p>
             </div>
         );
     }


    return (
        <div className="profile-edit-container">
            <h2>Prifile edit</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="name">Name: </label>
                    <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isUpdating} />
                </div>
                {isUpdating && <p className="status-message">Now Updating</p>}
                {updateSuccess && <p className="success-message">Update successfully</p>}
                {error && <p className="error-message">Error: {error}</p>}

                <button type="submit" disabled={isLoading || isUpdating}>
                    {isUpdating ? '更新中...' : 'プロフィールを更新'}
                </button>
            </form>
        </div>
    );
};