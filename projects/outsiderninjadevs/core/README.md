# @outsiderninjadevs/core

@outsiderninjadevs/core is the Angular core library for the core utils. it has services that helps to build better angular apps with the most helpful functionnalities.

![@outsiderninjadevs/core logo](assets/ond-logo.png)

[![CI/CD Angular Quality Gate](https://github.com/achrafmataich/ond-core/actions/workflows/quality.yml/badge.svg)](https://github.com/achrafmataich/ond-core/actions/workflows/quality.yml)

## Features

- Generate and download CSV files.

## Installation

You can install @outsiderninjadevs/core via npm:

```bash
npm install @outsiderninjadevs/core
```

## Usage

1. Import the module `OndCoreModule` in your `@NgModule`

    ```ts
    import { OndTabularModule } from '@outsiderninjadevs/core';

    @NgModule({
    declarations: [
        // ...
    ],
    imports: [
        OndCoreModule, // Here is the module!
        // ...
    ],
    })
    export class YourModule { }
    ```

2. Create the list of elements

    ```ts

    // imports

    interface IUser {
        name: string;
        age: number;
        is_an_admin?: boolean;
    }

    @Component({
        // properties
    })
    export class MyComponent {
        usersList: IUser[] = [
            {
                name: 'Achraf',
                age: 24
            },
            {
                name: 'Alae',
                age: 18
            },
            // ...
        ];

    }

    ```

3. We need to inject the `OndCsvBuilderService` in out component

    ```ts

    import {OndCsvBuilderService} from '@outsiderninjadevs/core';
    
    // imports

    @Component({
        // properties
    })
    export class MyComponent {
        
        constructor(
            private readonly csv: OndCsvBuilderService
        ) {}

    }
    
    ```

4. We build the csv then we download.

    ```ts

    import {OndCsvBuilderService} from '@outsiderninjadevs/core';

    // imports

    interface IUser {
        name: string;
        age: number;
        is_an_admin?: boolean;
    }

    @Component({
        // properties
    })
    export class MyComponent {
        usersList: IUser[] = [
            {
                name: 'Achraf',
                age: 24
            },
            {
                name: 'Alae',
                age: 18
            },
            // ...
        ];

        constructor(
            private readonly csv: OndCsvBuilderService
        ) {}

        on_click(){
            // toCSVAsync and downloadCSVAsync are asynchronous functions
            csv.toCSVAsync<IUser>(usersList, ";") // the delimiter (;) is optional
                .then(async csvString => {
                    try{
                        await csv.downloadCSVAsync(csvString, "users.csv");
                    } catch (errorDown => {
                        alert("Error on download " + errorDown);
                    })
                }).catch(error => {
                    alert("Error " + error);
                });
        }
    }
    
    ```

## License

This project is licensed under the MIT License - see the **`LICENSE`** file for details.
