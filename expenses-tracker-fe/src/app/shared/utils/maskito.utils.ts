import type { MaskitoOptions } from '@maskito/core';
import { maskitoDateOptionsGenerator, maskitoNumberOptionsGenerator } from '@maskito/kit';



export const AMOUNT_MASK: MaskitoOptions = maskitoNumberOptionsGenerator({
  min: 0,
  precision: 0,
  thousandSeparator: ' '
});

export const DATE_MASK: MaskitoOptions = maskitoDateOptionsGenerator({
  mode: 'dd/mm/yyyy',
  separator: '.',
  max: new Date()
});
