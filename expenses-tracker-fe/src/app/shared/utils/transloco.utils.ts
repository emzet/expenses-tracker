import { filter, map, startWith } from 'rxjs';
import type { Translation, TranslocoService } from '@jsverse/transloco';



export const translocoLangChanged$ = (translocoService: TranslocoService) => translocoService.events$.pipe(
  startWith({
    type: 'langChanged',
    payload: {
      langName: translocoService.getActiveLang()
    }
  }),
  map(({ payload: { langName } }) => translocoService.getTranslation(langName)),
  filter((translation: Translation) => !!Object.keys(translation).length)
)
