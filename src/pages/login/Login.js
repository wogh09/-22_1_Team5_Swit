import * as S from './Login_Style';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { add_loginUser_info } from '../../redux/action/action.js';
import { useNavigate } from 'react-router-dom';

import { useSelector } from 'react-redux';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [userNickname, setUserNickname] = useState('');

  const data = useSelector(state => state.userinfo);
  console.log(data);

  const changeUserIdInput = e => {
    const { value } = e.target;
    setUserEmail(value);
  };
  const changeUserNicknameInput = e => {
    const { value } = e.target;
    setUserNickname(value);
  };

  const saveUserDataInStore = () => {
    const userInputData = {
      userEmail: userEmail,
      nickname: userNickname,
    };

    dispatch(add_loginUser_info(userInputData));
    setUserEmail('');
    navigate('/main');
  };

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      if (userEmail && userNickname === true) {
        setUserEmail();
        setUserNickname();
      }
    }
  };

  return (
    <>
      <S.Logo />
      <S.Login>
        <S.LoginWrap>
          <S.LoginTitle>"Swit Simple, All In One"</S.LoginTitle>
          <S.ProfileContainer>
            <S.RoundProfile>
              <S.ProfilePreviewImage src="/" />
            </S.RoundProfile>
            <S.UploadBtn>
              <S.Test />
            </S.UploadBtn>
            <S.ProfileUpload />
          </S.ProfileContainer>
          <S.LoginForm>
            <S.Label>아이디</S.Label>
            <S.UserIdInput
              onChange={changeUserIdInput}
              value={userEmail}
              onKeyDown={handleKeyPress}
            />
            <S.Label>닉네임</S.Label>
            <S.UserNicknameInput
              onChange={changeUserNicknameInput}
              value={userNickname}
              onKeyDown={handleKeyPress}
            />
            <S.FormSubmit onClick={saveUserDataInStore}>Start Now</S.FormSubmit>
          </S.LoginForm>
        </S.LoginWrap>
      </S.Login>
    </>
  );
}
