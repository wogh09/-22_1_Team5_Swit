import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import * as S from './ChatRoom_Style';
import ChatContentsList from './ChatContentsList';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import {
  add_user_inputText,
  add_user_inputText_delete,
} from '../../redux/action/inputChatAction';
import { add_current_date } from '../../redux/action/dateNowAction';

export default function ChatRoom() {
  const dispatch = useDispatch();
  const scrollRef = useRef();
  const userdata = useSelector(state => state.login.userinfo);
  const chatDatex = useSelector(state => state);
  const userChat = useSelector(state => state.input.chat);
  const [userMessage, setUserMessage] = useState('');
  const [ChatContents, setChatContents] = useState();
  const [chatDate, setChatDate] = useState({
    year: '',
    month: '',
    day: '',
    hour: '',
    minutes: '',
    second: '',
  });
  const getClock = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    setChatDate({
      year: year,
      month: month,
      day: day,
      hour: hour,
      minutes: minutes,
      second: second,
    });
    console.log(
      `${chatDate.year}-${chatDate.month}-${chatDate.day} ${chatDate.hour}:${chatDate.minutes}:${chatDate.second}`
    );
    // console.log(
    //   '현재시간',
    //   `${year}-${month}-${day} ${hour}:${minutes}:${second}`
    // );
  };
  useEffect(() => {
    getClock();
  }, [ChatContents]);

  console.log('reducer', chatDatex);
  // console.log('userChat', userChat);
  // console.log('ChatContents', ChatContents);
  // console.log('userMessage', userMessage);

  const [Reply, setReply] = useState(false);

  function DeleteInput() {
    setReply(prev => !prev);
  }

  useEffect(() => {
    axios
      .get('/data/data.json')
      .then(res => {
        setChatContents(res.data);
      })
      .catch(error => setChatContents(error));
  }, []);

  const changeInputText = e => {
    const { value } = e.target;
    setUserMessage(value);
  };

  const changeUserInputTextDispatch = () => {
    const userInputData = {
      chatList: userMessage,
    };
    if (userMessage !== '') {
      dispatch(add_user_inputText(userInputData));
      setUserMessage('');
    }
  };

  const pressUserInputTextDispatch = e => {
    const userInputData = {
      chatList: userMessage,
    };

    if (e.key === 'Enter') {
      if (userMessage !== '') {
        dispatch(add_user_inputText(userInputData));
        dispatch(add_current_date(chatDate));
        setUserMessage('');
      }
    }
  };

  const removeUserMessage = e => {
    const id = Number(e.target.id);
    const index = userChat.map(x => x.id).indexOf(id);

    if (window.confirm(userChat[index].chatList.chatList.slice(0, 10))) {
      dispatch(add_user_inputText_delete(id));
    } else {
    }
  };

  return (
    <>
      <S.Container ref={scrollRef}>
        <S.LineWrapper>
          <S.Line />
          <S.DayText>Today</S.DayText>
          <S.Line />
        </S.LineWrapper>
        <div>
          {ChatContents?.map((contents, i) => {
            return (
              <ChatContentsList
                key={i}
                contents={contents}
                DeleteInput={DeleteInput}
              />
            );
          })}
        </div>
        {userChat.length >= 1 && (
          <S.UserMessageContainer>
            <S.UserImage src={userdata[1]} />
            <S.TextArea>
              <S.UserName>{userdata[0][1].nickname}</S.UserName>
              {userChat?.map((list, i) => {
                return (
                  <S.ContentsContainer key={i}>
                    <S.TypingText>{list.chatList.chatList}</S.TypingText>
                    <S.Reply onClick={DeleteInput} />
                    <S.Delete id={list.id} onClick={removeUserMessage} />
                  </S.ContentsContainer>
                );
              })}
            </S.TextArea>
          </S.UserMessageContainer>
        )}
      </S.Container>
      <S.MessageEditorContainer>
        {Reply ? (
          <S.ReplyContainer>
            <S.ReplyBox>
              <S.ReplyIconBox>
                <S.ReplyIcon />
              </S.ReplyIconBox>
              <S.TextBox>DATA 에게 답장</S.TextBox>
              <S.Textdetail>바보똥개 멍청이</S.Textdetail>
              <S.TextDate>2202.01.13</S.TextDate>
              <S.DeleteIcon onClick={DeleteInput} />
            </S.ReplyBox>
          </S.ReplyContainer>
        ) : null}

        <S.MessageEditorWrapper>
          <S.PlusIcon />
          <S.TextInput
            placeholder="Enter message"
            onChange={changeInputText}
            onKeyUp={pressUserInputTextDispatch}
            value={userMessage}
          />
          <div>
            <S.TextIcon />
            <S.AtSignIcon />
            <S.EmojiIcon />
            <S.EnterIcon onClick={changeUserInputTextDispatch} />
          </div>
        </S.MessageEditorWrapper>
      </S.MessageEditorContainer>
    </>
  );
}
