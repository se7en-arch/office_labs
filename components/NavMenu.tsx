'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logout, getInitials, type Session } from '@/lib/auth';

export default function NavMenu() {
  const router       = useRouter();
  const [open, setOpen]       = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef       = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setSession(getSession());
  }, []);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') { setOpen(false); btnRef.current?.focus(); }
    }
    document.addEventListener('click', handleOutsideClick);
    document.addEventListener('keydown', handleKeydown);
    return () => {
      document.removeEventListener('click', handleOutsideClick);
      document.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  function handleLogout() {
    logout();
    setSession(null);
    setOpen(false);
    router.push('/');
    router.refresh();
  }

  const initials = session ? getInitials(session.name) : null;

  return (
    <div className="nav-act" ref={containerRef}>
      <Link href="/publish" className="btn-host">Публикувай имот</Link>
      <button
        ref={btnRef}
        className="menu-pill"
        aria-label="Меню"
        aria-expanded={open}
        aria-haspopup="true"
        onClick={e => { e.stopPropagation(); setOpen(prev => !prev); }}
      >
        {session ? (
          <span style={{ width: 28, height: 28, borderRadius: '50%', background: '#FFA627', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>
            {initials}
          </span>
        ) : (
          <div className="pill-lines">
            <span /><span /><span />
          </div>
        )}
      </button>
      <div className={`dropdown${open ? ' open' : ''}`} role="menu">
        {session ? (
          <>
            <div style={{ padding: '10px 16px 8px', borderBottom: '1px solid #f0f1f3', marginBottom: 4 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#111827' }}>{session.name}</div>
              <div style={{ fontSize: 11.5, color: '#9ca3af', marginTop: 2 }}>{session.email}</div>
            </div>
            <Link href="/profile" role="menuitem" onClick={() => setOpen(false)}>Моят профил</Link>
            <Link href="/publish" role="menuitem" onClick={() => setOpen(false)}>Публикувай обява</Link>
            <hr />
            <Link href="#" role="menuitem">Помощен център</Link>
            <button
              role="menuitem"
              onClick={handleLogout}
              style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '10px 16px', fontSize: 14, color: '#ef4444', fontFamily: 'inherit' }}
            >
              Изход
            </button>
          </>
        ) : (
          <>
            <Link href="/register" className="fw" role="menuitem" onClick={() => setOpen(false)}>Регистрация</Link>
            <Link href="/login" role="menuitem" onClick={() => setOpen(false)}>Вход</Link>
            <hr />
            <Link href="/publish" className="dd-host" role="menuitem" onClick={() => setOpen(false)}>Публикувай имот</Link>
            <Link href="#" role="menuitem">Помощен център</Link>
          </>
        )}
      </div>
    </div>
  );
}
