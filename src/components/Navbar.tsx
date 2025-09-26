import React, { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { name: 'Showcase', href: '/showcase' },
  { name: 'Docs', href: '/docs' },
  { name: 'Blog', href: '/blog' },
  { name: 'Analytics', href: '/analytics' },
  { name: 'Commerce', href: '/commerce' },
  { name: 'Templates', href: '/templates' },
  { name: 'Enterprise', href: '/enterprise' },
  { name: 'Login', href: '/login' }
];

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  return (
    <header className="navbar-container">
      {/* Desktop */}
      <nav className="navbar-desktop">
        <ul className="navbar-list">
          <li><span className="navbar-logo">AEON</span></li>
          {NAV_LINKS.map(link => (
            <li key={link.name}>
              <Link href={link.href} legacyBehavior>
                <a className="navbar-link">{link.name}</a>
              </Link>
            </li>
          ))}
        </ul>
        <input
          className="navbar-search"
          placeholder="Search documentation..."
        />
      </nav>
      {/* Mobile */}
      <nav className="navbar-mobile">
        <div className="navbar-mobile-bar">
          <div className="left-group">
            <button
              aria-label={open ? 'Close menu' : 'Open menu'}
              className="icon-btn"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <svg width="24" height="24" stroke="#222" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <line x1="5" y1="5" x2="19" y2="19" />
                  <line x1="19" y1="5" x2="5" y2="19" />
                </svg>
              ) : (
                <svg width="24" height="24" stroke="#222" fill="none" viewBox="0 0 24 24" strokeWidth="2">
                  <line x1="3" y1="7" x2="21" y2="7" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="17" x2="21" y2="17" />
                </svg>
              )}
            </button>
            <span className="navbar-logo">AEON</span>
          </div>
          <button
            aria-label="Open search"
            className="icon-btn"
            onClick={() => setShowSearch(!showSearch)}
          >
            <svg width="24" height="24" stroke="#222" fill="none" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="7" strokeWidth="2" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" strokeWidth="2" />
            </svg>
          </button>
        </div>

        {showSearch && (
          <div className="mobile-search-bar">
            <input type="text" placeholder="Search documentation..." autoFocus />
            <button
              aria-label="Close search"
              className="close-search-btn"
              onClick={() => setShowSearch(false)}
            >
              ✖
            </button>
          </div>
        )}

        {open && (
          <div className="navbar-mobile-slideout">
            <ul className="navbar-mobile-list">
              {NAV_LINKS.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} legacyBehavior>
                    <a className="navbar-mobile-link">{link.name}</a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      <style jsx>{`
        /* Shared */
        .navbar-container {
          width: 100%;
        }
        .navbar-logo {
          font-weight: 500;
          font-size: 20px;
          color: #1976d2;
          letter-spacing: 0.01em;
        }
        /* Desktop */
        .navbar-desktop {
          display: flex;
          align-items: center;
          border-bottom: 1px solid #eee;
          background: #fff;
          padding: 0 0 0 16px;
        }
        .navbar-list {
          display: flex;
          align-items: center;
          list-style: none;
          margin: 0;
          padding: 0;
          gap: 26px;
        }
        .navbar-link {
          color: #666;
          text-decoration: none;
          font-weight: 500;
          font-size: 18px;
          padding: 0 2px;
        }
        .navbar-search {
          margin-left: auto;
          margin-right: 20px;
          background: #f4f4f4;
          border: none;
          border-radius: 7px;
          padding: 8px 20px;
          color: #666;
          font-size: 16px;
          width: 250px;
        }
        /* Mobile */
        .navbar-mobile {
          display: none;
          background: #fff;
          padding: 16px 12px 0 12px;
        }
        .navbar-mobile-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }
        .left-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .icon-btn {
          background: none;
          border: none;
          padding: 2px 0;
          display: flex;
          align-items: center;
          cursor: pointer;
          color: #222;
        }
        .navbar-mobile-slideout {
          border: 1px solid #ededed;
          border-radius: 5px;
          margin-top: 8px;
        }
        .navbar-mobile-list {
          list-style: none;
          margin: 0;
          padding: 16px 0 8px 18px;
        }
        .navbar-mobile-list li {
          margin-bottom: 22px;
          font-size: 20px;
          color: #767676;
        }
        .navbar-mobile-link {
          color: #767676;
          text-decoration: none;
          font-weight: 500;
        }
        .mobile-search-bar {
          display: flex;
          align-items: center;
          gap: 12px;
          border: 1px solid #ededed;
          border-radius: 5px;
          padding: 6px 12px;
          margin-top: 8px;
        }
        .mobile-search-bar input {
          flex-grow: 1;
          border: none;
          outline: none;
          font-size: 16px;
          color: #767676;
        }
        .close-search-btn {
          background: none;
          border: none;
          font-size: 20px;
          cursor: pointer;
          color: #767676;
        }
        /* Responsive */
        @media (max-width: 800px) {
          .navbar-desktop {
            display: none;
          }
          .navbar-mobile {
            display: block;
          }
        }
        @media (min-width: 801px) {
          .navbar-mobile {
            display: none;
          }
          .navbar-desktop {
            display: flex;
          }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
