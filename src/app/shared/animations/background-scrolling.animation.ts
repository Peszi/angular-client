import {animate, state, style, transition, trigger} from '@angular/animations';

export const SHOW_AND_HIDE =
  trigger('showElement', [
    state('show', style( {
      opacity: '1.0'
    })),
    state('hide', style( {
      opacity: '0.0'
    })),
    transition('* => show', animate(250)),
    transition('* => hide', animate('10000ms ease'))
  ]);

export const BACKGROUND_SCROLL =
  trigger('loadingScroll', [
    state('normal', style( {
      backgroundColor: '#007bff'
    })),
    state('pending', style( {
      backgroundColor: '#007bff',
      backgroundPosition: '0 0'
    })),
    state('pendingOn', style( {
      backgroundColor: '#007bff',
      backgroundPosition: '48px 0'
    })),
    state('fail', style( {
      backgroundColor: '#dc3545'
    })),
    state('success', style( {
      backgroundColor: '#28a745'
    })),
    transition('* => pending', animate(0)),
    transition('* => pendingOn', animate(1000)),
    transition('* => fail', animate(0)),
    transition('* => success', animate(0)),
    transition('fail => normal', animate(2500)),
    transition('success => normal', animate(2500)),
    transition('* => normal', animate(500))
]);
