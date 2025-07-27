# Dockerfile

This Dockerfile contains several intentional vulnerabilities for security testing:

1. **Using latest tag** (Low Severity) - Using the `latest` tag for base images can cause unexpected behavior and inconsistent builds.

2. **Running with root privileges** (Medium Severity) - The container runs as root, which is a security risk.

3. **Using --force flag with npm install** (Low Severity) - Forces installation regardless of conflicts.

4. **Exposing unnecessary ports** (Low Severity) - More ports than needed are exposed.

5. **Running with full privileges** (Medium Severity) - No security options are specified to limit container privileges.
