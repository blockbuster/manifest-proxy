# Manifest Proxy

Simple node object that takes a Smooth Streaming manifest, and splits any multi-quality audio in to multiple tracks with 
one quality per track.

Optionally the code can also strip <f> tags to reduce manifest size.

## Files in repository

- **Manifest** - *Input Manifest file for testing*
- **Manifest.xml** - *Expected output*
- **package.json** - *Standard node package file*
- **manifest-parse-test.js** - *The actual code*

## Requirements
The code uses [libxmljs](https://github.com/libxmljs/libxmljs)