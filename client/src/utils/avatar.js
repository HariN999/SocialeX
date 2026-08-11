import React from 'react';

/**
 * Renders a profile image or a beautiful colored letter-avatar if the image is missing or a placeholder.
 */
export const renderAvatar = (username, profilePic, className = '') => {
    const isValidUrl = profilePic && (profilePic.startsWith('http') || profilePic.startsWith('data:image'));
    const isUnsplashPlaceholder = profilePic && profilePic.includes('unsplash.com');

    // If it's a valid custom URL (and not the default unsplash placeholder), render the image
    if (isValidUrl && !isUnsplashPlaceholder) {
        return <img src={profilePic} alt={username} className={className} />;
    }

    // Otherwise, render a premium letter avatar
    const initial = username ? username.charAt(0).toUpperCase() : '?';

    // Consistent colored background based on username hash
    const colors = [
        '#1da1f2', // Twitter Blue
        '#738adb', // Discord Purple
        '#ff5a5f', // Airbnb Red
        '#00b0ff', // Light Blue
        '#00e676', // Green
        '#ff3d00', // Orange-Red
        '#ab47bc', // Purple
        '#ec407a', // Pink
        '#26a69a', // Teal
        '#ffb300'  // Amber
    ];

    let hash = 0;
    if (username) {
        for (let i = 0; i < username.length; i++) {
            hash = username.charCodeAt(i) + ((hash << 5) - hash);
        }
    }
    const color = colors[Math.abs(hash) % colors.length];

    return (
        <div
            className={`letter-avatar ${className}`}
            style={{
                backgroundColor: color,
                color: '#ffffff',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '800',
                borderRadius: '50%',
                textTransform: 'uppercase',
                userSelect: 'none'
            }}
        >
            {initial}
        </div>
    );
};
