
import React from 'react';

type IconName = 'search' | 'sparkles' | 'heart' | 'download' | 'sun' | 'moon' | 'close' | 'copy' | 'check' | 'logo' | 'loader' | 'error' | 'empty' | 'history' | 'user' | 'logout';

interface IconProps extends React.SVGProps<SVGSVGElement> {
  name: IconName;
  filled?: boolean;
}

export const Icon: React.FC<IconProps> = ({ name, filled = false, ...props }) => {
  const paths: Record<IconName, React.ReactNode> = {
    search: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
    sparkles: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M16 17v4m-2-2h4M15 3l-1.5 1.5M19.5 7.5L18 9M9 15l-1.5 1.5M4.5 7.5L3 9M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    heart: filled ? (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" fill="currentColor" />
    ) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
    ),
    download: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
    sun: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />,
    moon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />,
    close: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />,
    copy: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    check: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />,
    logo: <path d="M14.7,3.33,12,4.86,9.3,3.33,6.6,4.86,4.5,3.8,2.4,4.86V16.79l2.1,1.06,2.1-1.06,2.7,1.53,2.7-1.53,2.1,1.06,2.1-1.06V4.86L17.4,3.8Z M11.1,11.52,9.3,10.46v2.12L12,14.11l2.7-1.53V10.46L12.9,11.52,12,12.05Z M12,5.92,14.7,7.45,12,9,9.3,7.45Z" />,
    loader: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V3M4.93 4.93l2.12-2.12M3 12H0m1.93 7.07l-2.12-2.12M12 18v3m7.07-1.93l-2.12-2.12M21 12h3m-1.93-7.07l2.12-2.12" />,
    error: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    empty: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
    history: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
    user: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />,
    logout: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
  };

  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      {paths[name]}
    </svg>
  );
};
