# ExampleAppAngular

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.13.

## Table of Contents

- [Development Server](#development-server)
- [Code Scaffolding](#code-scaffolding)
- [Building](#building)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Additional Resources](#additional-resources)

## Development Server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Testing

### Running Unit Tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

### Running End-to-End Tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Project Structure

```
src/
├── app/
│   ├── core/                  # Singleton services, interceptors, guards,
│   │   │                      # common base classes loaded ONCE (e.g., AuthService, ErrorHandler)
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   └── auth.guard.ts
│   │   ├── services/
│   │   │   └── notification.service.ts
│   │   └── core.module.ts     # (If using NgModules)
│   │
│   ├── shared/                # Reusable components, directives, pipes, and models
│   │   │                      # that are used across multiple features but don't
│   │   │                      # contain app-wide business logic.
│   │   ├── components/
│   │   │   ├── button/
│   │   │   │   ├── button.component.ts
│   │   │   │   └── button.component.html/.css
│   │   │   ├── modal/
│   │   │   │   ├── modal.component.ts
│   │   │   │   └── modal.component.html/.css
│   │   │   └── ...
│   │   ├── directives/
│   │   │   └── highlight.directive.ts
│   │   ├── pipes/
│   │   │   └── currency-format.pipe.ts
│   │   ├── models/            # Generic interfaces/types
│   │   │   └── user.interface.ts
│   │   ├── shared.module.ts   # (If using NgModules)
│   │   └── index.ts           # Barrel file for easy imports
│   │
│   ├── features/              # Main application features, typically lazy-loaded
│   │   │
│   │   ├── auth/              # Authentication feature
│   │   │   ├── components/    # Presentational components (dumb)
│   │   │   │   ├── login-form/
│   │   │   │   └── register-form/
│   │   │   ├── pages/         # Container components (smart) - often map to routes
│   │   │   │   ├── login-page/
│   │   │   │   │   ├── login-page.component.ts
│   │   │   │   │   └── login-page.component.html/.css
│   │   │   │   └── register-page/
│   │   │   ├── services/
│   │   │   │   └── auth-api.service.ts
│   │   │   ├── models/
│   │   │   │   └── auth-data.interface.ts
│   │   │   ├── auth.routes.ts # Feature-specific routes for lazy loading
│   │   │   └── auth.module.ts # (If using NgModules)
│   │   │
│   │   ├── dashboard/         # Dashboard feature
│   │   │   ├── components/
│   │   │   │   └── welcome-card/
│   │   │   ├── pages/
│   │   │   │   ├── dashboard-page.component.ts
│   │   │   │   └── dashboard-page.component.html/.css
│   │   │   ├── services/
│   │   │   ├── dashboard.routes.ts
│   │   │   └── dashboard.module.ts # (If using NgModules)
│   │   │
│   │   └── products/          # Products feature
│   │       ├── components/
│   │       ├── pages/
│   │       ├── services/
│   │       ├── models/
│   │       ├── product-detail.guard.ts   # Feature-specific guard
│   │       ├── product-list.resolver.ts  # Feature-specific resolver
│   │       ├── products.routes.ts
│   │       └── products.module.ts        # (If using NgModules)
│   │
│   ├── app.component.ts       # Root component (application shell)
│   ├── app.config.ts          # Angular 15+ standalone app configuration
│   ├── app.routes.ts          # Main application routes
│   └── main.ts                # Application bootstrap
│
├── assets/                    # Static assets like images, fonts, JSON data
│   ├── images/
│   └── data/
│
├── environments/              # Environment-specific configurations
│   ├── environment.ts
│   └── environment.development.ts
│
├── styles.css                 # Global styles, theme variables, utility classes
├── index.html                 # Main HTML file
└── ...                        # Other config files (karma.conf.js, tsconfig.json, etc.)
```

### Architecture Overview

#### Core Module
- **Purpose**: Contains singleton services, interceptors, guards, and common base classes that are loaded once
- **Examples**: AuthService, ErrorHandler, HTTP interceptors
- **Import**: Only in the root module (AppModule)

#### Shared Module
- **Purpose**: Contains reusable components, directives, pipes, and models used across multiple features
- **Examples**: Button components, Modal components, Custom pipes
- **Import**: Can be imported by feature modules that need these shared resources

#### Features Module
- **Purpose**: Contains main application features, typically lazy-loaded for better performance
- **Structure**: Each feature has its own components, pages, services, models, and routes
- **Examples**: Authentication, Dashboard, Products

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.