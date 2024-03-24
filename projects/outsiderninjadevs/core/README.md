# @outsiderninjadevs/core

@outsiderninjadevs/core is the Angular core library for the core utils. it has services that helps to build better angular apps with the most helpful functionalities.

![@Outsiderninjadevs/core logo](https://raw.githubusercontent.com/achrafmataich/ond-core/master/projects/outsiderninjadevs/core/assets/ond-logo.png)

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=achrafmataich_ond-core&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=achrafmataich_ond-core)

## Features

- Generate and download CSV files.

## Installation

You can install @outsiderninjadevs/core via npm:

```bash
npm install @outsiderninjadevs/core
```

You also can explicitly give the version

```bash
npm install @outsiderninjadevs/core@17.0.1-rc1
```

## Usage

1. We strongly recommend using the new angular 17 standalone apps, that's why we have no more the `OndCoreModule`

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
