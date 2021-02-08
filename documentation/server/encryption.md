---
description: Learn more about Encryption
---

# Encryption

## Introduction

We have an simple encryption service powered by [sjcl](http://bitwiseshiftleft.github.io/sjcl/). We using it for creating secure tokens for out discord auth module. But if you want, you can use it too. We only implement encryption, **no decryption**.

## Base Usage

```typescript
export class MyComponent {
    
    // Persistent SHA256 Hash
    public myMethod(): void {
        const tokenData = 'myAwesomeDataToBeEncrypted';
        const encryptedToken = EncryptionService.sha256(tokenData);
        // Now inside encryptedToken lives your encrypted data.
    }
    
    // Random SHA256 Hash
    public myOtherMethod(): void {
        const tokenData = 'myAwesomeDataToBeEncrypted';
        const encryptedToken = EncryptionService.sha256Random(tokenData);
        // Now inside encryptedToken lives your encrypted data.
    }

}
```

