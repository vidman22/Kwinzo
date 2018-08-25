import { AUTH_TOKEN } from '../constants'; 
import * as actionTypes from './actionTypes';

const checkAuthTimeout = (expirationTime) => {
    return dispatch => {
        setTimeout(() => {
            dispatch(logout());
        }, expirationTime * 1000);
    };
};

export const authSuccess = (email, name, picture, userID, token, expiresIn) => {
	const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    localStorage.setItem(AUTH_TOKEN, token);
    localStorage.setItem('expirationDate', expirationDate);
    localStorage.setItem('userID', userID);
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    localStorage.setItem('picture', picture);
    return {
        type: actionTypes.AUTH_SUCCESS,
        email,
        name,
        picture,
        userID
    };
};

export const autoLogin = ( email, name, picture, userID, token ) => {
	return {
        type: actionTypes.AUTH_SUCCESS,
       	email,
       	name,
       	picture,
       	token,
       	userID
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
					const userID = localStorage.getItem('userID');
					const picture = localStorage.getItem('picture');
					const email = localStorage.getItem('email');
					const name = localStorage.getItem('name');

					dispatch(autoLogin(email, name, picture, userID, token ));
					dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000 ));
				}
			}
		}
}

export const logout = () => {
	localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userID');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('picture');
    
    return {
    	type: actionTypes.LOGOUT
    };
}

