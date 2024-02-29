### measure-text-with-canvas

This is a surprising problem. Is it possible to measure a paragraph before it rendered and
split it into lines based on the dimensions of the browser render? The answer is kinda,
you can measure elements with canvas but it's not perfect to the browser render. This is one
such example of an effect I was trying to build. I wanted to measure a paragraph and split it
into lines similar to how the browser would render lines without splitting.

The code lives in [clientwrapper.tsx](./src/app/clientwrapper.tsx).
