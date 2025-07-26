# Changelog

All notable changes to this project will be documented in this file.

## 1.23.0

### Added

- Support for multiple condition-based submitted pages.
- Support for new user input score component.
- Added new callback `onSubmittedPageShown` which is called after the submitted page was rendered.
- Allows for custom padding when rendering inline.

### Fixed

- Exposed TypeScript types for all form related types.

## 1.22.0

### Added

- Support for custom fonts in enquiry themes.

## 1.21.0

### Improved

- Adjusted font sizes and margins

### Fixed

- Some additional margin when presented inline

## 1.20.1

### Fixed

- Missing rounded styling when rendering inline

## 1.20.0

### Added

- Support for theme customization including:
  - Predefined and custom background styles (plain or sponda pattern)
  - Font family selection (default or Hepta Slab)
  - Corner style options (rounded or square)
- Container visibility mode setting (`public` or `private`) to control response visibility
- New font families: Poppins and Hepta Slab

### Improved

- Enhanced title styling with larger font size (28px) and better line height
- More consistent font family handling across components
- Better layout for confirmation text with improved flex properties

### Fixed

- Confirmation text checkmark truncated if text is long

## 1.19.0

### Added

- Support for image components on submitted page having a optional link.
- Support for new link component on submitted page.

### Improved

- Resolving locale does not have a dependency on `window.navigator` anymore allowing for easier usage in a server side environment.

## 1.18.0

### Added

- `onSubmitted`-callback function can now return a promise which will be awaited before the submitted state is shown.
- Added a new `renderEnquirySubmitted`-function which can be used to render the submitted state of an already submitted entry.
- Pick up and delete breadcrumb references from other packages. For example, this is used for the new [qualtive-web-sentry](https://github.com/nightshift-habits/qualtive-client-web-sentry)-package which includes Sentry events in posted entries.

### Improved

- Renamed `presentEnquiry`-function from `present`-function. The old naming is deprecated and will be removed in the next major version.

## 1.17.0

### Added

- Allow passing a promise and/or a function for user and custom attributes

### Fixed

- Removed local dependency of jsx-runtime. This could cause issues installing the package in some environments.

## 1.16.0

### Added

- Support for thumb score type.
- Support for 5 stars score type.
- Support for read only body text component.
- Support for read only image component.

### Improved

- Allow user to select text in paragraphs.

### Fixed

- User inputted text not wrapping after submitted.
- Padding when rendering inline.
- Elements may overflow when switching page and rendering inline.
- Exception when placing read-only components in user input which are not ordered last.

## 1.15.0

### Added

- Support for multiple pages.
- Support for custom submitted page.
- Support for new contact details component.

### Improved

- Look n' feel of the user interface.

## 1.14.2

### Improved

- Removed all uses of async/await.
- Minified export now only exposes public properties.

### Fixed

- Missing export of attachments when using package.
- Fix button styles could sometimes be overwritten by parent website.

## 1.14.1

### Fixed

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
