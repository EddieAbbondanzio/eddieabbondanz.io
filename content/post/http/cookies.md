---
title: "HTTP Cookies"
date: 2019-01-24T18:37:24-04:00
categories: ["HTTP"]
type: post
---


<img src="/img/http/cookies/1.jpg" class="image-center" style="margin-bottom: 64px;">

# What Are They?

HTTP cookies are small bits of text that are included with each HTTP request made from a user's web browser to web servers. HTTP is a stateless protocol which means each requests is treated as a unique command, and no state data is maintained. Cookies were designed to fill this gap, and allow servers to associate data with user's as they traverse sites. Cookies are commonly used by sites to hold authentication tokens, tracking ids, or save user preferences.

Alike real life cookies, HTTP cookies come in many different flavors. The three main variations are:

## Session Cookies

Session cookies are temporary cookies that are kept to manage a user's state as they browse a website. These are used to retain preferences, log actions, or global variables across multiple pages. They do not have a expiration date, but are deleted automatically when the user closes their browser.

## Persistent Cookies

Unlike session cookies, persistent cookies are not deleted when the browser closes. Instead these have an expiration date, and/or lifespan that dictates when browsers should consider them expired, and need to be deleted. Persistent cookies have no upper limit to their lifespan, but user's can delete them at anytime. These are typically used to keep a user logged into their account.

## Third-party Cookies

Third-party cookies are cookies that have a different domain associated with them than the site they were set on. These typically come from externally hosted content such as advertisements. Advertisers like to use these to track users, and their browsing habits.

# Anatomy

Cookies are represented as strings, and are composed of a name, value, and several attributes. Cookies must be kept small in size, and may not have a length greater than 4096 bytes. To calculate the length of a cookie it should be "measured by the sum of the length of the cookie's name, value, and attributes" [1].  

Cookies are constrained to such a small size by design as they are automatically sent with every HTTP request a browser makes. While 4096 bytes may seem small in size, you should remember that a single site may use multiple cookies (up to 50), and each extra byte increases the amount of time a round trip from the client to server takes.

At minimum, a server can set a cookie on the user with only a name, and value. For example a site may offer multiple color themes that the user can choose from, and to prevent the user from having to select the theme each page they visit, the site could store a theme cookie on the user via a `Set-Cookie` header on it's HTTP response. 

```http
Set-Cookie: theme=dark
```

The above cookie has a name of 'theme', and a value of 'dark'

It's worth mentioning that when the domain / path attributes of a cookie are omitted, the browser will automatically apply the domain / path that the cookie was received from. Therefore if the above cookie was sent from `youtube.com` a web browser would interpret the header as:

```http
Set-Cookie: theme=dark Domain=youtube.com; Path=/
```

Cookies can be set by both the web browser, and the web server. A web server can set a cookie in the user's browser using the `Set-Cookie` header on HTTP responses. There is no set limit on how many `Set-Cookie` headers may be included per HTTP response. Web browsers on the other hand can set cookies via JavaScript, and can access any cookie that does not have an `HttpOnly` attribute.

## Fun Fact

There's no direct command for a server to use to tell a web browser to delete a cookie. Instead the server must send a `Set-Cookie` header with the cookies name, and an expiration date that has already passed.

## Attributes

Attributes can be used to control specific behaviors of the cookie. Attribute headers are considered case insensitive. And are provided after the name, and content of the cookie. When a cookie has more than one attribute a `;` must be used to delimit them.

### Expires

The expiration date dictates how long the browser should consider the cookie valid before it is deleted. Setting this to an exorbitantly high value such as in the year 2525 will not 
guarantee the cookie will be kept for that long as user's can purge cookies from their browser at any time.

When no expiration date is provided the cookie is treated as a session cookie and is deleted once the user closes the tab or window with the web page loaded.

Expiration dates should be in UTC, or GMT format

##### Example
```http
foo=bar Expires=Thu, 24 Jan 2019 00:00:00 UTC
```

#### Max-Age

The max-age attribute is the number of seconds a cookie has to live before it is considered expired. Cookies may have both a max-age, and expires attribute but the max-age attribute will take precedence.

##### Example
```http
foo=bar Max-Age=3600
```

#### Domain

The domain attribute indicates the site that owns the cookie. A site such as `widgets.com` would specify their domain with the attribute as: `Domain=widgets.com;` It should be noted that a server may only set a domain with a URL that indicates the origin. Referring back to `widgets.com` while a domain attribute of `Domain=widgets.com;` is perfectly acceptable a domain attribute of `Domain=google.com` would be rejected.

##### Example
```http
foo=bar Domain=google.com
```

#### Path

The path attribute can be used to further limit the scope of a cookie. If a cookie was set with a path of `Path=/store` for `widgets.com` then the cookie would only be supplied by the user when they visited a matching URL such as `widgets.com/store`

##### Example
```http
foo=bar Domain=google.com; Path=/
```

#### Secure

The secure attribute restricts cookies to only be used when the user is navigating the site via HTTPS. A cookie may not be set with the secure attribute unless the server is already communicating with the user through HTTPS.

##### Example
```http
foo=bar Secure
```

#### HttpOnly

Normally cookies can be accessed by browsers via the `document.cookie` property in JavaScript. However, when the HttpOnly attribute is set, the cookie cannot be accessed by any code on the web page, and `document.cookie` will not include it. This attribute can be set with or without the secure attribute as they are independent of each other.

```http
foo=bar HttpOnly
```

# Sources

[1] RFC6265 HTTP State Management Mechanism. A. Barth. April 2011. (Format: TXT=79724 bytes) (Obsoletes RFC2965) (Status: PROPOSED STANDARD) (DOI: 10.17487/RFC6265) 
https://tools.ietf.org/html/rfc6265

[2] Wikipedia contributors. (2019, January 8). HTTP cookie. In Wikipedia, The Free Encyclopedia. Retrieved 01:12, January 25, 2019, from https://en.wikipedia.org/w/index.php?title=HTTP_cookie&oldid=877337327

[Image] By Cel Lisboa on Unsplash
https://unsplash.com/photos/YnrSLOAjOEA