import { isValid } from 'date-fns';
import type { ValidatorFn } from '@angular/forms';



export const validDateValidatorFn: ValidatorFn = ({ value }) => {
  return isValid(value)
    ? null
    : {
      invalidDate: true
    }
  };


export const MONTH_LIST = (locale: Intl.LocalesArgument) => [...Array(12).keys()].map(index => {
  const date = new Date();

  date.setMonth(index);

  return date.toLocaleString(locale, { month: 'long' })
});
