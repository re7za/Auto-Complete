import './AutoComplete.css';

import React, { useEffect, useState, useRef } from 'react';
import parse from 'html-react-parser';

// Services
import fetchApi from '../../services/service';

// Misc
import { API_URL, TYPING_DONE_TIME } from './constants';
import { clearBoldTag, searchedBolder } from './helpers';
import { IFakeData, AutoCompleteProps } from './types';

function AutoComplete({ chosens, setChosens, multiple }: AutoCompleteProps) {
  const [text, setText] = useState<string>('');
  const [results, setResults] = useState<string[]>([]);
  const [isFinalResultPicked, setIsFinalResultPicked] = useState<boolean>(
    false
  );

  const [searchTimeout, setSearchTimeout] = useState<any>(null);
  const controllerRef = useRef<AbortController | null>(null);

  const [isResListOpen, setIsResListOpen] = useState<boolean>(false);
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    document.addEventListener('keydown', onkeydownHandler, false);

    return () => {
      document.removeEventListener('keydown', onkeydownHandler, false);
    };
  }, []);

  function resultsOnClick(selectedRes: string) {
    setIsFinalResultPicked(true);
    selectedRes = clearBoldTag(selectedRes);
    setTextHandler('');
    setIsResListOpen(false);

    if (!chosens.includes(selectedRes)) {
      if (multiple === true) {
        setChosens([...chosens, selectedRes]);
      } else {
        setChosens([selectedRes]);
      }
    }
  }

  function setTextHandler(text: string) {
    controllerRef.current?.abort();
    clearTimeout(searchTimeout);
    setIsTypingHandler(true);
    setText(text);

    const trimedText: string = text.trim();

    if (trimedText !== '') {
      setSearchTimeout(
        setTimeout(() => {
          setIsTypingHandler(false);
          handleFetchApi(trimedText);
        }, TYPING_DONE_TIME)
      );
    } else {
      setIsTypingHandler(false);
      setIsResListOpen(false);
    }
  }

  async function handleFetchApi(text: string) {
    setIsLoading(true);

    controllerRef.current = new AbortController();
    const { signal } = controllerRef.current;

    let fetchedObjs: IFakeData[] = [];

    let url: string = API_URL.replace('KEYWORD', encodeURI(text));
    try {
      fetchedObjs = await fetchApi(url, signal);
      if (!fetchedObjs) {
        fetchApiCleanUp();
        return;
      }
    } catch (err) {
      if (err instanceof DOMException) {
        fetchApiCleanUp();
        return;
      }
      console.log('fetch error: ', err);
    }

    if (fetchedObjs !== []) {
      fetchedObjs = fetchedObjs.filter(res =>
        res?.volumeInfo?.title?.toLowerCase().includes(text.toLowerCase())
      );

      let finalRes: string[] = fetchedObjs.map(res =>
        searchedBolder(text, res?.volumeInfo?.title ?? '')
      );
      setResultsHandler(finalRes);
    }
    fetchApiCleanUp();
  }

  function fetchApiCleanUp() {
    setIsLoading(false);
    if (!isFinalResultPicked) {
      setIsResListOpen(true);
    }
  }

  function setIsTypingHandler(typingStatus: boolean) {
    setIsTyping(true);

    if (isTyping) {
      setIsFinalResultPicked(false);
      setIsResListOpen(false);
    }
  }

  function setResultsHandler(finalRes: string[]) {
    setResults(finalRes);

    if (results.length === 0) {
      setIsResListOpen(false);
    }
  }

  function onkeydownHandler(event: any) {
    if (event.keyCode === 27) {
      setIsResListOpen(false);
    }
  }

  return (
    <div className='auto-complete'>
      <form onSubmit={e => e.preventDefault()}>
        <div className='input-loading'>
          <span className='input-container'>
            <input
              type='text'
              className='search-input'
              value={text}
              onChange={e => setTextHandler(e.target.value)}
            />
          </span>
          <span className='loading-icon'>
            {isLoading ? (
              <img
                src='https://img.icons8.com/metro/52/999999/spinner-frame-4.png'
                alt='loading-icon'
              />
            ) : (
              <img
                src='https://img.icons8.com/fluent-systems-filled/48/999999/search.png'
                alt='serach-icon'
              />
            )}
          </span>
        </div>
      </form>
      {text !== '' && isResListOpen && results.length !== 0 && (
        <div className='result-container'>
          {results.map((res, i) => (
            <div
              key={`res-${i}`}
              className='result-items'
              onClick={() => resultsOnClick(res)}
            >
              {parse(res)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AutoComplete;
