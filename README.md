# technical

Technical test for We Build Bots.

## Strategy

The strategy employed to solve this technical test involved a couple of simple
steps which build on each other. In the first step, the file is read and parsed
to remove irrelevant non-alphabetical/grammatical characters, homogenize all
relevant grammar markers and seperate terminating grammar marks from tokens.
The file is tokenized and passed onto the second step, which looks for names and
removes the catalogued tokens from the array to prevent possible re-reading of
names. I made the decision that the two names `Mr James Bateman` and
`Mr. James Bateman` should be counted as being identical. Practically speaking,
titles with a trailing period are mutated to remove the period. Homogenizing the
grammar markers before we parse out names also affords us the luxury of only
having to look for a single character when searching for name-breaking
grammatical tokens. Once this initial startup effort has been effected, an array
of names and their respective counts can be passed to the API for serving. Slow
areas of the code that could use improvement include the current process of
looping across the tokenized file during homogenizing. This area could be
improved by employing faster search algorithms than a linear loop, suffering a
loss of code readability for an increase in scalability. Another place that
scalability could be increased would be to split the codebase into two
processes; one that does the work of initially loading and counting names in
files, and another lightweight worker process that serves the counted data which
could have as many copies running as required. Yet another area for improvement
is the loading and counting of the names from the file every time the process
starts. The program could be smarter by loading the target file's name data from
the output file on load to save a lot of time.

## Definitions and assumptions

The following are some definitions and assumptions that I have made about what
a name is, drawn from the example and a brief a reading of a few paragraphs of
the source text.

Name:
  - A full name is serious of words that can include exactly one optional title,
    exactly one first name, an infinite number of middle names and exactly one
    optional ast name.
  - A sequence must have a minimum of at least one first or last name for that
    sequence to be considered a name.

Titles:
  - A title alone is not a name.

First Names:
  - A first name will either be followed by a middle name, a last name, or a
    random word.

Middle Names:
  - A full name can include infinite middles names.
  - Middle names are drawn from the same pool as first names.

Last Names:
  - A last name will always follow a title or a first name.
  - Last names alone are not considered to be a full name. It's almost always
    the case that a last name like Smith, when beginning with a capital letter,
    will represent a person, but there are counter-examples which could
    introduce false positives. An example of this might be:
    `Ham was his favourite meat.`, where Ham is both a last name a noun.
    **This feature can be toggled with command line arguments. Supply the CLI
    argument "last" to include last names alone as valid names**

## Code style and notes

  - Code in this codebase is es-standard compliant.
  - Code is **functional and immutable wherever possible**.
  - It wasn't until I read the brief paper that I realised that this test was to
    be written in TypeScript. I am fully ECMAScript proficient but have not used
    TypeScript before and so where necessary I have followed the tooltips of my
    IDE in order to lint my code. Hopefully the IDE has chosen sensible
    expressions and changes to remove linting errors. If there are issues with
    my TypeScript I must protest innocence!

## API

The API exposes a single endpoint, `GET /name-count`, which should include a
single parameter, `name`, set to the name whose count should be returned, for
example: `/name-count?name=James%20Bateman`
The server will return a JSON object with two fields; the name that was given
in the parameters and the number of times it was found in Oliver Twist.
Spaces in the query tring and path of the URI should be encoded using `%20` and
queries should not include periods.

## Using the software

Start the app like this:

`sudo npm i`
`sudo node index`

## Thanks

Thanks for your consideration, James Bateman *j.bateman@techie.com*.
