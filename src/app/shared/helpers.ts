import { Params } from '@angular/router';
import { Filters } from './types';

export const isObjEmpty = (obj: Params) => {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }

  return true;
};

export const hasFilters = (filters: Filters): boolean => {
  if (
    filters.price !== null ||
    filters.vendors !== null ||
    filters.categories !== null
  ) {
    return true;
  }

  return false;
};
