import { AUTH_TOKEN } from '../constants'; 
import * as actionTypes from './actionTypes';

const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const authSuccess = (id, email, username, picture, uuid, token, expiresIn) => {
	const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem(AUTH_TOKEN, token);
    localStorage.setItem('userID', id);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('uuid', uuid);
    localStorage.setItem('email', email);
    localStorage.setItem('username', username);
    localStorage.setItem('picture', picture);

    const userID = id;
    return {
        type: actionTypes.AUTH_SUCCESS,
        email,
        username,
        picture,
        userID,
        uuid
    };
};

export const autoLogin = ( email, username, picture, userID, token, uuid ) => {
	return {
        type: actionTypes.AUTH_SUCCESS,
       	email,
       	username,
       	picture,
        userID,
        uuid   
    }
}

// export const authFail = (error) => {
//     return {
//         type: actionTypes.AUTH_FAIL,
//         error: error
//     };
// };

export const authCheckState = () => {
	return dispatch => {
			const token = localStorage.getItem(AUTH_TOKEN);
			if (!token) {
				dispatch(logout())
			} else {
				const expirationDate = new Date(localStorage.getItem('expirationDate'));
				if (expirationDate <= new Date()) {
					dispatch(logout());
				} else {
                    //const id = localStorage.getItem('id');
					const userID = parseInt(localStorage.getItem('userID'), 10);
					const picture = localStorage.getItem('picture');
					const email = localStorage.getItem('email');
                    const username = localStorage.getItem('username');
                    const uuid = localStorage.getItem('uuid');
					dispatch(autoLogin(email, username, picture, userID, token, uuid ));
					dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
				}
			}
		}
}

export const logout = () => {
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem('id');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('uuid');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('picture');
    
    return {
    	type: actionTypes.LOGOUT
    };
}

