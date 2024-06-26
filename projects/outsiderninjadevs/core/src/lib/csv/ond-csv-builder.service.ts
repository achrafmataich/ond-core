import {Injectable} from '@angular/core';

type ValidValuesType = string | number | boolean | null | undefined;
type DelimitersType = ";" | ",";

/**
 * Service for building and manipulating CSV data.
 * This service provides methods for converting lists of objects to CSV strings and downloading CSV files.
 *
 *  Here is how to inject this service in your component, so you can generate and download a `CSV` file
 *
 *  1. If you don't know the type of data you have, you can use the `any` type
 *
 *  @example
 *
 *  ```ts
 *    constructor(private readonly csv: OndCsvBuilderService){}
 *
 *    handle_click() {
 *      this.csv.toCSVAsync<any>(this.list)
 *        .then(res => {
 *          // Do something
 *        })
 *    }
 *  ```
 *
 *  2. If you have strongly typed your data (you have a data of type `Pet`)
 *
 *  @example
 *
 *  ```ts
 *    constructor(private readonly csv: OndCsvBuilderService){}
 *
 *    handle_click() {
 *      this.csv.toCSVAsync<Pet>(this.list)
 *        .then(res => {
 *          // Do something
 *        })
 *    }
 *  ```
 */
@Injectable({
  providedIn: 'root',
})
export class OndCsvBuilderService {

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
   *    csv.toCSV<Pet>(pets, ";")
   *     .then(csvStr => {
   *       // do whatever you want with the string csv value.
   *     });
   *  ```
   *
   * @template T
   * @param {T[]} items The list of objects to convert to CSV.
   * @param {DelimitersType} delimiter (optional) the delimiter of the CSV cells
   * @returns {Promise<string>}
   */
  public toCSVAsync = async <T extends object>(items: T[], delimiter: DelimitersType = ","): Promise<string> => {
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
   * Parses a CSV file into an array of objects.
   *
   * @param {File} file - The CSV file to parse.
   * @param {DelimitersType} delimiter - The delimiter used in the CSV file (default: ",").
   * @param hasHeader - Indicates whether the CSV file has a header line (default: true).
   * @returns A promise that resolves to an array of objects representing the CSV data.
   * @throws An error if the CSV file is invalid or missing a header line.
   *
   * @example
   *
   * ```ts
   *  const file: File = // your CSV File object;
   *
   *  this.csv.fromCSV(file, ';', true)
   *    .then((data) => {
   *      console.log(data); // the result is here
   *    })
   *    .catch((error) => {
   *      console.error(error);
   *    });
   * ```
   */
  public fromCSV = async (file: File, delimiter: DelimitersType = ",", hasHeader?: boolean): Promise<Record<string, ValidValuesType>[]> => {
    return new Promise<Record<string, ValidValuesType>[]>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (): void => {
        const fileContents: string | ArrayBuffer | null = reader.result;

        try {
          if (typeof fileContents !== 'string') {
            reject(new Error('Invalid file content.'));
          } else {
            const lines: string[] = fileContents?.split(/\r\n|\r|\n/);

            if (hasHeader && lines.length > 0) {
              const header: string[] | null = this.extractHeader(lines.shift(), delimiter);

              if (!header) {
                reject(new Error('CSV file does not have a valid header line.'));
                return;
              }

              const data: Record<string, ValidValuesType>[] = this.parseData(lines, delimiter, header);
              resolve(data);
            } else {
              reject(new Error('CSV file does not have a header line.'));
            }
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.readAsText(file);
    });
  };

  /**
   * @description
   *
   * Extracts the header line from the CSV content.
   *
   * @param line - The header line from the CSV file.
   * @param delimiter - The delimiter used in the CSV file.
   * @returns {string[] | null} An array of column names from the header line.
   */
  private extractHeader(line: string | undefined, delimiter: DelimitersType): string[] | null {
    if (!line) return null;
    return line.split(delimiter).map((columnName) => columnName.trim());
  }

  /**
   * @description
   *
   * Parses the data lines from the CSV content.
   *
   * @param {string[]} lines - The data lines from the CSV file.
   * @param {DelimitersType} delimiter - The delimiter used in the CSV file.
   * @param {string[]} header - An array of column names from the header line.
   * @returns {Record<string, any>[]} An array of objects representing the parsed CSV data.
   */
  private parseData(lines: string[], delimiter: DelimitersType, header: string[]): Record<string, ValidValuesType>[] {
    const data: Record<string, ValidValuesType>[] = [];

    for (const line of lines) {
      const values = line.split(delimiter);
      const rowData: Record<string, ValidValuesType> = {};

      if (line === "") continue;
      for (let i = 0; i < header.length; i++) {
        const key = header[i];
        const value = this.getBestValueOfData(values[i]);
        if (value === undefined || value === null) continue;
        rowData[key] = value;
      }

      data.push(rowData);
    }

    return data;
  }


  /**
   * @description
   *
   * A function that receive a string value and returns this value in its appropriate type
   *
   * @param {string | undefined} value The string value
   * @returns {ValidValuesType} The value in the appropriate type
   */
  private getBestValueOfData = (value?: string): ValidValuesType => {
    if (value === undefined || value.trim() === "") return undefined;
    if (value.toLowerCase().trim() === "true") return true;
    if (value.toLowerCase().trim() === "false") return false;
    if (!isNaN(Number(value.toLowerCase().trim()))) return Number(value.toLowerCase().trim());
    return value;
  }


  /**
   * @description
   *
   * private
   *
   * @param element
   * @param keys
   * @returns values
   */
  private getElementValuesOfKeys = <T extends object>(element: T, keys: (keyof T)[]): string[] => {
    const values: string[] = [];
    for (const key of keys) {
      values.push(element[key] as string);
    }
    return values;
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
        const blob = new Blob([csvString], {type: 'text/csv'});
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
   * @param list
   * @returns headers
   */
  private generateHeaders = <T extends object>(list: T[]): (keyof T)[] => {
    const strKeys: string[] = list ? [...new Set(list.flatMap(obj => Object.keys(obj)))] : [];
    return strKeys.map(val => {
      return val as keyof T;
    });

  }
}
