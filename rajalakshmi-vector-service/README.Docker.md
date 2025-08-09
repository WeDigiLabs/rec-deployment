### Building and running your application (with Qdrant vector DB)

Start the stack (API + Qdrant) with:

`docker compose up --build`

Services:
* API server: http://localhost:8000
* Qdrant dashboard / REST: http://localhost:6333 (health at /healthz)

Data persistence: Qdrant data is stored in the named volume `qdrant_storage` so container restarts won't lose vectors. To reset, run `docker compose down -v`.

Environment override: The application uses `QDRANT_URL` from the compose file (http://qdrant:6333 inside the network). If running the app directly on your host, set `QDRANT_URL=http://localhost:6333` in your `.env`.

### Deploying your application to the cloud

First, build your image, e.g.: `docker build -t myapp .`.
If your cloud uses a different CPU architecture than your development
machine (e.g., you are on a Mac M1 and your cloud provider is amd64),
you'll want to build the image for that platform, e.g.:
`docker build --platform=linux/amd64 -t myapp .`.

Then, push it to your registry, e.g. `docker push myregistry.com/myapp`.

Consult Docker's [getting started](https://docs.docker.com/go/get-started-sharing/)
docs for more detail on building and pushing.

### References
* [Docker's Python guide](https://docs.docker.com/language/python/)
* [Qdrant Documentation](https://qdrant.tech/documentation/)