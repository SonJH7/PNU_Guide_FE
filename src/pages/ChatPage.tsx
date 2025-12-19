import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import leftIcon from '@/assets/icons/ic-left.svg';
import { fontFamily, spacing, textStyle } from '@/theme/designSystem';

type ChatRole = 'assistant' | 'user';

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  time: string;
};

const STORAGE_KEY = 'pnu-chat-recent-searches';
const MAX_RECENT = 8;

const seedMessages: ChatMessage[] = [
  {
    id: 'seed-1',
    role: 'user',
    text: '안녕하세요! 반갑습니다🙂',
    time: '오후 2:30',
  },
  {
    id: 'seed-2',
    role: 'assistant',
    text: '네, 안녕하세요!\n저는 PNU GUIDE의 공식 챗봇이에요.\n무엇을 도와드릴까요? 😊',
    time: '오후 2:30',
  },
  {
    id: 'seed-3',
    role: 'user',
    text: '조한규 교수님의 연구실이 어디인지 알아?',
    time: '오후 2:35',
  },
  {
    id: 'seed-4',
    role: 'assistant',
    text: '죄송합니다. 개인정보보호를 위해 특정 교수님의 연구실 위치를 알려드릴 수 없습니다.\n필요하시다면, 조한규 교수님께 직접 연락을 취하는 방식을 추천드립니다.',
    time: '오후 2:36',
  },
  {
    id: 'seed-5',
    role: 'user',
    text: '알겠어, 고마워!',
    time: '오후 2:36',
  },
  {
    id: 'seed-6',
    role: 'assistant',
    text: '아니에요.\n다음에도 필요하실 때 찾아주세요!',
    time: '오후 2:37',
  },
];

const normalizeTerm = (value: string) => value.trim();

const loadRecentSearches = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    const unique = new Set<string>();
    parsed.forEach((item) => {
      if (typeof item === 'string') {
        const cleaned = normalizeTerm(item);
        if (cleaned) unique.add(cleaned);
      }
    });
    return Array.from(unique).slice(0, MAX_RECENT);
  } catch {
    return [];
  }
};

const formatDateLabel = (value: Date) =>
  value.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

const formatTimeLabel = (value: Date) =>
  value.toLocaleTimeString('ko-KR', {
    hour: 'numeric',
    minute: '2-digit',
  });

const requestAssistantReply = async (history: ChatMessage[]) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      messages: history.map((message) => ({
        role: message.role,
        content: message.text,
      })),
    }),
  });

  const payload = (await response.json().catch(() => null)) as {
    reply?: string;
    error?: string;
  } | null;

  if (!response.ok) {
    const message = payload?.error ?? 'Chat request failed.';
    throw new Error(message);
  }

  const reply = payload?.reply?.trim();
  if (!reply) {
    throw new Error('Chat response was empty.');
  }
  return reply;
};

