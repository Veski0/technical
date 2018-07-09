# technical

Technical test for We Build Bots.

## API

The API exposes a single endpoint, `GET /name-count`, which should include a
single parameter, `name`, set the a name whose count should be returned.
The server will return a JSON object with two fields; the name that was given
in the parameters and the number of times it was found in Oliver Twist.
Spaces in the query tring and path of the URI should be encoded using '%20'.
Names in the form <title> <lastname> must have a period and space character
between the tokens. Examples: `Mr.%20Bateman`, `Professor.%20Smith`.
Names in the form <title> <firstname> must not have a period before the
seperating space character between the tokens. Examples: `Miss%20Jenny`,
`Master%20Mark`.

## Using the software

Start the app like this:

`sudo npm i`
`sudo node index`

## Definitions and assumptions

The following are some definitions and assumptions that I have made about what
a name is, drawn from the example and a brief a reading of a few paragraphs of
the source text.

Name:
  Definition:
    `A name, or token, is a non-null sequence of characters that *exactly* matches
    an entry from first-names.txt or last-names.txt.`

Full Name:
  Definition:
    `A full name is serious of words that can include exactly one title,
    exactly one first name, an infinite number of middle names and exactly one last name`
  Assumptions:
    - A full name's words are all capitalised.
    - A sequence must have a minimum of at least one first or last name for that
    sequence to be considered a name.

Titles:
  Assumptions:
    - A full name only includes one title.

First Names:
  Assumptions:
    - A full name only includes one first name.
    - A first name will either be followed by a middle name, a last name, or a random word.

Middle Names:
  Assumptions:
    - A full name can include infinite middles names.
    - If a full name includes a middle name, it will include a last name.
    - Middle names are drawn from the same pool as first names.

Last Names:
  Assumptions:
    - A last name will always follow a full stop, a first name or a middle name.
    - Last names alone are not considered to be a full name. It's almost always the case
      that a last name like Smith, when beginning with a capital letter, will represent
      a person, but there are counter-examples which could introduce false positives.
      An example of this might be: `Ham was his favourite meat.`, where Ham is both a
      last name a noun.

## Code style and notes

- Code in this codebase is es-standard compliant.
- It wasn't until I read the brief paper that I realised that this test was to be
written in TypeScript. I am fully ECMAScript proficient but have not used
TypeScript before and so where necessary, I have followed the tooltips of my IDE in
order to lint my code. Hopefully the IDE has chosen sensible expressions and changes
to remove linting errors.

## Thanks

Thanks for your consideration, James Bateman *j.bateman@techie.com*.
