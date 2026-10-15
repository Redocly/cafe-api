# Changelog

## 1.1.0 (2026-10-15)

### Changed

- `page.nextPage` and `page.previousPage` in list responses (`GET /menu`, `GET /orders`) are now the path of the adjacent page, relative to the server URL, for example `/menu?limit=10&after=G0EAAIyUqm8V`.
  The path keeps the query parameters of the request.
  Request it directly instead of passing the value as the `after` or `before` parameter.
  The `after` and `before` parameters still accept a cursor, which is the value of that parameter in the path.

## 1.0.1 (2026-10-14)

### Changed

- Documented the `404` response of `GET /.well-known/oauth-authorization-server`.

### Fixed

- Fixed the `spec-ref-siblings` warnings reported by Redocly CLI.

## 1.0.0 (2026-06-17)

Initial public release.
