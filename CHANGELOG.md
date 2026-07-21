# Changelog

All notable changes to this project will be documented in this file.

## [v2.0.0-rc.1] - Release Candidate

### Added
- **Design System:** Custom UI components with a fresh, vibrant aesthetic replacing standard generic libraries.
- **Payment Abstraction:** Solidified the payment system to support Mock and Razorpay gateways seamlessly.
- **Notification Engine:** Event-driven email notifications using Handlebars templates.
- **Invoice Engine:** Puppeteer-powered automated PDF invoice generation sent automatically on order completion.
- **Real-Time WebSockets:** Live order tracking for customers and KDS updates for kitchen staff.
- **Redis Caching:** Cache-Aside implementation for the Food/Menu catalog to improve throughput.
- **Dockerization:** Fully containerized setup with multi-stage Next.js standalone build and Puppeteer-ready Node backend.
- **Security:** Helmet, express-rate-limit, and mongo-sanitize middlewares integrated.
- **CI/CD:** Automated GitHub Actions workflows for Linting, Typechecking, Building, and Deployment.

### Known Limitations
- The "Razorpay" payment option is currently disabled in the UI; transactions default to the "Mock" gateway for testing.
- Email provider defaults to a Mock service in development unless SMTP variables are configured.

### Technical Debt Addressed
- Fixed over 30 deeply nested TypeScript generic and prop errors during production build preparation.
- Refactored `Table` and `Badge` components for strict typing.
- Optimized MongoDB collections with heavily hit query indexes.
