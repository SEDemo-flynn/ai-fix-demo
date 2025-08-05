#============================
# Build the solution
#============================
FROM checkmarx.jfrog.io/ast-docker/chainguard/go-fips:1.24.5.1-r0@sha256:a486d1d5281fbee7fcb232f321c29e8c29fcdd5401530948960b19d3a0132603 as build-env
USER root

ARG GIT_USER
ARG GIUT_TOKEN

RUN test -n "$GIT_TOKEN" || (echo "Error: GIT_TOKEN not set" && false)
RUN test -n "$GIT_USER" || (echo "Error: GIT_USER not set" && false)

WORKDIR /app
ENV GOPRIVATE=github.com/checkmarxDev/*,github.com/CheckmarxDev/*,github.com/Checkmarx-Containers/*

RUN env
RUN git config --global url."https://${GIT_USER}:${GIT_TOKEN}@github.com".insteadOf "https://github.com"

#Copy go mod and sum files
COPY go.mod .
COPY go.sum .

## Get dependencies - will also be cached if we won't change mod/sum
RUN go mod download -x
# COPY the source code as the last step
COPY . .

#============================
# Unit Tests
#============================
FROM build-env AS test
WORKDIR /app

#install Ginkgo and GoOmega to run tests
RUN go install github.com/onsi/ginkgo/v2/ginkgo
RUN go install github.com/onsi/gomega/...
ENV PATH="/root/go/bin:${PATH}"
RUN $(go env GOPATH)/bin/ginkgo version


#run unit tests
RUN $(go env GOPATH)/bin/ginkgo -tags unit --skip-package=tests/integrationTests --vv --trace ./...

#============================
# Publish
#============================
FROM test AS publish
# Build the Go app
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go mod vendor && \
    go build -ldflags="-s -w" -a -installsuffix cgo -o containers-worker cmd/main.go cmd/config.go

#============================
# Service runtime
#============================
FROM checkmarx.jfrog.io/ast-docker/chainguard/libcap-fips:2.76-r0@sha256:33d8f36d0b17134f22dde53c78767725c3c7bec7291b093dee2369ed4990047c

ARG COMMIT_SHA
ARG RELEASE_TAG

LABEL cx.commit-sha ${COMMIT_SHA}
LABEL cx.release-tag ${RELEASE_TAG}

COPY --from=publish /app/containers-worker /app/containers-worker
#RUN setcap 'cap_net_bind_service=+ep' /app/containers-worker


EXPOSE 80

ENTRYPOINT ["/app/containers-worker"]