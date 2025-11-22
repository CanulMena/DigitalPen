
export class PaginationDto {
    constructor(
      public page?: number,
      public limit?: number
    ){}

    public static create( page?: any, limit?: any ): [string?, PaginationDto?] {

      if( page && limit ) {
        const newPage = +page;
        const newLimit = +limit;
        if ( typeof newPage !== 'number' || newPage <= 0 ) return ['newPage must be a number greater than 0', undefined];
        if ( typeof newLimit !== 'number' || newLimit <= 0 ) return ['newLimit must be a number greater than 0', undefined];

        return [undefined, new PaginationDto(newPage, newLimit)];
      }

      return [undefined, undefined]

    }
}