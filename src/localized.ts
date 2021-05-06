const strings = {
  "en-us": {
    "ops.fallback-error": "Could not complete operation.",

    "form.title": "Leave feedback",
    "form.question": "What do you think?",
    "form.close": "Close",
    "form.text-placeholder": "Write here…",
    "form.cancel": "Cancel",
    "form.send": "Send",
    "form.sending": "Sending…",
    "form.sent": "Thank you, sent!",
    "form.error": "Failed to send",
    "form.support": "For help and customer support, look here",
    "form.score.0": "Hate",
    "form.score.25": "Dislike",
    "form.score.50": "Neutral",
    "form.score.75": "Like",
    "form.score.100": "Love",
    "form.nps.leading": "Very likely",
    "form.nps.trailing": "Not likely",
    "form.image.index": "Image ",
  },
  "sv-se": {
    "ops.fallback-error": "Kunde inte slutföra åtgärd.",

    "form.title": "Lämna feedback",
    "form.question": "Vad tycker du?",
    "form.close": "Stäng",
    "form.text-placeholder": "Skriv här…",
    "form.cancel": "Avbryt",
    "form.send": "Skicka",
    "form.sending": "Skickar…",
    "form.sent": "Tack, skickad!",
    "form.error": "Kunde inte skicka",
    "form.support": "För hjälp och kundserviceärenden se hit",
    "form.score.0": "Hata",
    "form.score.25": "Ogilla",
    "form.score.50": "Neutral",
    "form.score.75": "Gilla",
    "form.score.100": "Älska",
    "form.nps.leading": "Mycket sannolikt",
    "form.nps.trailing": "Inte alls sannolikt",
    "form.image.index": "Bild ",
  },
} as { [key: string]: { [key: string]: string } }

export default (key: string, locale?: string): string => {
  locale = locale || navigator.language || "en-us"
  locale = locale.toLowerCase()
  return (strings[locale] || strings["en-us"])[key] || key
}
