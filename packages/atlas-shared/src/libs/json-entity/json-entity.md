# Easy to use json to model casting

### Callback and @Cast config definitions

```typescript
export type CastCallback = (currentValue?: any, jsonObject?: any) => any;

export interface CastConfig {
  property?: string;
  from?: CastCallback;
  to?: CastCallback;
  readOnly?: CastCallback | boolean;
  trim?: boolean; // default:true
}
```

### Predefined helper functions

- isNull()
- castToBoolean(trueValue: any = '1')
- castBooleanToString(trueValue: any = '1', falseValue: any = '0')
- castToNumber(keepNull = true)
- castToString(keepNull = true)

### General @Cast usage

```typescript
class UserModel extends JsonEntityModel {
  @Cast({ property: 'idUser', from: castToNumber() })
  id: number | null = null;

  @Cast()
  username: string;

  @Cast({ readOnly: isNull() })
  nickname: string | null = null;

  @Cast({ property: 'age', from: v => v > 18, readOnly: true })
  isAdult: boolean;
}

const user1 = new UserModel().cast({
  idUser: '42',
  nickname: null,
  username: 'user_name',
  age: 26
});

// user1.id === 42
// user1.nickname === null
// user1.username === "user_name"
// user1.isAdult === true

const json = user1.toJson(); // readOnly === true values are skipped!

// json = { property: 42, username: "user_name" };
// json.nickname === undefined
// json.isAdult === undefined

// for internal models the mapping can be disabled and the property definition is ignored

const user2 = new UserModel().cast(
  {
    id: 42,
    nickname: null,
    username: 'user_name',
    isAdult: true
  },
  false
);
```

### Using @HasOne decorators

```typescript
class LocationModel extends JsonEntityModel {
  @Cast()
  country: string;

  @Cast()
  city: string;
}

class UserModel extends JsonEntityModel {
  @Cast()
  name: string;

  @HasOne(LocationModel)
  @Cast()
  address: LocationModel;
}

const user = new UserModel().cast({
  name: 'Ika',
  address: {
    city: 'Batumi',
    country: 'Georgia'
  }
});
```

### Using @HasMany decorators

```typescript
class BookModel extends JsonEntityModel {
  @Cast() isbn: string;
}

class AuthorModel extends JsonEntityModel {
  @Cast() name: string;

  @HasMany(BookModel)
  @Cast()
  books: BookModel[];
}

const author = new AuthorModel().cast({
  name: 'Philip J. Fry',
  books: [{ isbn: '9780345404473' }, { isbn: '9780679740667' }]
});
```
