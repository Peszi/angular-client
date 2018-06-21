import {animate, keyframes, state, style, transition, trigger} from '@angular/animations';

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

export const SLIDE_AND_SHOW =
  trigger('slide', [
    state('show', style( {
      transform: 'translateX({{ width }})'
    }), {params: {width: '-50px'}}),
    state('hide', style( {
      transform: 'translateX(0px)'
    })),
    transition('* => show', animate('350ms ease-in-out')),
    transition('* => hide', animate('250ms ease-in-out'))
  ]);

export const WIGGLE_ANIM =
  trigger('wiggle', [
    state('wiggle', style({})),
    transition('* <=> wiggle', [
      animate(250, keyframes([
        style({ transform: 'scale(.75) skewX(-5deg) rotate(-5deg)', offset: 0.25}),
        style({ transform: 'skewY(5deg) rotate(5deg)',  offset: 0.5}),
        style({ transform: 'skewX(-5deg) rotate(-5deg) scale(1.25)',     offset: 0.75}),
        style({ transform: 'scale(1.25)',  offset: 1.0})
      ]))
    ]),
  ]);

export const BACKGROUND_SCROLL =
  trigger('loadingScroll', [
    state('normal', style( {
      backgroundColor: '#007bff'
    })),
    state('pending', style( {
      backgroundColor: '#007bff',
      backgroundPosition: '0 0'
      // background: 'linear-gradient(310deg, var(--colorPrimary), var(--colorAccent)) !important'
    })),
    state('pendingOn', style( {
      backgroundColor: '#007bff',
      backgroundPosition: '48px 0'
      // background: 'linear-gradient(130deg, var(--colorPrimary), var(--colorAccent)) !important'
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
