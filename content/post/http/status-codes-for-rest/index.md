---
title: "HTTP Status Codes For a RESTful API"
date: 2019-01-29T18:29:29-04:00
type: post
thumbnail: "/post/http/status-codes-for-rest/images/1.jpg"
series: "Development"
---

Hyper Text Transfer Protocol (HTTP) powers the web. It's the silent work horse used to carry data between servers and clients, and is the reason why all URLs start with HTTP, or HTTPS. For those new to HTTP, it can be though of as clients (users) making _requests_ that are sent to servers which then reply back with _responses_. Only servers can make responses, and only clients can make requests.

HTTP also powers many application programming interfaces (APIs). Since HTTP is a stateless protocol, it acts as the perfect medium to promote RESTful design principles. "Representational State Transfer (REST) is a software architectural style that defines a set of constraints to be used for creating web services." [1] Simply put, REST is a stateless protocol that assumes all actions can be performed independently of each other, and all data needed to perform each action is included with each request.

REST was created by Roy Fielding who is one of the principle authors of the HTTP specification ([RFC-2616](https://tools.ietf.org/html/rfc2068)). REST APIs are not restricted to using HTTP, but for the rest of this article we will assume so for simplicity.

# APIs Need a Way To Indicate Errors

In the perfect world, errors would never occur. Sadly, we live in a far from perfect world, and errors are something we must deal with all the time. These errors can vary from incorrect syntax, to the server has imploded. A well designed API takes these issues into account and handles errors in a uniform, and easy to understand manner.

Atop of each HTTP response is what's known as the status-line. The status line contains the HTTP version being used, and the HTTP status code.

```HTTP
HTTP/1.1 200 OK
Server: Apache
Content-Length: 12

Hello World!

```

In the example request above, 200 is the status code, and OK is the message

HTTP status codes can be used as a way to convey if a request completed successfully, or errored out. They're the original source of 404 (NOT FOUND) pages, and why servers return 500 INTERNAL ERROR when they become overloaded. HTTP status codes should be used to classify errors, and more info such as an error code, and error message should always be included in the body of the response.

# The Various Types of HTTP Status Codes

The first digit of each status code indicate which class it belongs to. The classes are as follows:

- 1xx Informational - Transfer protocol related information.
- 2xx Success - The request was successful.
- 3xx Redirection - The requested resource has been moved.
- 4xx Client Errors - The request failed due to an error with it.
- 5xx Server Errors - The request failed due to an error with the server.

For simplicity sake, RESTful APIs don't typically utilize the full spectrum of HTTP status codes. For those interested, a list of all the available status codes can be found in this excellent [MDN article](https://developer.mozilla.org/en-US/docs/Web/HTTP/Status).

## Success Status Codes

Success status codes are used to notify the client that their requested action completed successfully. 200 is the most commonly used status, but if the request was a POST or PUT, then 201 can be used to indicate that the resource was created.

**200 OK** - The request completed successfully.

**201 CREATED** - The request was successful, and a new resource was created.

## Redirection Status Codes

These aren't as commonly used by REST APIs but they do have some use. Typically these are used when an API changes it's endpoints, and the developer wants to notify any legacy users of the change.

**300 MOVED PERMANENTLY** - The endpoint has been changed, and the client needs to use the new one.

## Client Error Status Codes

Client error codes are for issues such as invalid syntax, bad authentication, and more. These are used to indicate that the client needs to fix their mistake.

**400 BAD REQUEST** - Bad input. Typically used when the body of the request was poorly formed.

**401 UNAUTHORIZED** - Bad, or missing authentication.

**403 FORBIDDEN** - A forbidden resource was requested.

**404 NOT FOUND** - The requested resource was not found.

**405 METHOD NOT FOUND** - The HTTP verb used is not supported.

**409 CONFLICT** - The resource requested to be created is a duplicate, and cannot be created.

**429 TOO MANY REQUESTS** - The client is spamming the server with requests, and has been rate limited.

## Server Error Status Codes

These are the worst of the bunch, as they usually mean we can't blame someone else for the issue. They are typically used to indicate that something failed on the server.

**500 INTERNAL ERROR** - Something went really wrong.

**502 BAD GATEWAY** - Service is down, or being upgraded.

**503 SERVICE UNAVAILABLE** - Service is overloaded. Try again later.

# Conclusion

In the end it comes down to the personal preference of the developer designing the API. Some developers prefer to use only a select few status codes, whereas others take advantage of the full spectrum. However you decide to handle errors, be sure to kept it uniform, and predictable.

# Sources

[1] Wikipedia contributors. (2019, January 22). Representational state transfer. In Wikipedia, The Free Encyclopedia. Retrieved 23:35, January 29, 2019, from https://en.wikipedia.org/w/index.php?title=Representational_state_transfer&oldid=879684769

[Exit photo] By Michael Jasmund on Unsplash
https://unsplash.com/photos/t-WxNy6CMyU
