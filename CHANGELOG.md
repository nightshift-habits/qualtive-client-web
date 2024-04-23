# Changelog

All notable changes to this project will be documented in this file.

## 1.14.2

### Improved

- Removed all uses of async/await.
- Minified export now only exposes public properties.

### Fix

- Missing export of attachments when using package.
- Fix button styles could sometimes be overwritten by parent website.

## 1.14.1

### Fix

- Previewing user submitted text not sanitized

## 1.14.0

### Added

- Support for non-white label workspaces/containers.

## 1.13.0

### Added

- Option for level of metadata collection.
- Option for user tracking consent.

## 1.12.0

This release adds partly support for running in Node 18 without any additional configuration.

### Added

- Support for fetch as a network layer. Automatically chosen based on runtime support.
- Option to force a specific network layer or a custom networking function.

### Fixed

- All errors are now thrown as an Error instead of a string in sometimes.

## 1.11.1

### Fixed

- Export of get methods directly from package index.

## 1.11.0

### Added

- Includes URL of the webpage feedback was posted from. Defaults to the browser location href, but can be overwritten if needed.

## 1.10.0

### Added

- Support for presenting a form nativly when web is runned inside a web view.

## 1.9.0

### Added

- Support for drag and drop attachments.

### Fixed

- Form position on mobile when scrolled down.
- Sending state not shown in some cases.
- Font face name is now more unique to not conflict with others.

## 1.8.1

### Fixed

- Ignoring compact build in npm package.

## 1.8.0

### Added

- Support for custom user input in select inputs.
- Option for wider form width.
- Improved language selection. Now handeleds language-only locales.

### Fixed

- Can still submit after removing an attachment.
- Slow loading forms now behave correctly.
- Support link could be rendered twice if on a slow network.
- Scrollbars always visible on Windows.
- NPS score values.

## 1.7.0

### Added

- Support for different score types currently including smilies3, smilies5 and nps.
- Added support for translated questions.

## 1.6.1

### Fixed

- Fixed attachments upload.

## 1.6.0

### Added

- Added support for attachments type.

## 1.5.1

### Fixed

- URls for external fonts.

## 1.5.0

### Added

- Support for select and multiselect question types.

### Changed

- Updated result view for forms.

## 1.4.0

### Added

- Option to disallow dismissing form by escape-key.

### Fixed

- Form layout on mobile and small screens.

## 1.3.0

### Added

- Function to get a question and its configuration from qualtive.io.
- Forms now adjust to the content of it question.
- Option to set dark mode appearance on form.

## 1.2.0

- Improved accessibility

## 1.1.1

- Updated README.md.
- Fixes issue with unknown locale resulting in built-in UI not being presented.

## 1.1.0

### Added

- Built-in form UI.

## 1.0.4

- Updated API endpoint.

## 1.0.3

- Updated attribute hints.

## 1.0.2

### Added

- Changelog.
- Continuous Integration.

## 1.0.0

Inital release
