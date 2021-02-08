---
description: Learn more about the Database
---

# Database

## Introduction

Our Framework has support for a wide range of database systems. This is provided by [TypeORM](https://typeorm.io/#/).   
The DatabaseService is ready to use for your gamemode. Setup your credentials inside the environment.json and start using the service.

{% hint style="warning" %}
We don't teach you the interaction and creation for databases. If you have any questions about database basics, consult the [docs](https://typeorm.io/#/).
{% endhint %}

## How to use

Using the DatabaseService is fairly simple. Only bootstrap the service and you are ready to go.

```typescript
@Module()
@singleton()
export class ServerModule {

  constructor(
      private readonly databaseService: DatabaseService
  ) {}

  /**
   * Initialize the database service
   * 
   * @param {Function} done
   */
  @Before
  public startDatabase(done: CallableFunction): void {
    UtilsService.log('Starting ~y~DatabaseService~w~');

    this.databaseService
        .initialize()
        .subscribe(() => {
          UtilsService.log('Started ~lg~DatabaseService~w~');
          done();
        });
  }

}
```

{% hint style="success" %}
If you're not familiar at TypeORM yet, feel free to check out our sample gamemode and see how we use it.
{% endhint %}

