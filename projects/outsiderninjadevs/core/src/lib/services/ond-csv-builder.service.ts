import { Injectable } from '@angular/core';

/**
 * Service for building and manipulating CSV data.
 * This service provides methods for converting lists of objects to CSV strings and downloading CSV files.
 * @template T - The type of objects to work with in the CSV operations.
 * 
 *  Here is how to inject this service in your component so you can generate and download a `CSV` file
 *  
 *  1. If you don't know the type of data you have, you can use the `any` type
 *
 *  @example 
 *  
 *  ```ts
 *    constructor(private readonly csv: OndCsvBuilderService<any>){}
 *  ```
 * 
 *  2. If you have strongly typed your data (you have a data of type `Pet`)
 * 
 *  @example
 * 
 *  ```ts
 *    constructor(private readonly csv: OndCsvBuilderService<Pet>){}
 *  ```
 */
@Injectable({
  providedIn: 'root'
})
export class OndCsvBuilderService<T extends object> {

  /**
   * @deprecated
   * 
   * This function is deprecated, it will be removed in future releases.
   * 
   * @description
   * 
   * Converts a list of objects to CSV.
   * 
   * @example
   * 
   *  ```ts
   *    // we declare the Pet type
   *    interface Pet {
   *      name: string;
   *      age: number;
   *    }
   * 
   *    // we create a list of pets
   *    const pets: Pet[] = [
   *      {
   *        name: "Filo",
   *        age: 4
   *      },
   *      {
   *        name: "Rob",
   *        age: 9
   *      },
   *    ];
   * 
   *    // we generate the CSV string value of this list
   *    // csv is an instance of OndCsvBuilderService injected here
   *    const strCsvPets = csv.toCSV(pets, ";"); // the delimiter (;) is optional
   *  ```
   *
   * @param {T[]} items The list of objects to convert to CSV.
   * @param {"," | ";"} delimiter (optional) the delimiter of the CSV cells
   * @returns {string}
   */
  public toCSV = (items: T[], delimiter: "," | ";" = ","): string => {
    const headers = this.generateHeaders(items);
    let csvString = headers.join(delimiter) + '\n';

    for (const item of items) {
      const values = this.getElementValuesOfKeys(item, headers);
      csvString += values.join(delimiter) + '\n';
    }

    return csvString;
  }

  /**
  * @description
  * 
  * Async function that converts a list of objects of type `T` to CSV.
  * 
  * @example
  * 
  *  ```ts
  *    // we declare the Pet type
  *    interface Pet {
  *      name: string;
  *      age: number;
  *    }
  * 
  *    // we create a list of pets
  *    const pets: Pet[] = [
  *      {
  *        name: "Filo",
  *        age: 4
  *      },
  *      {
  *        name: "Rob",
  *        age: 9
  *      },
  *    ];
  * 
  *    // we generate the CSV string value of this list
  *    // csv is an instance of OndCsvBuilderService injected here
  *    const strCsvPets = csv.toCSV(pets, ";"); // the delimiter (;) is optional
  *  ```
  *
  * @param {T[]} items The list of objects to convert to CSV.
  * @param {"," | ";"} delimiter (optional) the delimiter of the CSV cells
  * @returns {Promise<string>}
  */
  public toCSVAsync = async (items: T[], delimiter: "," | ";" = ","): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      try {

        const headers = this.generateHeaders(items);
        let csvString = headers.join(delimiter) + '\n';

        for (const item of items) {
          const values = this.getElementValuesOfKeys(item, headers);
          csvString += values.join(delimiter) + '\n';
        }

        resolve(csvString);
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * @description
   * 
   * private
   * 
   * @param {T} element
   * @param {(keyof T)[]} keys
   * @returns {string[]}
   */
  private getElementValuesOfKeys = (element: T, keys: (keyof T)[]): string[] => {
    const vals: string[] = [];
    for (const key of keys) {
      vals.push(element[key] as string);
    }
    return vals;
  }

  /**
   * @deprecated
   * 
   * This function is deprecated, it will be removed in future releases.
   * 
   * @description
   * 
   * Downloads a CSV file.
   *
   * @param {string} csvString The CSV string to download.
   * @param {string} filename The name of the CSV file to download.
   */
  public downloadCSV = (csvString: string, filename: string): void => {
    const blob = new Blob([csvString], { type: 'text/csv' });
    const anchorElement = document.createElement('a');
    anchorElement.href = URL.createObjectURL(blob);
    anchorElement.download = filename;
    anchorElement.click();
  }

  /**
   * @description
   * 
   * Async function that downloads a CSV file from a CSV string.
   *
   * @param {string} csvString The CSV string to download.
   * @param {string} filename The name of the CSV file to download.
   * @returns 
   */
  public downloadCSVAsync = async (csvString: string, filename: string): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      try {
        const blob = new Blob([csvString], { type: 'text/csv' });
        const anchorElement = document.createElement('a');
        anchorElement.href = URL.createObjectURL(blob);
        anchorElement.download = filename;
        anchorElement.click();
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * @description
   * Generates the headers list
   * 
   * @param {T[]} list 
   * @returns {(keyof T)[]}
   */
  private generateHeaders = (list: T[]): (keyof T)[] => {
    const strKeys: string[] = list ? [...new Set(list.flatMap(obj => Object.keys(obj)))] : [];
    return strKeys.map(val => {
      return val as keyof T;
    });

  }
}
