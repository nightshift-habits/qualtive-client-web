# Qualtive Client Library for Web

## Installation

### Using `npm`

```
npm install qualtive-web
```

### Using `yarn`

```
yarn add qualtive-web
```

TypeScript types are included in this package.

## Usage

First of all, make sure you have created a question on [qualtive.io](https://qualtive.io). Each feedback entry is posted to a so called collection (ID) which can be found in the question page.

### Using Built-in UI

To present a feedback form, use the `present`-function. For example:

```typescript
import * as qualtive from "qualtive-web"

qualtive.present("my-company/my-question")
```

There is a few options to customize the UI. For example:

```typescript
import * as qualtive from "qualtive-web"

qualtive.present("my-company/my-question", {
  title: "Leave feedback",
  supportURL: "https://link-to-your-customer-service/", // If present, this will show a link to your customer support.
  locale: "en-US", // Optional. The language and formatting to use. Defaults to the device default.
})
```

If users can login on your site, you can include a user property describing the user. For example:

```typescript
import * as qualtive from "qualtive-web"

qualtive.present("my-company/my-question", {
  user: {
    id: "user-123", // Authorized user id. Used to list feedback from the same user. Optional.
    name: "Steve", // User friendly name. Can be the users full name or alias. Optional.
    email: "steve@gmail.com", // Reachable email adress. Optional.
  },
})
```

You can even include custom attributes that will be shown on [qualtive.io](https://qualtive.io). For example:

```typescript
import * as qualtive from "qualtive-web"

qualtive.present("my-company/my-question", {
  customAttributes: {
    age: 22,
  },
})
```

### Using Custom UI

To post a feedback entry, use the `post`-function. For example:

```typescript
import * as qualtive from "qualtive-web"

qualtive.post("my-company/my-question", {
  score: 75, // Score between 0 and 100 where 0 is saddest and 100 is happiest.
  text: "Hello world!", // Optional user typed text.
})
```

If users can login on your site, you can include a user property describing the user. For example:

```typescript
import * as qualtive from "qualtive-web"

qualtive.post("my-company/my-question", {
  score: 75,
  user: {
    id: "user-123", // Authorized user id. Used to list feedback from the same user. Optional.
    name: "Steve", // User friendly name. Can be the users full name or alias. Optional.
    email: "steve@gmail.com", // Reachable email adress. Optional.
  },
})
```

You can even include custom attributes that will be shown on [qualtive.io](https://qualtive.io). For example:

```typescript
import * as qualtive from "qualtive-web"

qualtive.post("my-company/my-question", {
  score: 75,
  customAttributes: {
    age: 22,
  },
})
```

## Supported languages

The built-in UI supports the following languages:

- English
- Swedish
