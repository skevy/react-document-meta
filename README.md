=======
Currently unsupported and unused. Use React-Helmet instead: https://github.com/nfl/react-helmet
=======

React Document Meta
====================

Provides a declarative way to specify meta tags in a single-page app.  
This component can be used on server side as well.

Built with [React Side Effect](https://github.com/gaearon/react-side-effect).

====================

## Installation

```
npm install --save react-document-meta
```

Dependencies: React >= 0.11.0

## Features

* Like a normal React compoment, can use its parent's `props` and `state`;
* Can be defined in many places throughout the application;
* Supports arbitrary levels of nesting, so you can define app-wide and page-specific meta data. It merges meta data from all pages, with the inner most component taking presidence;
* Works just as well with isomorphic apps.

## Example

Assuming you use something like [react-router](https://github.com/rackt/react-router):

**TODO**

## Server Usage

If you use it on server, call `DocumentMeta.rewind()` after rendering components to string to retrieve the meta tags given to the innermost `DocumentMeta`. It will return a string of meta tags. You can then embed this into an HTML page template.

Because this component keeps track of mounted instances, **you have to make sure to call `rewind` on server**, or you'll get a memory leak.
