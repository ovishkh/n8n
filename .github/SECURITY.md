# Security Policy

## Reporting Security Vulnerabilities

**IMPORTANT**: Do not report security vulnerabilities through public GitHub issues.

If you discover a security vulnerability in the N8N Workflow Library, please email the details to the maintainers instead. Please include:

1. **Description** of the vulnerability
2. **Location** of the affected code (file, line number)
3. **Steps to reproduce** the issue
4. **Potential impact** of the vulnerability
5. **Suggested fix** (if you have one)

### Security Report Template

```
Subject: Security Vulnerability Report - [Brief Description]

Description:
[Detailed description of the vulnerability]

Affected Component(s):
- [File/Component name]
- [Version or branch affected]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [Continue...]

Potential Impact:
[Describe the security implications]

Suggested Fix:
[If applicable, suggest how to fix the vulnerability]

Additional Information:
[Any other relevant details]
```

## Security Guidelines

### For Contributors

- ✅ **DO** review code changes for security issues before committing
- ✅ **DO** follow secure coding practices
- ✅ **DO** keep dependencies updated
- ✅ **DO** use `.gitignore` for sensitive files
- ✅ **DO** report vulnerabilities responsibly

- ❌ **DON'T** commit API keys, credentials, or tokens
- ❌ **DON'T** commit passwords or authentication tokens
- ❌ **DON'T** commit private configuration files
- ❌ **DON'T** log sensitive information
- ❌ **DON'T** share security issues publicly before they're fixed

### For Developers Using This Library

- Always validate and sanitize user input
- Use HTTPS when accessing the website
- Keep your n8n instance and plugins updated
- Use strong authentication credentials
- Review workflows before importing them
- Test in a non-production environment first
- Enable audit logging for sensitive workflows

## Security Best Practices

### Repository Security

1. **Branch Protection**
   - Main branch requires pull request reviews
   - Status checks must pass before merging
   - Dismiss stale pull request approvals

2. **Dependency Management**
   - Keep npm packages updated
   - Use `npm audit` to check for vulnerabilities
   - Review package changelog before updating

3. **Access Control**
   - Use strong, unique passwords
   - Enable two-factor authentication (2FA)
   - Review collaborator permissions regularly
   - Revoke access when no longer needed

### Code Security

1. **Input Validation**
   - Validate all user inputs
   - Use allowlists for expected formats
   - Sanitize data before use

2. **Data Protection**
   - Never hardcode secrets
   - Use environment variables for sensitive data
   - Encrypt sensitive data in transit
   - Don't log sensitive information

3. **Error Handling**
   - Don't expose system information in errors
   - Use generic error messages for users
   - Log detailed errors securely for developers

4. **Dependency Security**
   - Review dependencies before adding
   - Check for known vulnerabilities
   - Keep audit logs of third-party access

## Vulnerability Response Process

1. **Report Received**: We acknowledge receipt within 48 hours
2. **Assessment**: We evaluate the severity and impact
3. **Development**: We work on a fix in a private branch
4. **Testing**: We thoroughly test the fix
5. **Release**: We publish a security patch
6. **Disclosure**: We credit the reporter (if desired) and document the fix

## Supported Versions

| Version  | Supported          | Notes                        |
| -------- | ------------------ | ---------------------------- |
| Latest   | ✅ Full support    | Receive all security updates |
| Previous | ⚠️ Limited support | Security fixes only          |
| Older    | ❌ Not supported   | Update to latest version     |

## Security Headers

The website includes:

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Referrer-Policy: strict-origin-when-cross-origin`

## HTTPS & TLS

- ✅ All traffic is encrypted with HTTPS
- ✅ TLS 1.2+ required
- ✅ Strong cipher suites configured
- ✅ Valid SSL/TLS certificate

## Data Privacy

- ✅ No personal data collected
- ✅ No tracking or analytics (optional Google Analytics)
- ✅ All processing happens in browser
- ✅ No data stored on servers
- ✅ Workflows are read-only exports

## Compliance

This project follows security best practices including:

- OWASP Top 10 prevention
- CWE/SANS top 25 awareness
- Secure coding standards
- Regular security reviews

## Security Contacts

For security concerns, please contact the maintainers privately:

- Report via GitHub Security Advisory (if available)
- Email to project maintainers
- Response time: 48 hours maximum

## Third-Party Integrations

This library provides n8n workflow exports. Security of integrations depends on:

- N8N platform security: https://n8n.io/security
- Third-party service security (Google, Slack, etc.)
- Your credential management
- Network security

## Regular Security Updates

We perform:

- ✅ Monthly dependency audits
- ✅ Quarterly security reviews
- ✅ Regular code analysis
- ✅ Community feedback monitoring

## Resources

- **OWASP**: https://owasp.org/
- **CWE**: https://cwe.mitre.org/
- **NIST**: https://www.nist.gov/
- **N8N Security**: https://n8n.io/security

## Questions?

If you have security questions or concerns, please contact the maintainers privately rather than through public issues.

---

**Last Updated**: 27 May 2026
**Version**: 1.0.0
**Status**: Active
