export class Utility {

  public static getCountWithName(count: number, name: string): String {
    if (count === 0) {
      return 'no ' + name + 's';
    } else if (count === 1) {
      return '1 ' + name;
    } else {
      return count + ' ' + name + 's';
    }
  }
}
