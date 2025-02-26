module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
// ... existing config ...

module.exports = {
  // ... other config ...
  theme: {
    extend: {
      // ... other extensions ...
      animation: {
        'float-slow': 'float-slow 20s infinite',
        'float-medium': 'float-medium 15s infinite',
        'float-fast': 'float-fast 12s infinite',
        // ... existing animations ...
      },
    },
  },
};