const ChatPage: React.FC = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollAnchorRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [inputValue, setInputValue] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setRecentSearches(loadRecentSearches());
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSearches));
    } catch {
      // Ignore storage write errors.
    }
  }, [recentSearches]);

  useEffect(() => {
    scrollAnchorRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const dateLabel = useMemo(() => formatDateLabel(new Date()), []);
  const trimmedInput = normalizeTerm(inputValue);
  const canSend = trimmedInput.length > 0 && !isSending;

  const updateRecentSearches = (term: string) => {
    const cleaned = normalizeTerm(term);
    if (!cleaned) return;
    setRecentSearches((prev) => {
      const next = [cleaned, ...prev.filter((item) => item !== cleaned)];
      return next.slice(0, MAX_RECENT);
    });
  };

  const sendMessage = async (messageText: string) => {
    const now = new Date();
    const userMessage: ChatMessage = {
      id: `user-${now.getTime()}`,
      role: 'user',
      text: messageText,
      time: formatTimeLabel(now),
    };
    const nextMessages = [...messages, userMessage];

    setMessages(nextMessages);
    updateRecentSearches(messageText);
    setInputValue('');
    setIsSending(true);

    try {
      const reply = await requestAssistantReply(nextMessages);
      const replyMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        text: reply,
        time: formatTimeLabel(new Date()),
      };
      setMessages((prev) => [...prev, replyMessage]);
    } catch (error) {
      console.error(error);
      const errorText =
        error instanceof Error &&
        error.message.toLowerCase().includes('api key')
          ? 'OpenAI API 키가 설정되어 있지 않습니다. .env를 확인해주세요.'
          : '죄송합니다. 잠시 후 다시 시도해주세요.';
      const errorMessage: ChatMessage = {
        id: `assistant-error-${Date.now()}`,
        role: 'assistant',
        text: errorText,
        time: formatTimeLabel(new Date()),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsSending(false);
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedInput || isSending) return;
    void sendMessage(trimmedInput);
  };

  const handleRecentClick = (term: string) => {
    setInputValue(term);
    updateRecentSearches(term);
    inputRef.current?.focus();
  };

  const clearAllRecent = () => setRecentSearches([]);

  return (
    <div
      className="flex min-h-screen justify-center overflow-hidden bg-background-default text-text-default"
      style={{ fontFamily }}
    >
      <div className="flex h-screen w-full max-w-[420px] flex-col">
        <header
          className="flex flex-col"
          style={{
            gap: spacing(3),
            paddingInline: spacing(5),
            paddingTop: spacing(4),
          }}
        >
          <div className="grid grid-cols-[40px_1fr_40px] items-center">
            <button
              type="button"
              aria-label="뒤로가기"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-background-fill text-text-sub shadow-[0_6px_16px_rgba(17,24,39,0.12)]"
              onClick={() => void navigate(-1)}
            >
              <img src={leftIcon} alt="" className="h-5 w-5" />
            </button>
            <h1
              className="text-center text-text-default"
              style={{ ...textStyle('body1'), fontWeight: 600 }}
            >
              PNU GUIDE 공식 챗봇
            </h1>
            <span aria-hidden className="h-10 w-10" />
          </div>
        </header>

        <main
          className="flex min-h-0 flex-1 flex-col"
          style={{
            gap: spacing(4),
            paddingInline: spacing(5),
            paddingTop: spacing(3),
            paddingBottom: spacing(6),
          }}
          aria-label="챗봇 대화"
        >
          <section className="flex flex-col" style={{ gap: spacing(2) }}>
            <div className="flex items-center justify-between">
              <span
                className="text-text-default"
                style={{ ...textStyle('body2'), fontWeight: 600 }}
              >
                최근 검색
              </span>
              <button
                type="button"
                className="text-text-placeholder transition-colors hover:text-text-sub disabled:cursor-not-allowed disabled:opacity-50"
                style={textStyle('caption')}
                onClick={clearAllRecent}
                disabled={recentSearches.length === 0}
              >
                모두 삭제
              </button>
            </div>
            {recentSearches.length > 0 ? (
              <div className="flex flex-wrap" style={{ gap: spacing(2) }}>
                {recentSearches.map((term) => (
                  <button
                    key={`recent-${term}`}
                    type="button"
                    className="rounded-full border border-border-default bg-background-default text-text-sub shadow-[0_6px_14px_rgba(17,24,39,0.08)] transition-colors hover:bg-background-muted"
                    style={{
                      ...textStyle('body3'),
                      fontWeight: 600,
                      paddingInline: spacing(3),
                      paddingBlock: spacing(1),
                    }}
                    onClick={() => handleRecentClick(term)}
                  >
                    {term}
                  </button>
                ))}
              </div>
            ) : (
              <div
                className="rounded-2xl bg-background-muted text-center"
                style={{ padding: spacing(3) }}
              >
                <span
                  className="text-text-placeholder"
                  style={textStyle('body3')}
                >
                  최근 검색어가 없습니다.
                </span>
              </div>
            )}
          </section>

          <div
            className="flex flex-1 flex-col overflow-y-auto"
            style={{ gap: spacing(3), minHeight: 0 }}
          >
            <div className="flex justify-center">
              <span
                className="rounded-full bg-background-fill text-text-sub shadow-[0_4px_10px_rgba(17,24,39,0.08)]"
                style={{
                  ...textStyle('caption'),
                  fontWeight: 600,
                  paddingInline: spacing(3),
                  paddingBlock: spacing(1),
                }}
              >
                {dateLabel}
              </span>
            </div>

            <div className="flex flex-col" style={{ gap: spacing(3) }}>
              {messages.map((message) => {
                const isUser = message.role === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      isUser ? 'items-end' : 'items-start'
                    }`}
                    style={{ gap: spacing(1) }}
                  >
                    <div
                      className={`max-w-[78%] whitespace-pre-wrap rounded-2xl ${
                        isUser
                          ? 'bg-brand-sky text-white shadow-[0_10px_24px_rgba(2,117,201,0.24)]'
                          : 'bg-background-fill text-text-default shadow-[0_10px_24px_rgba(17,24,39,0.08)]'
                      }`}
                      style={{
                        ...textStyle('body2'),
                        paddingInline: spacing(3),
                        paddingBlock: spacing(2),
                      }}
                    >
                      {message.text}
                    </div>
                    <span
                      className="text-text-placeholder"
                      style={textStyle('caption')}
                    >
                      {message.time}
                    </span>
                  </div>
                );
              })}
              {isSending ? (
                <div
                  className="flex flex-col items-start"
                  style={{ gap: spacing(1) }}
                >
                  <div
                    className="max-w-[78%] rounded-2xl bg-background-fill text-text-default shadow-[0_10px_24px_rgba(17,24,39,0.08)]"
                    style={{
                      ...textStyle('body2'),
                      paddingInline: spacing(3),
                      paddingBlock: spacing(2),
                    }}
                  >
                    답변을 작성 중이에요...
                  </div>
                </div>
              ) : null}
              <div ref={scrollAnchorRef} />
            </div>
          </div>
        </main>

        <footer
          className="bg-background-default"
          style={{
            paddingInline: spacing(5),
            paddingBottom: spacing(6),
            paddingTop: spacing(2),
          }}
        >
          <form
            className="flex items-center rounded-full border border-border-default bg-background-fill shadow-[0_12px_24px_rgba(17,24,39,0.08)]"
            style={{
              gap: spacing(2),
              paddingInline: spacing(2),
              paddingBlock: spacing(1.5),
            }}
            onSubmit={handleSubmit}
          >
            <button
              type="button"
              aria-label="파일 추가"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-background-default text-text-placeholder shadow-[0_6px_14px_rgba(17,24,39,0.08)]"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M12 5V19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M5 12H19"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
            <input
              ref={inputRef}
              value={inputValue}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder="메시지를 입력하세요."
              className="flex-1 bg-transparent text-text-default placeholder:text-text-placeholder focus:outline-none"
              style={textStyle('body2')}
              aria-label="메시지 입력"
            />
            <button
              type="submit"
              aria-label="메시지 전송"
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                canSend
                  ? 'bg-brand-blue text-white shadow-[0_8px_18px_rgba(20,63,144,0.3)]'
                  : 'bg-background-default text-text-placeholder'
              }`}
              disabled={!canSend}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M4 12H20"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M14 6L20 12L14 18"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default ChatPage;
