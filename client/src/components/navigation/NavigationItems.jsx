export const navigationItems = [
  {
    href: '/tags',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>
    ),
    label: 'Tags'
  },
  {
    href: '/categories',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
      </svg>
    ),
    label: 'Categories'
  },
  // {
  //   href: '/wikipedia',
  //   icon: (
  //     <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
  //       <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .084-.103.135-.2.15-.74.061-1.05.15-1.05.436 0 .090.073.224.21.391.692 1.661 3.959 8.918 4.99 11.103.2.426.637.405.807-.03.904-2.264 3.707-7.815 4.74-10.312.182-.427.252-.709.252-.855 0-.405-.414-.437-1.033-.498-.1-.016-.213-.066-.213-.15v-.435l.062-.045h5.273l.037.043v.435c0 .084-.104.135-.25.15-1.004.105-1.367.391-1.91 1.395-1.242 2.294-3.537 7.17-4.779 9.862-.318.691-.714.779-1.119-.021-.797-1.579-2.242-4.503-3.27-6.604-.31-.632-.494-1.051-.494-1.262 0-.405.405-.465 1.033-.526.094-.01.188-.06.188-.144v-.436l-.06-.045h-5.36z"/>
  //     </svg>
  //   ),
  //   label: 'Wikipedia'
  // },
  {
    href: '/github',
    icon: (
      <svg className="w-5 h-5 inline-block mr-1" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
      </svg>
    ),
    label: 'GitHub'
  }
];

export const NavigationLink = ({ href, icon, label, className = '' }) => (
  <a href={href} className={`flex items-center text-sm font-medium text-primary hover:text-accent transition px-2 ${className}`}>
    <span className="mr-2 flex items-center justify-center w-5 h-5">{icon}</span>
    {label}
  </a>
);