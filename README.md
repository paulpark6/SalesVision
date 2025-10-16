# SalesVision Dashboard

This is a Next.js application for a sales analytics dashboard, built with Firebase Studio.

## Getting Started

To get the project up and running on your local machine, follow these steps.

### Prerequisites

Make sure you have Node.js and npm (or yarn/pnpm) installed on your system.

### Installation

1.  Open your terminal in the project's root directory.
2.  Install the required packages by running:

    ```bash
    npm install
    ```

### Running the Development Server

Once the installation is complete, you can start the local development server:

```bash
npm run dev
```

This will start the application, and you can view it in your browser at [http://localhost:9002](http://localhost:9002). The app will automatically reload if you make any changes to the source files.

### Other Scripts

- `npm run build`: Builds the application for production.
- `npm run start`: Starts a production server.
- `npm run lint`: Lints the code to check for errors.
- See `docs/local-db.md` for the local PostgreSQL development setup.

## Building and Running with Docker

You can containerize the application with the provided `Dockerfile` and run it locally before
deploying to Cloud Run.

### Build the image

```bash
docker build -t salesvision-web .
```

### Run the container locally

The container listens on port `8080` (Cloud Run's default). Map it to a port on your machine to test
the production build locally.

```bash
docker run --rm -p 8080:8080 salesvision-web
```

Then open [http://localhost:8080](http://localhost:8080) to verify the site.
