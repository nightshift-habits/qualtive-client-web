const strings = {
  "en-us": {
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
  },
  "sv-se": {
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
  },
} as { [key: string]: { [key: string]: string } }

export default (key: string, locale: string | undefined): string => {
  locale = locale || navigator.language || "en-us"
  return strings[locale][key] || strings["en-us"][key] || key
}
