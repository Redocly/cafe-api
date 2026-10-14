# Changelog

## 1.1.0 (2026-10-14)

### Changed

- Replaced `GET /order-items?filter=orderId:<id>` with `GET /orders/{orderId}/items`.
  This is a breaking change: the old path returns `404`, and so does an unknown order instead of an empty list.
- Documented the `404` response of `GET /.well-known/oauth-authorization-server`.

### Fixed

- Fixed the `spec-ref-siblings` warnings reported by Redocly CLI.

## 1.0.0 (2026-06-17)

Initial public release.
